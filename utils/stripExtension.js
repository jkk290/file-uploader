function stripExtension(filename) {
    const extension = filename.split('.');
    if (extension.length > 1) {
        extension.pop();
        return extension.join('.');
    }
    return filename;
};

module.exports = stripExtension;