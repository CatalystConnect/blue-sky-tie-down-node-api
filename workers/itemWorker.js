const { Worker } = require("bullmq");
const db = require("../api/v1.0.1/models");
const worker = new Worker(
  "assignItemToWarehousesQueue",
  async (job) => {
    const { itemId } = job.data;

    const item = await db.itemObj.findByPk(itemId);
    if (!item) return true;

    const warehouses = await db.wareHouseObj.findAll();

    if (!warehouses.length) return true;

    const entries = warehouses.map((w) => ({
      warehouse_id: w.id,
      item_id: itemId,
      sku: item.sku,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    
    await db.warehouseItemsObj.bulkCreate(entries, { ignoreDuplicates: true });

    return true;
  },
  { connection: { host: "127.0.0.1", port: 6379 } }
);

worker.on("completed", (job) => {
  console.log(`Item assignment job completed for item #${job.data.itemId}`);
});

worker.on("failed", (job, err) => {
  console.error(`Item assignment job failed for item #${job.data.itemId}`, err);
});
