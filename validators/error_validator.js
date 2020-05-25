/**
 * checking for errors passed from previous validators middlewares on route
 */
const { validationResult } = require('express-validator');

exports.check = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log().debug({ label: 'VALIDATION_ERROR', message: JSON.stringify(errors.errors) })
        return res.status(422).json({ errors: errors.errors });
                //return res.render('error',{ message: errors.errors,connectdUser:req.user });

    }
    return next()
}


/* const expressValidatorErrors = errorHandler(null, req, res, next)
    if (expressValidatorErrors) return expressValidatorErrors*/

/*
    function aa (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log().debug({ label: 'VALIDATION_ERROR', message: JSON.stringify(errors.errors) })
            return res.status(422).json({ errors: errors.errors });
        }
        return next()
   }
*/