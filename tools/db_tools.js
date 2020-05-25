const appRootPath = require('app-root-path');
const shell = require(`${appRootPath}/tools/shell`)

/**
 * delete a colelction if something wrong
 */

/*
 db.dropCollection('reports', function (err, result) {
  if (err) {
    return errorHandler(err)
  }
  log().verbose({ label:'COLLECTION_DROP',message: result })
});
*/


/**
 * EXPORTING
 */
//mongoexport --uri="mongodb+srv://user1:123@cluster0-djizf.mongodb.net/vt_prod?retryWrites=true&w=majority"  --collection=users  --out=users.json 
//mongoimport --db=naawen --collection=users --file=/vt_prod/users.json
//mongoimport --db=naawen --collection=games --file=/vt_prod/games.json
//mongoimport --db=naawen --collection=reports --file=/vt_prod/reports.json


/**
 * IMPORT
 */
exports.importCollection = (uri, collection) => {
    return shell.execCommand("mongoimport", [
      `--uri=${uri}`,
      `--collection=${collection}`,
      `--file=${appRootPath}/data/db/import/${collection}.json`
    ]);
  }