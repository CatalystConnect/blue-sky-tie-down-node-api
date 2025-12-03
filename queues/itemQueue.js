const { Queue } = require("bullmq");

const itemQueue = new Queue("assignItemToWarehousesQueue", {
  connection: { host: "127.0.0.1", port: 6379 },
});

module.exports = itemQueue;