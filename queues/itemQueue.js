// const { Queue } = require("bullmq");

// const itemQueue = new Queue("assignItemToWarehousesQueue", {
//   connection: { host: "127.0.0.1", port: 6379 },
// });

// module.exports = itemQueue;

const getBoss = require("../queues/pgboss"); 

async function queueAssignItemToAllWarehouses(itemId,warehouseIds) {
  const boss = await getBoss();
  await boss.send('assign-item-to-warehouses', { itemId ,warehouseIds});
  // console.log(`Job queued: assign-item-to-warehouses for item ${itemId}`); 
  
}

module.exports = queueAssignItemToAllWarehouses;