class PipeLineTotalModel {
    passed = 0;
    total = 0;
    failed = 0;
    tests = [];
    byFileMap = null;

    constructor(
        passed,
        total,
        failed,
        tests,
    ) {
        this.passed = passed;
        this.total = total;
        this.failed = failed;
        this.tests = tests;
    }

    getState() {
        return {
            passed: this.passed,
            total: this.total,
            failed: this.failed,
            tests: this.tests,
        }
    }

    getByFileMap() {
        if (!this.byFileMap) {
            this.byFileMap = new Map();

            for (let index = 0; index < this.tests.length; index += 1) {
                const test = this.tests[index];

                if (!this.byFileMap.has(test.file)) {
                    this.byFileMap.set(test.file, new Map());
                }

                this.byFileMap.get(test.file).set(test.testName, test);
            }
        }

        return this.byFileMap;
    }

    static buildFromPartsArray(partsArray) {
        let passed = 0;
        let total = 0;
        let failed = 0;
        const tests = [];

        for (let index = 0; index < Array.from(partsArray).length; index += 1) {
            const testResultModel = partsArray[index];

            passed += testResultModel.getState().passed;
            total += (testResultModel.getState().passed + testResultModel.getState().failed);
            failed += testResultModel.getState().failed;
            tests.push(...testResultModel.getState().tests);
        }

        return new PipeLineTotalModel(passed, total, failed, tests);
    }
}

export default PipeLineTotalModel;
