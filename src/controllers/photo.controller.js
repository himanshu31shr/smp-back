const multer = require("multer");
const PhotoRepository = require("../repositories/photo.repository");
const { RespondSuccess } = require("../abstract/response");
const { sequelize } = require("../models");
const { ValidationError } = require("../abstract/exceptions");
const AlbumRepository = require("../repositories/album.repository");
const { SecureUri } = require("../thirdparty/storage/url");
const QueueService = require("../thirdparty/queue");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
    get: async function (req, res, next) {
        try {

            const { photo_id } = req.query;

            if (!photo_id) {
                throw new ValidationError('This is not a valid photo!');
            }

            const repo = new PhotoRepository();

            const photo = await repo.findOne({
                where: {
                    id: photo_id
                },
                raw: true
            });

            if (!photo) {
                throw new ValidationError('This is not a valid photo!')
            }

            photo.people = await repo.getPeople(photo_id);

            return new RespondSuccess(photo).pipe(res);

        } catch (err) {
            next(err);
        }
    },
    post: [
        upload.any(),
        async function (req, res, next) {
            try {
                await sequelize.transaction(async t => {
                    const { album_id } = req.body;
                    const { files } = req

                    if (!album_id) {
                        throw new ValidationError('Please select a valid album!');
                    }

                    if (!files || !files.length) {
                        throw new ValidationError('Please select files!');
                    }

                    const repo = new PhotoRepository();

                    const photos = await Promise.all(files.map((file) => {
                        return repo.create({ album_id }, file);
                    }));

                    // Relaying when all threads are closed hopefully
                    setTimeout(async () => {
                        // send to queue for processing
                        await Promise.all(
                            photos.map(photo => setTimeout(() => new QueueService(process.env.MQ_IMAGE_QUEUE).enqueue(photo), 1000))
                        );
                    }, 2000);

                    return new RespondSuccess(photos).pipe(res);
                });

            } catch (error) {
                next(error)
            }
        }
    ],
    getByPeople: async function (req, res, next) {
        try {
            const { people_id, album_id } = req.query;

            if (!people_id && !album_id) {
                throw new ValidationError("Invalid request!")
            }

            let payload;
            if (album_id > 0) {
                payload = response = await (new AlbumRepository()).findOne({
                    where: {
                        id: album_id
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
                payload = await (new PhotoRepository()).getByPeople(people_id);
            }


            return new RespondSuccess(payload).pipe(res);
        } catch (err) { next(err) }
    }
}