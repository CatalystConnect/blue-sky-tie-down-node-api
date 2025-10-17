require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_URL,
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
    },
  },

  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },

  production: {
    url: process.env.DB_URL,
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
    },
  },
};
