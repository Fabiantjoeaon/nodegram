/**
 * Render development error call stack on screen
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const devErrors = (err, req, res, next) => {
    err.stack = err.stack || '';
    const errorDetails = {
        message: err.message,
        status: err.status,
        stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
    };
    res.status(err.status || 500);
    res.format({
        // Based on the `Accept` http header
        'text/html': () => {
        res.render('error', errorDetails);
        }, 
        'application/json': () => res.json(errorDetails) 
    });
}
  
/**
 * @public
 * Wraps async route functions to catch errors
 * @param {Function} [fn] 
 */
const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(next);

/**
 * @public
 * Catches bad form errors
 */
const csrfErrors = (err, req, res, next) => {
    if(err.code !== 'EBADCSRFTOKEN') return next(err);

    req.flash('error', 'Your form token has been expired. Please reload your form.')
    res.redirect(req.originalUrl);
}


// exports.flashValidationErrors = (err, req, res, next) => {
//     if (!err.errors) return next(err);
//     // validation errors look like
//     const errorKeys = Object.keys(err.errors);
//     errorKeys.forEach(key => req.flash('error', err.errors[key].message));
//     res.redirect('back');
//   };
  
module.exports = {devErrors, catchErrors, csrfErrors};