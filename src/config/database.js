module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'MyNewPass',
    database: 'gobarber',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
};