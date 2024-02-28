const { ValidationError } = require("../abstract/exceptions");
const { RespondSuccess } = require("../abstract/response");
const PeopleRepository = require("../repositories/people.repository");

module.exports = {
    get: async function (req, res, next) {
        try {

            const { album_id, photo_id } = req.query;

            if (!album_id && !photo_id) {
                throw new ValidationError('Invalid album!');
            }

            let response;

            if (!!album_id) {
                response = await (new PeopleRepository()).getByAlbum(album_id);
            }

            // if (!!photo_id) {
            //     response = await (new PeopleRepository()).getByPhoto(photo_id);
            // }

            return new RespondSuccess(response).pipe(res);
        } catch (err) {
            next(err);
        }
    }
}