require("dotenv").config();
const config = require("../../../config/db.config");
const { Sequelize, Op } = require("sequelize");
let connnection;
let DATABASE_URL = process.env.DB_URL;
if (DATABASE_URL) {
  connnection = {
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  connnection = {
    logging: false,
  };
}

// const dbObj = new Sequelize(
//   DATABASE_URL,
//   connnection
// )
const dbObj = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 30000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // keepAlive: true, // optional: helps on some hosts
  },
});

const db = {};

db.Sequelize = Sequelize;
db.dbObj = dbObj;
db.Op = Op;

dbObj
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

/*Models defined*/
db.userObj = require("./users.models")(dbObj, Sequelize);
db.rolesObj = require("./roles.model")(dbObj, Sequelize);

module.exports = db;
