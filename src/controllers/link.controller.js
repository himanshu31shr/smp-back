const { ValidationError } = require("../abstract/exceptions");
const { RespondSuccess } = require("../abstract/response");
const LinkRepository = require("../repositories/link.repository");
const { generateRandomCode } = require("../utilities/common.utility");

module.exports = {
    post: async function (req, res, next) {
        try {

            const { album_id, access_type = 0 } = req.body;

            if (!album_id) {
                throw new ValidationError('Please select a valid album!');
            }

            const link = await new LinkRepository().create({
                code: generateRandomCode(20),
                album_id,
                access_type
            });

            return new RespondSuccess(link).pipe(res);
        } catch (err) {
            next(err);
        }
    },
    get: async function (req, res, next) {
        try {

            const { album_id, code } = req.query;

            if (!album_id && !code) {
                throw new ValidationError('Please select an album or use a album code!')
            }

            let payload;
            if (album_id) {
                payload = await new LinkRepository().findAll({
                    where: {
                        album_id
                    }
                })
            }

            if (code) {
                payload = await new LinkRepository().findOne({
                    where: {
                        code: code
                    }
                });
            }

            return new RespondSuccess(payload).pipe(res);
        } catch (err) {
            next(err);
        }
    }
}