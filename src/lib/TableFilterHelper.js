const filterLSKey = 'filters';

class TableFilterHelper {
    static getFilters() {
        const json = localStorage.getItem(filterLSKey);

        if (!json) {
            return {
                failed: true,
                stable: true,
                fixed: true,
                broken: true,
            };
        }

        return JSON.parse(json);
    }

    static saveFilters(filters) {
        const json = JSON.stringify(filters);

        localStorage.setItem(filterLSKey, json);
    }
}

export default TableFilterHelper;
