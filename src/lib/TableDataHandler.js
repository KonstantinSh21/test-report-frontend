class TableDataHandler {
    revisions = [];
    firstColumnPosition = 1;

    constructor(revisions, firstColumnPosition) {
        this.revisions = revisions;
        this.firstColumnPosition = firstColumnPosition;
    }

    getTableData() {
        const byFileMap = this.getByFileMap();

        return this.buildRows(byFileMap);
    }

    getByFileMap() {
        const mapByFileName = new Map();

        for (let index = 0; index < this.revisions.length; index += 1) {
            const revision = this.revisions[index];
            const tests = revision.getState().tests;

            for (let testIndex = 0; testIndex < tests.length; testIndex += 1) {
                const testResult = tests[testIndex];

                if (!mapByFileName.has(testResult.file)) {
                    mapByFileName.set(testResult.file, new Set());
                }

                mapByFileName.get(testResult.file).add(testResult.testName);
            }
        }

        return mapByFileName;
    }

    buildRows(byFileMap) {
        const rows = [
            ...this.buildStatisticRows(),
        ];

        const floatTitlesList = this.getFirstColumnTitles(byFileMap);

        for (let index = 0; index < floatTitlesList.length; index += 1) {
            const rowTitle = floatTitlesList[index];

            const row = this.buildRow(rowTitle);

            rows.push(row);
        }

        return rows;
    }

    buildStatisticRows() {
        let prevPassed = 0;

        const totalRow = {
            status: 'default',
            cells: [
                {
                    value: 'Всего тестов',
                    type: 'total',
                    colspan: 0,
                    skip: false,
                },
            ],
            isFile: false,
            isStatics: true,
        };
        const failedRow = {
            status: 'default',
            cells: [
                {
                    value: 'Упало',
                    type: 'failed',
                    colspan: 0,
                    skip: false,
                },
            ],
            isFile: false,
            isStatics: true,
        };
        const passedRow = {
            status: 'default',
            cells: [
                {
                    value: 'Исправлено',
                    type: 'passed',
                    colspan: 0,
                    skip: false,
                },
            ],
            isFile: false,
            isStatics: true,
        };

        for (let index = 0; index < this.revisions.length; index += 1) {
            const revision = this.revisions[index];

            totalRow.cells.push({
                value: revision.getState().total,
                type: 'total',
                colspan: 0,
                skip: false,
            });
            failedRow.cells.push({
                value: revision.getState().failed,
                type: 'failed',
                colspan: 0,
                skip: false,
            });
            passedRow.cells.push({
                value: prevPassed === 0 ? 0 : -(prevPassed - revision.getState().passed),
                type: 'failed',
                colspan: 0,
                skip: false,
            });

            prevPassed = revision.getState().passed;
        }

        return [
            totalRow,
            failedRow,
            passedRow,
        ]
    }

    getFirstColumnTitles(byFileMap) {
        const list = [];
        const fileNames = Array.from(byFileMap.keys());

        for (let keyIndex = 0; keyIndex < fileNames.length; keyIndex += 1) {
            const fileName = fileNames[keyIndex];

            list.push({
                title: fileName,
                isFile: true,
                fileName,
            });

            const tests = Array.from(byFileMap.get(fileName));

            for (let testIndex = 0; testIndex < tests.length; testIndex += 1) {
                const test = tests[testIndex];

                list.push({
                    title: test,
                    isFile: false,
                    fileName,
                });
            }
        }

        return list;
    }

    buildRow(titleData) {
        const row = {
            status: 'default',
            cells: [],
            isFile: titleData.isFile,
            isStatics: false,
        };
        let prevValue = null;

        row.cells.push({
            value: titleData.title,
            type: titleData.isFile ? 'file' : 'test',
            colspan: titleData.isFile ? this.revisions.length : 0,
            skip: false,
        });

        let isAllPassed = true;
        let isAllNotPassed = true;

        for (let index = 0; index < this.revisions.length; index += 1) {
            if (titleData.isFile) {
                row.cells.push({
                    value: null,
                    type: 'file',
                    colspan: 0,
                    skip: true,
                });

                continue;
            }

            const revision = this.revisions[index];
            const mapByFileName = revision.getByFileMap();
            const fileData = mapByFileName.get(titleData.fileName);
            const test = fileData?.get(titleData.title) ?? null;

            const value = !test ? 'yes' : 'no';

            if (index === this.revisions.length - 1) {
                if (isAllNotPassed && !!test) {
                    row.status = 'failed';
                } else if (isAllPassed && !test) {
                    row.status = 'stable';
                } else if (value === 'yes') {
                    row.status = 'fixed';
                } else if (value === 'no') {
                    row.status = 'broken';
                }

            } else if (index === this.firstColumnPosition - 1) {
                isAllPassed = !test;
                isAllNotPassed = !!test;
            } else if (index > this.firstColumnPosition - 1) {
                isAllPassed = isAllPassed && !test;
                isAllNotPassed = isAllNotPassed && !!test;
            }

            row.cells.push({
                value,
                type: 'test',
                colspan: 0,
                skip: false,
                test,
            });

            prevValue = value;
        }

        return row;
    }

    buildJson() {
        const result = [];

        for (let index = 0; index < this.revisions.length; index += 1) {
            const revision = this.revisions[index];

            result.push(revision.getState());
        }

        return JSON.stringify(result);
    }
}

export default TableDataHandler;
