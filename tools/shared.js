const appRootPath = require('app-root-path');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');





//get the name of the model based on route file
//how to use const modelName = require(`${appRootPath}/tools/shared`).modelName(__filename)
exports.modelName = (filename, route, casing) => {
    let myModel = ''
    myModel = filename.slice(filename.lastIndexOf('/') + 1, -3)
    if (route)
        myModel = filename.slice(filename.lastIndexOf('/') + 1, -9)
    if (casing && casing == 'low') return myModel
    myModel = myModel.charAt(0).toUpperCase() + myModel.substring(1)
    return myModel
}

/*exports.modelName = (filename) => {
    let myModel = ''
    myModel = filename.slice(filename.lastIndexOf('/') + 1, -3)
    myModel = myModel.charAt(0).toUpperCase() + myModel.substring(1)
    return myModel
}*/

/*exports.modelNameLowerCase = (filename) => {
    let myModel = ''
    myModel = filename.slice(filename.lastIndexOf('/') + 1, -3)
    return myModel
}*/



exports.asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//use it like req.body = deleteFromJson(req.body,['status','isdeleted'])
exports.deleteFromJson = (json, toDelete) => {
    for (let t = 0; t < toDelete.length; t++) {
        delete json[toDelete[t]]
    }
    return json
}

exports.keepFromJson = (json, toKeep) => {
    let keys = Object.keys(json);
    for (let t = 0; t < keys.length; t++) {
        if (!toKeep.includes(keys[t])) {
            delete json[keys[t]]
        }
    }
    return json
}

//it can create a directory and sub directory automatically
exports.createDirectory = (targetDir, { isRelativeToScript = false } = {}) => {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = appRootPath + '/'

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code == 'EEXIST') { // curDir already exists!
                return curDir;
            }
            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code == 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }
            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir == path.resolve(targetDir)) {
                throw err; // Throw if it's just the last created dir.
            }
        }
        return curDir;
    }, initDir);
}

/**
 * handling error message based on envirement
 */
exports.errorHandler = (err, req, res, next) => {
    let error = err //error message to be sent back
    let statusCode = 500
    if (err) {
        switch (err.name) {
            case 'ValidationError':
                statusCode = 422
                break;

            default:
                break;
        }
        log().error({ label: 'ERROR', message: error,route:req.originalUrl })
        return res.status(statusCode).render('error', { message: error,connectedUser: req.user })

        /* if (process.env.NODE_ENV == 'development') {
             return { error, statusCode }
         }
         else if (process.env.NODE_ENV == 'production') {
             return res.render('error', { message: error })
         }
         else {
             return { error: error.message, statusCode }
         }*/
    }
}


