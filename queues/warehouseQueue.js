const { Queue } = require("bullmq");

const warehouseQueue = new Queue("assignItemsQueue", {
  connection: {
    host: "127.0.0.1",   
    port: 6379           
  }
});

module.exports = warehouseQueue;