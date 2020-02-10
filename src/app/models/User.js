const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({ // super acessa o método da classe pai, init() dentro de Model
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,
        },{
            sequelize
        }); 
    }
}

module.exports = User;
