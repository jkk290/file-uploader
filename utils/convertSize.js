function convertSize(fileSize) {
    if (fileSize === 0) return '0 Bytes';

    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(fileSize) / Math.log(k));

    return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

module.exports = convertSize;