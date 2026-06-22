class TestResultModel {
    state = {
        tests: [],
        failed: 0,
        passed: 0,
    };

    constructor(text) {
        this.parseTestOutput(text);
    }

    getState() {
        return this.state;
    }

    cleanLine(line) {
        return line.replace(/[\s─\-]+$/, '').trim();
    }

    parseTestOutput(outputText) {
        const result = {
            passed: 0,
            failed: 0,
            tests: []
        };

        const errors = [];

        if (!outputText.includes('passed')) {
            errors.push('Блок passed отсутствует.');
        }

        if (!outputText.includes('failed')) {
            errors.push('Блок failed отсутствует.');
        }

        if (!outputText.includes('[chromium]')) {
            errors.push('Строки с тестами отсутствуют.');
        }

        if (errors.length > 0) {
            const parts = [
                'Невозможно распарсить результаты теста. Причины:',
                '',
                '- ' + errors.join('\n- '),
            ];

            throw new Error(parts.join('\n'));
        }

        const lines = outputText.split('\n');
        let inErrorBlock = false;
        let inDetailsBlock = false;
        let currentTest = null;
        const testsMap = new Map();

        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];

            // Пропускаем строки с прогрессом [xxx/xxx]
            if (line.match(/^\[\d+\/\d+\] /)) {
                continue;
            }

            if (line.includes('passed') && !line.includes('chromium')) {
                const passedMatch = line.match(/(\d+)\s+passed/);

                if (passedMatch) {
                    result.passed = parseInt(passedMatch[1]);
                }
            } else if (line.includes('failed') && !line.includes('chromium')) {
                const failedMatch = line.match(/(\d+)\s+failed/);

                if (failedMatch) {
                    result.failed = parseInt(failedMatch[1]);
                }

                inDetailsBlock = true;
            } else if (line.match(/^\s*\d+\)\s+\[chromium\]/)) {
                // Начало блока с ошибкой (например: "48) [chromium] › ...")
                inErrorBlock = true;

                // Извлекаем информацию о тесте из строки с номером
                const testMatch = line.match(/\[chromium\]\s*›\s*(.+?):\d+:\d+\s*›\s*(.+)$/);
                if (testMatch) {
                    const testName = this.cleanLine(testMatch[2].trim());
                    const file = this.cleanLine(testMatch[1]);
                    const testId = `${testName}___${file}`;
                    currentTest = testsMap.get(testId) ?? {
                        testName,
                        file,
                        status: 'failed',  
                    };

                    // Создаем объект теста с деталями ошибки
                    currentTest = {
                        ...currentTest,
                        status: 'failed',  
                        testDetails: {
                            full: [line],
                            error: null,
                            locator: null,
                            expected: null,
                            received: null,
                            callLog: []
                        }
                    };

                    testsMap.set(testId, currentTest)
                }
            } else if (inErrorBlock && currentTest) {
                // Собираем полный текст ошибки
                currentTest.testDetails.full.push(line);

                // Проверяем разные типы информации об ошибке
                if (line.startsWith('    Error:')) {
                    currentTest.testDetails.error = line.replace('    Error:', '').trim();
                } else if (line.startsWith('    Locator:')) {
                    currentTest.testDetails.locator = line.replace('    Locator:', '').trim();
                } else if (line.startsWith('    Expected:')) {
                    currentTest.testDetails.expected = line.replace('    Expected:', '').trim();
                } else if (line.startsWith('    Received:')) {
                    currentTest.testDetails.received = line.replace('    Received:', '').trim();
                } else if (line.startsWith('    Call log:')) {
                    // Собираем весь call log до следующего значимого блока
                    const callLogLines = [];
                    let i = index + 1;
                    while (i < lines.length &&
                    !lines[i].match(/^\s*\d+\)\s+\[chromium\]/) &&
                    !lines[i].includes('attachment #') &&
                    !lines[i].includes('────────────────') &&
                    lines[i].trim() !== '') {
                        callLogLines.push(lines[i].trim());
                        i++;
                    }
                    currentTest.testDetails.callLog = callLogLines;
                    index = i - 1; // Пропускаем обработанные строки
                } else if (line.includes('────────────────') && line.includes('──')) {
                    // Длинная разделительная линия - конец блока ошибки
                    inErrorBlock = false;
                    currentTest = null;
                }
            } else if (inDetailsBlock && line.includes('[chromium]') && !line.match(/^\s*\d+\)/)) {
                // Обычная строка с тестом (без номера и ошибки)
                const testMatch = line.match(/\[chromium\]\s*›\s*(.+?):\d+:\d+\s*›\s*(.+)$/);
                if (testMatch) {
                    const testName = this.cleanLine(testMatch[2].trim());
                    const file = this.cleanLine(testMatch[1]);
                    const testId = `${testName}___${file}`;
                    let test = {
                        file,
                        testName,
                        status: 'passed',  
                    };

                    if (testsMap.has(testId)) {
                        test = {
                            ...testsMap.get(testId),
                            ...test,
                        }
                    }

                    testsMap.set(testId, test);
                }
            }
        }

        result.tests = Array.from(testsMap.values());

        this.state = result;
    }
}

export default TestResultModel;
