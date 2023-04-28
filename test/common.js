const path = require('path');
const fs = require('fs');

function setTestDataDir(testBaseDir, datasetDir) {
    process.env.TEST_DATA_DIR = path.join(testBaseDir, datasetDir);
}

function unsetTestDataDir() {
    process.env.TEST_DATA_DIR = undefined;
}

function removeJSONFiles(testBaseDir, dataDir) {
    let dirName = path.join(testBaseDir, dataDir);

    // remove all JSON filess
    let fileNames = fs.readdirSync(dirName);
    fileNames.filter(fileName => fileName.endsWith('.json'))
        .forEach(jsonFile => fs.unlinkSync(path.join(dirName, jsonFile)));
}

function copyJSONFiles(testBaseDir, srcDir, dstDir) {
    let srcDirName = path.join(testBaseDir, srcDir);
    let dstDirName = path.join(testBaseDir, dstDir);

    let fileNames = fs.readdirSync(srcDirName);
    fileNames
        .filter(fileName => fileName.endsWith('.json'))
        .forEach(jsonFile => fs.copyFileSync(
            path.join(srcDirName, jsonFile),
            path.join(dstDirName, jsonFile)
        ));
}

module.exports = {
    setTestDataDir,
    unsetTestDataDir,
    removeJSONFiles,
    copyJSONFiles
};

