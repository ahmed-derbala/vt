const appRootPath = require('app-root-path');
const prefs = require(`${appRootPath}/config/prefs`);
const packagejson = require('../package.json');
const fs = require('fs');

/**
 * create new propostions
 */
exports.create = (req, res, next) => {
  let img = {};
  if (req.file) {
    img.data = fs.readFileSync(req.file.path);
    img.contentType = req.file.mimetype;
    req.body.img = img;
  }

  if (req.body.allRegions) {
    req.body.regions = 'toute la Tunisie';
  }

  return models.game.create(req.body, function (err, game) {
    if (err) {
      return errorHandler(err, req, res, next);
    }
    //saving link
    game.link = `${prefs.frontBaseUrl}game/id/${game._id}`;
    game.save();
    // return gettingAllgames(req, res, next, 'submission success, your proposition will be published when reviewed')
    return res.redirect('/');
  });
};


exports.page = (req, res, next) => {
  if (req.query.isPublic == null) {
    req.query.isPublic = true;
  }
  let renderPage = 'game/game_all'
  if (req.query.isPublic == 'false') {
    renderPage = 'game/game_notPublic'
  }

  const options = {
    page: Math.abs(parseInt(req.query.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  return models.game.paginate(
    { isPublic: req.query.isPublic },
    options,
    function (err, result) {
      if (err) {
        return errorHandler(err, req, res, next);
      } else {
        return res.render(renderPage, {
          games: result.docs,
          totalPages: result.totalPages,
          appName: packagejson.name,
          appVersion: packagejson.version,
          connectedUser: req.user,
          message: null,
          isPublic: req.query.isPublic
        });
      }
    }
  );
};

exports.all = (req, res, next) => {
  if (!req.query.isPublic) {
    req.query.isPublic = true;
  }
  const options = {
    page: Math.abs(parseInt(req.params.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  return models.game.paginate({ isPublic: true }, options, function (err, result) {
    if (err) {
      return errorHandler(err, req, res, next);
    }

    return res.render('game/game_all', {
      games: result.docs,
      totalPages: result.totalPages,
      appName: packagejson.name,
      appVersion: packagejson.version,
      connectedUser: req.user,
      message: null,
      isPublic: req.query.isPublic
    });
  });
};

exports.allNotPublic = (req, res, next) => {
  const options = {
    page: Math.abs(parseInt(req.query.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  return models.game.paginate({ isPublic: false }, options, function (err, result) {
    if (err) {
      return errorHandler(err, req, res, next);
    }

    return res.render('game/game_notPublic', {
      games: result.docs,
      totalPages: result.totalPages,
      appName: packagejson.name,
      appVersion: packagejson.version,
      connectedUser: req.user,
      message: null
    });
  });
};


/**
 * search propositions by word
 */
exports.search = (req, res, next) => {
  const options = {
    page: Math.abs(parseInt(req.params.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  return models.game.paginate(
    {
      $or: [
        { title: { $regex: req.query.term, $options: 'i' } },
        { description: { $regex: req.query.term, $options: 'i' } },
        { regions: { $regex: req.query.term, $options: 'i' } },
        { email: { $regex: req.query.term, $options: 'i' } },
        { phone: { $regex: req.query.term, $options: 'i' } },
        { keywords: { $regex: req.query.term, $options: 'i' } },
        { service: { $regex: req.query.term, $options: 'i' } }
      ],
      isPublic: true
    },
    options,
    function (err, result) {
      if (err) {
        return errorHandler(err, req, res, next);
      } else {
        return res.render('game/game_all', {
          games: result.docs,
          totalPages: result.totalPages,
          appName: packagejson.name,
          appVersion: packagejson.version,
          connectedUser: req.user,
          message: null
        });
      }
    }
  );
};

/**
 * filter propositions by criteria
 */
exports.filter = (req, res, next) => {
  const options = {
    page: Math.abs(parseInt(req.params.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  let filterFields = {};
  filterFields.isPublic = true;

  req.query.regions = req.query.regions.replace('+', ' ');
  if (
    req.query.regions != 'allRegions' &&
    req.query.regions != 'toute la Tunisie'
  ) {
    filterFields.regions = req.query.regions;
  }

  req.query.service = req.query.service.replace('+', ' ');
  if (req.query.service != 'allServices') {
    filterFields.$or = [];
    filterFields.$or.push({ service: req.query.service });
  }

  req.query.equipment = req.query.equipment.replace('+', ' ');
  if (req.query.equipment != 'allEquipment') {
    if (req.query.service == 'allServices') {
      filterFields.$or = [];
    }
    filterFields.$or.push({ equipment: req.query.equipment });
  }

  return models.game.paginate(filterFields, options, function (err, result) {
    if (err) {
      return errorHandler(err, req, res, next);
    } else {
      return res.render('game/game_all', {
        games: result.docs,
        totalPages: result.totalPages,
        appName: packagejson.name,
        appVersion: packagejson.version,
        connectedUser: req.user,
        message: null
      });
    }
  });
};

/**
 * DESTROY game from database
 */
exports.delete = (req, res, next) => {
  return models.game.deleteOne({ _id: req.body.id }, function (err) {
    if (err) {
      return errorHandler(err, req, res, next);
    }
    //delete all reports of that game id
    models.Report.deleteMany({ gameId: req.body.id }, function (
      err,
      deletedReportsResult
    ) {
      if (err) {
        return errorHandler(err, req, res, next);
      }
      log().verbose({
        label: 'DESTROY',
        message: `deleted related reports to game.id=${req.body.id} | ${deletedReportsResult}`
      });
    });
    log().verbose({
      label: 'DESTROY',
      message: `${req.user.email} destroyed game.id=${req.body.id}`,
      route: req.originalUrl
    });
    return res.redirect('back'); //reload same page
  });
};

/**
 * alter the status of an game
 */
exports.publish = (req, res, next) => {
  return models.game.findOne({ _id: req.body.id }, function (err, game) {
    if (err) {
      return errorHandler(err, req, res, next);
    }
    game.isPublic = !game.isPublic;
    game.save();
    return res.redirect('back');
  });
};

/**
 * get by id
 */
exports.id = async (req, res, next) => {
  let game = await models.game.findOne({ _id: req.params.id }).lean();
  return res.render('game/game_all', {
    games: [game],
    totalPages: 1,
    appName: packagejson.name,
    appVersion: packagejson.version,
    connectedUser: req.user,
    message: null
  });
};

/**
 * a user submit his number before game starts
 */
exports.chooseNumber = (req, res, next) => {
  console.log(req.body);
  let dataToUpdate = {}
  if (req.body.user1Name == req.user.userName) {
    dataToUpdate.user1Number = req.body.userNumber
  }
  if (req.body.user2Name == req.user.userName) {
    dataToUpdate.user2Number = req.body.userNumber
  }
  return models.Game.updateOne({ _id: req.body.GameId },dataToUpdate,function (updateErr, numberAffected, rawResponse) {
    if (updateErr) {
      return errorHandler(updateErr, req, res, next);
    }
    log().verbose({ label: 'SUCCESS', message: `updated game._id=${req.body.GameId}` });
    //return res.redirect('back'); //reload same page
    return res.status(200).redirect('back')
  });
};

/**
 * LOAD MORE
 */
exports.loadMore = (req, res, next) => {
  if (!req.query.isPublic) {
    req.query.isPublic = true;
  }
  const options = {
    page: Math.abs(parseInt(req.query.page)) || 1,
    limit: prefs.pagination.limit,
    lean: true,
    sort: '-updatedAt'
  };
  return models.game.paginate({ isPublic: req.query.isPublic }, options, function (err, result) {
    if (err) {
      return errorHandler(err, req, res, next);
    }

    return res.status(200).send({
      games: result.docs,
      totalPages: result.totalPages,
      connectedUser: req.user
    });
  });
};

/**
 * create or resume match
 */
exports.match = async (req, res, next) => {
  return models.Game.findOne({
    $or: [
      { user1Name: req.query.user1Name, user2Name: req.query.user2Name },
      { user1Name: req.query.user2Name, user2Name: req.query.user1Name }
    ],
    terminatedAt: null
  }, function (err, game) {
    if (err) {
      return errorHandler(err, req, res, next);
    }
    //no game found, create game
    if (game == null) {
      return models.Game.create({
        user1Name: req.query.user1Name,
        user2Name: req.query.user2Name,
        //user1Number: req.body.user1Number,
        //user2Number: req.body.user2Number,

      }, function (err, createdGame) {
        if (err) {
          return errorHandler(err, req, res, next);
        }
        return res.render('game/match', { game: createdGame, user: req.user });
      })
    }
    return res.render('game/match', { game, user: req.user });
  })
}