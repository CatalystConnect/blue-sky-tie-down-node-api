// const { Worker } = require("bullmq");
// const path = require("path");
// const db = require("../api/v1.0.1/models");



// const worker = new Worker(
// "assignItemsQueue",
// async (job) => {
//     const warehouseId = job.data.warehouseId;

//     // console.log(`Processing job: Assign items to Warehouse #${warehouseId}`);

//     const batchSize = 500;   
//     let offset = 0;

//     while (true) {

//     const items = await db.itemObj.findAll({
//         limit: batchSize,
//         offset: offset
//     });

//     if (!items.length) {
//         console.log("All items processed.");
//         break;
//     }
//     //  console.log("Sample items fetched:", items.slice(0, 5));

//     const entries = items.map((item) => ({
//         warehouse_id: warehouseId,
//         item_id: item.id,
//         sku: item.sku,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//     }));


//     await db.warehouseItemsObj.bulkCreate(entries);

//     // console.log(`Inserted batch (offset ${offset})`);

//     offset += batchSize;
//     }

//     return true;
// },
// {
//     connection: {
//     host: "127.0.0.1",
//     port: 6379,
//     },
// }
// );

// worker.on("completed", (job) => {
// console.log(`Job #${job.id} completed successfully`);
// });

// worker.on("failed", (job, err) => {
// console.error(`Job #${job.id} failed:`, err);
// });
const getBoss = require('../queues/pgboss');
const db = require('../api/v1.0.1/models');

(async () => {
  const boss = await getBoss();
  await boss.createQueue('assign-items');

  boss.work('assign-items', { batchSize: 10 }, async (jobs) => {
    for (const job of jobs) {
      const { warehouseId, itemIds } = job.data;
     

      // console.log(`Processing assign-items for warehouse #${warehouseId}`);
      // console.log(`Processing assign-items for item #${itemIds}`);

      try {

        if (Array.isArray(itemIds) && itemIds.length > 0) {

          const items = await db.itemObj.findAll({
            where: {
              id: itemIds
            }
          });

          const entries = items.map(item => ({
            warehouse_id: warehouseId,
            item_id: item.id,
            sku: item.sku,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          await db.warehouseItemsObj.bulkCreate(entries, {
            ignoreDuplicates: true,
          });

          console.log(`Selected items assigned to warehouse ${warehouseId}`);
          continue;
        }

        const batchSize = 500;
        let offset = 0;

        while (true) {
          const items = await db.itemObj.findAll({
            limit: batchSize,
            offset,
          });

          if (items.length === 0) break;

          const entries = items.map(item => ({
            warehouse_id: warehouseId,
            item_id: item.id,
            sku: item.sku,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          await db.warehouseItemsObj.bulkCreate(entries, {
            ignoreDuplicates: true,
          });

          console.log(`Assigned ${items.length} items (offset: ${offset})`);
          offset += batchSize;
        }

        console.log(`Completed assignment for warehouse ${warehouseId}`);
      } catch (err) {
        console.error('Worker failed:', err);
        throw err;
      }
    }
  });

  console.log('Worker listening for assign-items jobs...');
})();