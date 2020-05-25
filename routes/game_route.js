const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const modelNameRouteLow = require(`${appRootPath}/tools/shared`).modelName(__filename, 'route', 'low')
const controller = require(`${appRootPath}/controllers/game_controller`)
const validator = require(`${appRootPath}/validators/game_validator`)
const errorValidator = require(`${appRootPath}/validators/error_validator`)
const packagejson = require('../package.json');
const authorize = require(`${appRootPath}/utils/auth`).authorize
const roles = require(`${appRootPath}/utils/clearance`).roles
const clearance = require(`${appRootPath}/utils/clearance`)
var multer = require('multer')
const fs = require("fs");
const photoUploadDir = '/uploads/games'

//router.get('/all', (req, res) => res.render('game/game_all'));
router.get('/all',
  controller.all,
)

/*router.get('/all/notPublic',
  authorize(['SUPER', 'ADMIN']),
  // validator.create,
  errorValidator.check,
  controller.allNotPublic,
)*/

router.get('/notPublic',
  authorize(['SUPER', 'ADMIN']),
  controller.allNotPublic,
)

router.get('/create', (req, res) => {
  return res.render('game/game_create', { appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user })
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //create folder if not exist
    if (!fs.existsSync(`${appRootPath}${photoUploadDir}`)) {
      fs.mkdir(`${appRootPath}${photoUploadDir}`, function (err) {
        if (err) {
          log().error({ message: err, route: req.originalUrl });
        } else {
          log().verbose({ message: `${photoUploadDir} folder created`, route: req.originalUrl });
        }
      });
    }
    cb(null, `${appRootPath}/${photoUploadDir}`);
  },
  filename: function (req, file, cb) {
    req.photoName = `${Date.now()}-${file.originalname}`
    req.body.photo = `${photoUploadDir}/${req.photoName}`
    cb(null, req.photoName);
  }
});
const upload = multer({ storage: storage }).single("photo");



router.post('/create',
  upload,
  validator.create,
  errorValidator.check,
  controller.create,
)

router.post('/search',
  //validator.create,
  //errorValidator.check,
  controller.search,
)

router.get('/search',
  validator.search,
  errorValidator.check,
  controller.search,
)

router.get('/filter',
  controller.filter,
)

/**
 * DESTROY game
 */
router.post('/delete',
  //validator.create,
  // errorValidator.check,
  controller.delete,
)


router.post('/publish',
  authorize(['SUPER', 'ADMIN']),
  //validator.create,
  // errorValidator.check,
  controller.publish,
)

router.get('/id/:id',
  controller.id,
)


// Get profile picture
router.get('/id/:id/picture', function (req, res, next) {
  return models.game.findById(req.params.id, function (err, game) {
    if (err) return next(err);
    if (game.img && game.img.data) {
      res.contentType(game.img.contentType);
      res.send(game.img.data);
    } else if (game.creatorKind === 'company') {
      res.redirect('/img/company.png');
    } else {
      res.redirect('/img/person.png');
    }
  });
});




/*router.post('/page/:page', controller.page,
)*/

router.get('/page/', controller.page,
)

/**
 * a user submit his number before game starts
 */
router.post('/chooseNumber/',
  //validator.update,
 // errorValidator.check,
  controller.chooseNumber,
)


/**
 * LOADING MORE CONTENT DYNAMICALLY
 */
router.get('/loadMore/',
  controller.loadMore,
)

router.get('/match',
  controller.match,
)

module.exports = router;
