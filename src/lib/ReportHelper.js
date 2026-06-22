class ReportHelper {
    static generateReportFromCells(cells) {
        // Группируем ошибки по файлу и имени теста
        const groupedErrors = {};

        const newCells = [...cells]
        newCells.shift();

        newCells.forEach((cell, index) => {
            if (cell.test && cell.test.testDetails) {
                const { file, testName } = cell.test;
                const key = `${file}::${testName}`;

                if (!groupedErrors[key]) {
                    groupedErrors[key] = {
                        file,
                        testName,
                        runs: [],
                        details: cell.test.testDetails
                    };
                }

                // Находим номер запуска (индекс в массиве + 1)
                groupedErrors[key].runs.push(index + 1);
            }
        });

        // Формируем текст отчета
        let report = '';

        Object.values(groupedErrors).forEach(({ file, testName, runs, details }) => {
            report += `Файл: ${file}\n`;
            report += `Тест: ${testName}\n`;
            report += `Номер запуска: ${runs.join(', ')}\n\n`;

            if (details.error) {
                report += `    error: ${details.error}\n\n`;
            }

            if (details.locator) {
                report += `    locator: ${details.locator}\n\n`;
            }

            if (details.expected) {
                report += `    expected: ${details.expected}\n\n`;
            }

            if (details.received) {
                report += `    received: ${details.received}\n\n`;
            }

            if (details.full && Array.isArray(details.full)) {
                report += `    ${details.full.join('\n    ')}\n`;
            }

            report += '\n'.repeat(2); // Добавляем разделитель между тестами
        });

        return report;
    }

    static getReport(rows) {
        let report = '';

        for (let index = 0; index < rows.length; index += 1) {
            const row = rows[index];

            report += ReportHelper.generateReportFromCells(row.cells) + '\n\n\n';
        }

        return report;
    }
}

export default ReportHelper;
