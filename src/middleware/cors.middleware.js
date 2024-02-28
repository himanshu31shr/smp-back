const _exposedHeaders = [
    "Authorization",
    "Referer"
];
const _allowedHeaders = [
    "Access-Control-Allow-Headers",
    "Origin",
    "Accept",
    "Content-Type",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    ..._exposedHeaders
];

const _allowedRequests = [
    'GET',
    'PUT',
    'POST',
    'DELETE',
    'OPTIONS'
];

module.exports = function (req, res, next) {

    // if (process.env.ENVIRONMENT === 'development') {
        res.header('Access-Control-Allow-Origin', '*');
    // } else {
    //     if (_allowedOrigins.includes(req.get('origin'))) {
    //         res.header('Access-Control-Allow-Origin', req.get('origin'));
    //     }
    // }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", _allowedHeaders.join(','));
    res.header('Access-Control-Allow-Methods', _allowedRequests.join(','));
    res.header('Access-Control-Expose-Headers', _exposedHeaders.join(','));

    next();
}