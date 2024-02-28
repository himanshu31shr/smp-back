const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const { NoAccess } = require('../abstract/exceptions');
const {
    secret
} = require('../config/auth')();

module.exports = async function (req, res, next) {
    try {
        const repo = new UserRepository();

        const authorization = req.header('Authorization');

        if (authorization && (authorization || '').split(' ').length > 1) {
            let token = authorization.split(' ')[1];

            let verified = jwt.verify(token, secret);

            if (!verified || !verified.id) {
                throw new NoAccess('Session expired, please login again!');
            }

            req.user = await repo.findOne({
                where: {
                    id: verified.id,
                },
                attributes: {
                    exclude: repo.locked
                }
            });

            if (!req.user) {
                throw new NoAccess('The user you\'re trying to login with doesn\'t exists!');
            }

            return next();
        }

        throw new NoAccess('Invalid request!');

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            next(new NoAccess('Session expired, please login again!'));
        }
        next(err);
    }
}