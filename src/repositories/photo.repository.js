const { ValidationError, Op, QueryTypes } = require("sequelize");
const AbstractRepository = require("../abstract/repository");
const StorageService = require("../thirdparty/storage");
const path = require('path');
const QueueService = require("../thirdparty/queue");
const { SecureUri } = require("../thirdparty/storage/url");
const { sequelize } = require("../models");

module.exports = class PhotoRepository extends AbstractRepository {

    setModel() {
        return 'photo';
    }

    async create(data = {
        album_id
    }, file) {

        const album = await this.models.album.findOne({
            where: {
                id: data.album_id
            }
        });

        if (!album) {
            throw new ValidationError('This is not a valid album!')
        }

        // create record
        const photo = await super.create({
            album_id: data.album_id,
            image_path: 'NA'
        });

        // upload to s3
        const fileName = data.album_id + '/' + Date.now() + path.extname(file.originalname);
        await new StorageService().save(file.buffer, fileName);

        photo.image_path = fileName;
        await photo.save();

        const cPhoto = photo.toJSON();
        cPhoto.signedUrl = await (new SecureUri({
            bucket: process.env.BUCKET_NAME,
            objectName: photo.image_path,
            expiration: 120
        })).create();

        return cPhoto;
    }

    async getPeople(photo_id) {

        const query = `SELECT pe.* FROM photo_has_people as php
            JOIN photos as p on p.id = php.photo_id
            JOIN people as pe on pe.id = php.people_id
            WHERE p.id = ${photo_id}
        `;

        return this.models.sequelize.query(query, {
            type: this.models.Sequelize.QueryTypes.SELECT
        }).then(async people => {
            return await Promise.all(
                people.map(async p => {
                    p.image_path = await (new SecureUri({
                        bucket: process.env.BUCKET_NAME,
                        objectName: p.image_path,
                        expiration: 300
                    })).create();
                    return p;
                })
            )
        });
    }

    async getByPeople(people_id) {

        const photos = await this.findAll({
            where: {
                id: {
                    [Op.in]: sequelize.literal(`(SELECT photo_id FROM photo_has_people WHERE people_id IN (${people_id}))`)
                }
            },
        });

        return await Promise.all(
            photos.map(async photo => {
                photo.dataValues.signed_image = await (new SecureUri({
                    bucket: process.env.BUCKET_NAME,
                    objectName: photo.get('image_path'),
                    expiration: 300
                })).create();
                return photo;
            })
        )
    }

}