const settingsLSKey = 'settings';

class TableSettingsHelper {
    static getSettings(revisionsCount) {
        const json = localStorage.getItem(settingsLSKey);

        if (!json) {
            return {
                showFiles: true,
                showStatistics: true,
                firstColumnPosition: TableSettingsHelper.getFirstColumnPosition(revisionsCount),
            };
        }

        return JSON.parse(json);
    }

    static getFirstColumnPosition(revisionsCount) {
        const result = revisionsCount;

        if (result < 1) {
            return 1;
        }

        return result;
    }

    static saveSettings(filters) {
        const json = JSON.stringify(filters);

        localStorage.setItem(settingsLSKey, json);
    }
}

export default TableSettingsHelper;
