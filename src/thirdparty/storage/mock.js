const fs = require('fs');
const path = require('path');

module.exports = class Localstorage {

    async save(fileContent, fileName, bucket = process.env.BUCKET_NAME) {

        if (!fs.existsSync(path.join(process.cwd(), 'public', bucket, fileName.split('/').at(0)))) {
            fs.mkdirSync(path.join(process.cwd(), 'public', bucket, fileName.split('/').at(0)), {
                recursive: true
            });
        }
        fileName = path.join(process.cwd(), 'public', bucket, fileName);
        return fs.writeFileSync(fileName, fileContent);
    }

    destroy = (fileName, bucket = process.env.BUCKET_NAME) => {
        fileName = path.join(process.cwd(), 'public', bucket, fileName);
        return fs.unlinkSync(fileName, fileContent);
    }

    destroyByFolder = (folderName, bucketName = process.env.BUCKET_NAME) => {
        const folderPath = path.join(process.cwd(), 'public', bucketName, folderName);
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach(file => {
                const curPath = path.join(folderPath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // Recursive call for directories
                    removeFolderRecursive(curPath);
                } else { // Delete files
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folderPath); // Delete folder itself
            console.log(`Folder '${folderPath}' and its contents have been deleted.`);
        } else {
            console.log(`Folder '${folderPath}' does not exist.`);
        }
    }

    async get(fileName, bucketName) {
        fileName = path.join(process.cwd(), 'public', bucketName, fileName);
        return fs.readFileSync(fileName);
    }
}