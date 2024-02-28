const AbstractRepository = require("../abstract/repository");
const QueueService = require("../thirdparty/queue");
const StorageService = require("../thirdparty/storage");

module.exports = class AlbumRepository extends AbstractRepository {

    setModel() {
        return 'album';
    }

    setRelations() {
        return ['photo'];
    }

    async destroy(album_id) {

        await super.destroy({
            where: {
                id: album_id
            }
        });

        await new StorageService().destroyByFolder(album_id);
        await new StorageService().destroyByFolder(`faces/${album_id}`);
        await new StorageService().destroyByFolder(`.thumbs/${album_id}`);
        await new QueueService(process.env.MQ_CLEANUP_QUEUE).enqueue({ album_id });

    }
}