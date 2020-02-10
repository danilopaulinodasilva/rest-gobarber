const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({ // super acessa o método da classe pai, init() dentro de Model
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,
        },{
            sequelize // passa a conexão
        }); 

        this.addHook('beforeSave', async user => {
            if (user.password) {
              user.password_hash = await bcrypt.hash(user.password, 8);
            }
          });

        return this;
    }
}

module.exports = User;
