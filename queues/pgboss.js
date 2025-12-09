const PgBoss = require("pg-boss");

const boss = new PgBoss({
  connectionString: process.env.DB_URL, 
  ssl: { rejectUnauthorized: false },         
});

boss
  .start()
  .then(() => console.log("PgBoss started successfully"))
  .catch((err) => console.error("PgBoss failed to start:", err));

module.exports = boss;