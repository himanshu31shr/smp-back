const { ValidationError } = require("../abstract/exceptions");
const { RespondSuccess } = require("../abstract/response");
const { sequelize } = require("../models");
const AlbumRepository = require("../repositories/album.repository");
const LinkRepository = require("../repositories/link.repository");
const { SecureUri } = require("../thirdparty/storage/url");

module.exports = {
    put: async (req, res, next) => {
        try {
            const { album_id, name } = req.body;
            if (!name) {
                throw new ValidationError('Please enter a valid name!');
            }

            if (!album_id) {
                throw new ValidationError('Please select a valud album!');
            }

            const album = await (new AlbumRepository()).update({
                where: {
                    id: album_id
                }
            }, {
                name: name,
            });

            return new RespondSuccess(album).pipe(res);

        } catch (error) {
            next(error)
        }
    },
    post: async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name) {
                throw new ValidationError('Please enter a valid name!');
            }

            const album = await (new AlbumRepository()).create({
                name: name,
                user_id: req.user.id
            });

            return new RespondSuccess(album).pipe(res);

        } catch (error) {
            next(error)
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.query;

            let response;
            if (id) {
                response = await (new AlbumRepository()).findOne({
                    where: {
                        id
                    },
                });

                if (response) {
                    response.photos = await Promise.all(response.photos.map(async photo => {
                        photo.dataValues.signed_image = await (new SecureUri({
                            bucket: process.env.BUCKET_NAME,
                            objectName: photo.get('image_path'),
                            expiration: 300
                        })).create();
                        return photo;
                    }));
                }

            } else {
                response = await (new AlbumRepository()).findAll({
                    where: {
                        user_id: req.user.id
                    },
                    include: [{
                        model: (new AlbumRepository()).models.photos,
                        limit: 4
                    }]
                });
                if (response.length) {
                    response = await Promise.all(response.map(async rep => {
                        if (rep.photos) {
                            rep.photos = await Promise.all(rep.photos.map(async photo => {
                                photo.dataValues.signed_image = await (new SecureUri({
                                    bucket: process.env.BUCKET_NAME,
                                    objectName: photo.get('image_path'),
                                    expiration: 300
                                })).create();
                                return photo;
                            }));
                        }

                        return rep;
                    }));
                }
            }

            return new RespondSuccess(response).pipe(res);

        } catch (error) {
            next(error)
        }
    },
    getByCode: async function (req, res, next) {
        try {

            const { code } = req.query;

            if (!code) {
                throw new ValidationError('Please enter a valid album code!');
            }

            const album = await (new LinkRepository()).findOne({
                where: {
                    code
                },
            });

            if (!album) {
                throw new ValidationError("This is not a valid album code!")
            }

            return new RespondSuccess(album).pipe(res);

        } catch (err) {
            next(err);
        }
    },
    destroy: async function (req, res, next) {
        try {
            await sequelize.transaction(async t => {
                const { album_id } = req.query;

                if (!album_id) {
                    throw new ValidationError('This is not a valid album!');
                }

                const albumRepo = new AlbumRepository();

                const album = await albumRepo.findOne({
                    where: {
                        id: album_id
                    }
                });

                if (!album) {
                    throw new ValidationError('This is not a valid album!');
                }

                if (album.user_id !== req.user.id) {
                    throw new ValidationError('You are not allowed to delete this album!');
                }

                await albumRepo.destroy(album_id);

                return new RespondSuccess().pipe(res);
            });
        } catch (err) {
            next(err);
        }
    }
}