require("dotenv").config();
var commonHelper = require("../helper/common.helper");
var jwt = require("jsonwebtoken");
const config = require("../../../config/db.config");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
const warehouseItemsServices = require("../services/warehouseItems.services");
module.exports = {
  /*addWareHouseItems*/
  async addwareHouseItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body;

      let postData = {
        // Key fields
        itemNumber: data.keyFields?.itemNumber,
        description: data.keyFields?.description,
        date: data.keyFields?.date,
        contractor_id: data.keyFields?.contractor_id,

        // Pricing
        per: data.pricing?.per,
        listPrice: data.pricing?.listPrice,
        fullList: data.pricing?.fullList,
        fullRetail: data.pricing?.fullRetail,
        unitCost: data.pricing?.unitCost,
        effectiveDate: data.pricing?.effectiveDate,

        // Costing
        costPerEA: data.costing?.costPerEA,
        stdCost: data.costing?.stdCost,
        fullStd: data.costing?.fullStd,
        average: data.costing?.average,
        lastAvg: data.costing?.lastAvg,
        lastLand: data.costing?.lastLand,
        baseCost: data.costing?.baseCost,

        // Quantities
        onHand: data.quantities?.onHand,
        committed: data.quantities?.committed,
        available: data.quantities?.available,
        triRegOut: data.quantities?.triRegOut,
        triTotalOut: data.quantities?.triTotalOut,
        backorder: data.quantities?.backorder,
        rented: data.quantities?.rented,
        onPO: data.quantities?.onPO,
        tranRegIn: data.quantities?.tranRegIn,
        tranTotalIn: data.quantities?.tranTotalIn,
        webAllow: data.quantities?.webAllow,
        qtyAvail: data.quantities?.qtyAvail,
        workOrder: data.quantities?.workOrder,

        // Locations
        shipping: data.locations?.shipping,
        receiving: data.locations?.receiving,

        // Units
        allow: data.units?.allow,
        uM: data.units?.uM,
        webAllow: data.units?.webAllow, // ⚡ renamed to avoid clash with quantities.webAllow
        qtyAvail: data.units?.qtyAvail, // ⚡ renamed to avoid clash with quantities.qtyAvail

        // Purchasing
        buyerType: data.purchasing?.buyerType,
        replenishPath: data.purchasing?.replenishPath,
        seasonal: data.purchasing?.seasonal,
        safetyStock: data.purchasing?.safetyStock,
        minQty: data.purchasing?.minQty,
        maxQty: data.purchasing?.maxQty,
        leadTime: data.purchasing?.leadTime,
        reorderPoint: data.purchasing?.reorderPoint,

        // Costing Additions
        standardCost: data.costingAdditions?.standardCost,
        lastCost: data.costingAdditions?.lastCost,
        averageCost: data.costingAdditions?.averageCost,
        workingCost: data.costingAdditions?.workingCost,
        costAdditions: data.costingAdditions?.costAdditions,
      };

      await warehouseItemsServices.addwareHouseItems(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Warehouse Item added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Adding Warehouse Item failed",
        data: error.response?.data || {},
      });
    }
  },
  // Get WareHouse Item by ID
  async getWareHouseItemById(req, res) {
    try {
      const wareHouseId = req.query.id || req.params.id;

      if (!wareHouseId) {
        return res.status(400).json({
          status: false,
          message: "WareHouse Item ID is required",
        });
      }

      const wareHouse = await warehouseItemsServices.getWareHouseItemById(
        wareHouseId
      );

      if (!wareHouse) {
        return res.status(404).json({
          status: false,
          message: "WareHouse item not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "WareHouse item fetched successfully",
        data: wareHouse,
      });
    } catch (err) {
      console.error("Get WareHouse Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to fetch WareHouse",
        error: err.message,
      });
    }
  },
  /*getAllWareHouseItems*/
  async getAllWareHouseItems(req, res) {
    try {
      const { page = 1, per_page = 10, search = "", limit = "" } = req.query;

      const getAllWareHouseItem =
        await warehouseItemsServices.getAllWareHouseItems({
          page,
          per_page,
          search,
          limit,
        });

      if (!getAllWareHouseItem) {
        throw new Error("get all ware house Item not found");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            getAllWareHouseItem,
            "All ware house Items displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting all ware house items failed",
        data: error.response?.data || {},
      });
    }
  },
  async deletewareHouseItems(req, res) {
    try {
      let wareHouseId = req.query.id || req.params.id;

      if (!wareHouseId) {
        return res.status(400).json({
          status: false,
          message: "WareHouse item ID is required",
        });
      }

      wareHouseId = wareHouseId.toString().split(",").map(id => Number(id));

      const deleted = await warehouseItemsServices.deletewareHouseItems(
        wareHouseId
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "WareHouse item not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "WareHouse item deleted successfully",
      });
    } catch (err) {
      console.error("Delete  item WareHouse Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to delete  WareHouse item",
        error: err.message,
      });
    }
  },
  // async updateWareHouseItems(req, res) {
  //   try {
  //     const wareHouseId = req.query.id || req.params.id;

  //     if (!wareHouseId) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "WareHouse Item ID is required",
  //       });
  //     }

  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     let data = req.body;

  //     const updated = await warehouseItemsServices.updateWareHouseItems(
  //       wareHouseId,
  //       data
  //     );

  //     if (!updated) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "WareHouse Item not found or update failed",
  //       });
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "WareHouse Item updated successfully",
  //       data: updated,
  //     });
  //   } catch (err) {
  //     console.error("Update WareHouse Error:", err.message);
  //     return res.status(500).json({
  //       status: false,
  //       message: "Failed to update WareHouse Item",
  //       error: err.message,
  //     });
  //   }
  // },

  // async updateWareHouseItems(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }
  //     const warehouseItemId = req.params.id || req.query.id || req.body.id;
  //     let data = req.body;


  //     // You must send warehouseItemId in body or params

  //     if (!warehouseItemId) {
  //       return res.status(400).send(
  //         commonHelper.parseErrorRespose({
  //           warehouseItemId: "warehouseItemId is required",
  //         })
  //       );
  //     }

  //     let updateData = {
  //       // Key fields
  //       itemNumber: data.keyFields?.itemNumber,
  //       description: data.keyFields?.description,
  //       date: data.keyFields?.date,
  //       contractor_id: data.keyFields?.contractor_id,

  //       // Pricing
  //       per: data.pricing?.per,
  //       listPrice: data.pricing?.listPrice,
  //       fullList: data.pricing?.fullList,
  //       fullRetail: data.pricing?.fullRetail,
  //       unitCost: data.pricing?.unitCost,
  //       effectiveDate: data.pricing?.effectiveDate,

  //       // Costing
  //       costPerEA: data.costing?.costPerEA,
  //       stdCost: data.costing?.stdCost,
  //       fullStd: data.costing?.fullStd,
  //       average: data.costing?.average,
  //       lastAvg: data.costing?.lastAvg,
  //       lastLand: data.costing?.lastLand,
  //       baseCost: data.costing?.baseCost,

  //       // Quantities
  //       onHand: data.quantities?.onHand,
  //       committed: data.quantities?.committed,
  //       available: data.quantities?.available,
  //       triRegOut: data.quantities?.triRegOut,
  //       triTotalOut: data.quantities?.triTotalOut,
  //       backorder: data.quantities?.backorder,
  //       rented: data.quantities?.rented,
  //       onPO: data.quantities?.onPO,
  //       tranRegIn: data.quantities?.tranRegIn,
  //       tranTotalIn: data.quantities?.tranTotalIn,
  //       webAllow: data.quantities?.webAllow,
  //       qtyAvail: data.quantities?.qtyAvail,
  //       workOrder: data.quantities?.workOrder,

  //       // Locations
  //       shipping: data.locations?.shipping,
  //       receiving: data.locations?.receiving,

  //       // Units
  //       allow: data.units?.allow,
  //       uM: data.units?.uM,
  //       webAllow: data.units?.webAllow,
  //       qtyAvail: data.units?.qtyAvail,

  //       // Purchasing
  //       buyerType: data.purchasing?.buyerType,
  //       replenishPath: data.purchasing?.replenishPath,
  //       seasonal: data.purchasing?.seasonal,
  //       safetyStock: data.purchasing?.safetyStock,
  //       minQty: data.purchasing?.minQty,
  //       maxQty: data.purchasing?.maxQty,
  //       leadTime: data.purchasing?.leadTime,
  //       reorderPoint: data.purchasing?.reorderPoint,

  //       // Costing Additions
  //       standardCost: data.costingAdditions?.standardCost,
  //       lastCost: data.costingAdditions?.lastCost,
  //       averageCost: data.costingAdditions?.averageCost,
  //       workingCost: data.costingAdditions?.workingCost,
  //       costAdditions: data.costingAdditions?.costAdditions,
  //     };

  //     // Call service
  //     await warehouseItemsServices.updateWareHouseItems(
  //       warehouseItemId,
  //       updateData
  //     );

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           "",
  //           "Warehouse Item updated successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Updating Warehouse Item failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  async updateWareHouseItems(req, res) {
    try {
      const id = req.query.id;
      const payload = req.body;

      if (!id) {
        return res.status(400).send({
          status: false,
          message: "Warehouse item ID is required",
        });
      }

      const updatedItem = await warehouseItemsServices.updateWareHouseItems(id, payload);

      return res.status(200).send({
        status: true,
        message: "Warehouse Item updated successfully",
        data: updatedItem
      });

    } catch (error) {
      return res.status(400).send({
        status: false,
        message: error.message || "Unable to update warehouse item",
      });
    }
  },
  async getWareHouseItemVendor(req, res) {
    try {
      const { vendor_id, warehouse_id ,search} = req.query;

      if (!vendor_id || !warehouse_id) {
        return res.status(400).json({
          success: false,
          message: "vendor_id and warehouse_id are required",
        });
      }

      const data =
        await warehouseItemsServices.getWareHouseItemVendor(vendor_id, warehouse_id,search);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
};
