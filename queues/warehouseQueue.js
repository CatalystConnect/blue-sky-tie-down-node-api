// const { Queue } = require("bullmq");

// const warehouseQueue = new Queue("assignItemsQueue", {
//   connection: {
//     host: "127.0.0.1",   
//     port: 6379           
//   }
// });

// module.exports = warehouseQueue;

const getBoss = require("../queues/pgboss"); 

async function warehouseQueue(warehouseId) {
  const boss = await getBoss();
  await boss.send('assign-items', { warehouseId }); 

  // console.log(`Job queued: assign-items for warehouse ${warehouseId}`);
}

module.exports = warehouseQueue;