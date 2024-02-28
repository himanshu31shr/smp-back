const { ValidationError } = require("../abstract/exceptions");
const AbstractRepository = require("../abstract/repository");
const bcrypt = require('bcrypt');

module.exports = class UserRepository extends AbstractRepository {

    locked = ['password'];

    setModel() {
        return 'user';
    }

    async login({ email, password }) {
        const user = await this.findOne({
            where: {
                email
            },
            attributes: {
                exclude: []
            }
        });

        if (!user) {
            throw new ValidationError('You have not registered yet!');
        }

        const result = await bcrypt.compare(password, user.password)

        if (!result) {
            throw new ValidationError('This is not a valid password!');
        }

        return user;
    }

    async register({ email, password, name }) {
        const user = await this.findOne({
            where: {
                email
            }
        });

        if (user) {
            throw new ValidationError('A user with this email already exists!');
        }

        password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));

        const nUser = await this.create({
            email,
            name,
            password
        });

        return this.findOne({
            where: {
                id: nUser.id
            },
            attributes: {
                exclude: this.locked
            }
        });
    }
}