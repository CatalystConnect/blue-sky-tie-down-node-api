const { PgBoss } = require('pg-boss');

let bossInstance;
let startingPromise;

function getBoss() {
    if (bossInstance) return bossInstance;

    if (startingPromise) return startingPromise;

    startingPromise = (async () => {
        const boss = new PgBoss({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false   
            }
        });

        boss.on('error', error => console.error('PgBoss error:', error));

        await boss.start();

        console.log('PgBoss started successfully');

        bossInstance = boss;
        return bossInstance = boss;
        return boss;
    })();

    return startingPromise;
}

module.exports = getBoss;