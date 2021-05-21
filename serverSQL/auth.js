const { Sequelize } = require("sequelize");
const config = { 
  username: "root",
  password: "root",
  host: "localhost",
  port: "3306",
  database: "database_chat",
} 

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  timezone: "+07:00",
  logging: console.log,
  database: config.database,
  dialectOptions : {
    dateStrings: true,
    typeCast: true,
  }
});
try {
  sequelize
    .authenticate()
    .then(async () => {
      console.log(`Connect database ${config.database} successful`);
    })
    .catch((err) => {});
} catch (error) {
  console.error(`Unable to connect to the database ${config.database}:`);
  console.log(error);
}

module.exports = { DB: sequelize };