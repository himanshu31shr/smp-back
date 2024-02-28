const AbstractRepository = require("../abstract/repository");

module.exports = class LinkRepository extends AbstractRepository {

    setModel() {
        return 'album_link';
    }
}