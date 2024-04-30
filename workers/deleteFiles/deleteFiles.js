const fs = require('fs');
const path = require('path');

const _ = require('lodash');

let deletedFiles = [];

console.log('delete files worker start!!!');

process.on('message', (file) => {
    deletedFiles.push(file)
});

function start() {
    let files = deletedFiles[0];
    if (files) {
        let dirName = path.join(__dirname, '..', '..', 'uploads', files.type);
        for (let file of files.files) {
            let filePath = path.join(dirName, file);
            fs.unlink(filePath, (err) => {
                if (err) fs.appendFile(path.join(__dirname, 'error.txt'), filePath + "\n", (error) => error ? console.error(error) : null);
                // else fs.appendFile(path.join(__dirname, 'success.txt'), filePath + "\n", (error) => error ? console.error(error) : null);
            });
        }
        _.pull(deletedFiles, files);
        start()
    } else {
        setTimeout(() => start(), 10000)
    }
}

start();
