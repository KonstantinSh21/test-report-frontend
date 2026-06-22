class FileHelper {
    static downloadFile(data, fileName, fileType) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const fileContents = e.target.result;

                try {
                    resolve(fileContents);
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsText(file);
        })
    }
}

export default FileHelper;
