const { ValidationError } = require("../abstract/exceptions");
const { RespondSuccess } = require("../abstract/response");
const { sequelize } = require("../models");
const UserRepository = require("../repositories/user.repository");
const { emailValidator } = require("../utilities/common.utility");

module.exports = {
    login: async function (req, res, next) {

        try {
            await sequelize.transaction(async t => {

                const { email, password } = req.body;

                if (!email || !emailValidator(email)) {
                    throw new ValidationError('Enter a valid email!');
                }

                if (!password) {
                    throw new ValidationError('Enter a valid password!');
                }


                const user = await (new UserRepository()).login({
                    email, password
                });

                return new RespondSuccess({
                    token: user.generateAccessToken(),
                    refresh: user.generateRefreshToken(),
                }).pipe(res);

            });

        } catch (err) {
            next(err);
        }
    },
    register: async function (req, res, next) {
        try {
            await sequelize.transaction(async t => {
                const { email, password, name } = req.body;

                if (!email || !emailValidator(email)) {
                    throw new ValidationError('Enter a valid email!');
                }

                if (!password) {
                    throw new ValidationError('Enter a valid password!');
                }

                if (!name) {
                    throw new ValidationError('Enter a valid name!');
                }

                const user = await (new UserRepository()).register({
                    email, password, name
                });

                return new RespondSuccess(user, "Registered successfully").pipe(res);
            });

        } catch (err) {
            next(err);
        }
    }
}