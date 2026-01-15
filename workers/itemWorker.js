// const { Worker } = require("bullmq");
// const db = require("../api/v1.0.1/models");
// const worker = new Worker(
//   "assignItemToWarehousesQueue",
//   async (job) => {
//     const { itemId } = job.data;

//     const item = await db.itemObj.findByPk(itemId);
//     if (!item) return true;

//     const warehouses = await db.wareHouseObj.findAll();

//     if (!warehouses.length) return true;

//     const entries = warehouses.map((w) => ({
//       warehouse_id: w.id,
//       item_id: itemId,
//       sku: item.sku,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));

    
//     await db.warehouseItemsObj.bulkCreate(entries, { ignoreDuplicates: true });

//     return true;
//   },
//   { connection: { host: "127.0.0.1", port: 6379 } }
// );

// worker.on("completed", (job) => {
//   console.log(`Item assignment job completed for item #${job.data.itemId}`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`Item assignment job failed for item #${job.data.itemId}`, err);
// });

// const getBoss = require('../queues/pgboss');
// const db = require('../api/v1.0.1/models');

// (async () => {
//   const boss = await getBoss();
//   await boss.createQueue('assign-item-to-warehouses');   

//   boss.work('assign-item-to-warehouses', async (jobs) => {
//     for (const job of jobs) {
//       const { itemId, warehouseIds } = job.data;
//       console.log(`Processing assign-item-to-warehouses for item #${itemId}`);
   
//       try { 
//         const item = await db.itemObj.findByPk(itemId);
//         if (!item) {
//           console.log(`Item #${itemId} not found`);
//           continue;
//         }

//         const warehouses = await db.wareHouseObj.findAll();
//         if (!warehouses.length) {
//           console.log('No warehouses found');
//           continue;
//         }

//         const entries = warehouses.map((w) => ({
//           warehouse_id: w.id,
//           item_id: itemId,
//           sku: item.sku,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         }));
        
//         await db.warehouseItemsObj.bulkCreate(entries, { ignoreDuplicates: true }); 
//         console.log(`Assigned item #${itemId} to ${warehouses.length} warehouses`);
//       } catch (error) {
//         console.error(`Error processing item #${itemId}:`, error);  

//       }
      
//     }
//   });

//   console.log('Worker listening for assign-item-to-warehouses jobs...');
// })();

const getBoss = require('../queues/pgboss');
const db = require('../api/v1.0.1/models');

(async () => {
  const boss = await getBoss();
  await boss.createQueue('assign-item-to-warehouses');

  boss.work('assign-item-to-warehouses', async (jobs) => {
    for (const job of jobs) {
      const { itemId, warehouseIds } = job.data;

      console.log(
        `Processing assign-item-to-warehouses for item #${itemId}`,
        warehouseIds?.length ? `warehouses: ${warehouseIds}` : '(ALL)'
      );

      try {
        // ✅ Item check
        const item = await db.itemObj.findByPk(itemId);
        if (!item) {
          console.log(`Item #${itemId} not found`);
          continue;
        }

        // ✅ Warehouse selection logic
        const warehouses =
          Array.isArray(warehouseIds) && warehouseIds.length
            ? await db.wareHouseObj.findAll({
                where: { id: warehouseIds }
              })
            : await db.wareHouseObj.findAll(); // fallback → all warehouses

        if (!warehouses.length) {
          console.log('No warehouses found');
          continue;
        }

        // ✅ Prepare bulk entries
        const entries = warehouses.map(w => ({
          warehouse_id: w.id,
          item_id: itemId,
          sku: item.sku,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        // ✅ Insert safely
        await db.warehouseItemsObj.bulkCreate(entries, {
          ignoreDuplicates: true,
        });

        console.log(
          `Assigned item #${itemId} to ${warehouses.length} warehouse(s)`
        );
      } catch (error) {
        console.error(`Error processing item #${itemId}:`, error);
      }
    }
  });

  console.log('Worker listening for assign-item-to-warehouses jobs...');
})();
