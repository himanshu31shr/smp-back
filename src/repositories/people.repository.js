
const { Op } = require("sequelize");
const AbstractRepository = require("../abstract/repository");
const { Sequelize } = require("../models");
const { SecureUri } = require("../thirdparty/storage/url");

module.exports = class PeopleRepository extends AbstractRepository {

    setModel() {
        return 'people';
    }

    getByAlbum(album_id) {
        return this.findAll({
            where: {
                album_id: album_id
            },
            include:[{
                model: this.models.photo_has_people
            }]
        }).then(people => {
            return Promise.all(people.map(async p => {
                p.dataValues.image_path = await (new SecureUri({
                    bucket: process.env.BUCKET_NAME,
                    objectName: p.dataValues.image_path,
                    expiration: 300
                })).create();
                return p
            }))
        });
    }

    getByPhoto(photo_id) {
        return this.model.findAll({
            where: {
                id: {
                    [Op.in]: Sequelize.literal(`(SELECT photo_id FROM photo_has_people WHERE album_id = ${photo_id})`,)

                }
            }
        }).then(people => {
            return Promise.all(people.map(async p => {
                p.dataValues.image_path = await (new SecureUri({
                    bucket: process.env.BUCKET_NAME,
                    objectName: p.dataValues.image_path,
                    expiration: 300
                })).create();
                return p;
            }))
        });
    }
}