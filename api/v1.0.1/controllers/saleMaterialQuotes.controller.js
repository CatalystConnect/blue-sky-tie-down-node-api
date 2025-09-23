require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const saleMaterialQuotesServices = require("../services/saleMaterialQuotes.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addSaleMaterialQuotes*/
  async addSaleMaterialQuotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const postData = {
        user_id: req.userId || null,
        customer_id: req.body.customer_id || null,
        lead_project_id: req.body.lead_project_id || null,
        ship_to: req.body.ship_to || null,
        material_total: req.body.totalTab.material_total || null,
        additional_total: req.body.additional_total || null,
        total: req.body.totalTab.total || null,
        order_gross: req.body.totalTab.order_gross || null,
        discount_amount: req.body.totalTab.discount_amount || null,
        total_misc: req.body.totalTab.total_misc || null,
        taxable: req.body.totalTab.taxable || null,
        tax_amount: req.body.totalTab.tax_amount || null,
        freight: req.body.totalTab.freight || null,
        orderGp: req.body.totalTab.orderGp || null,
        customer_details: req.body.customerDetails || null,
        notes: req.body.notes || null,
        status: req.body.status || null,
        wanted: req.body.wanted || null,
        customer_po: req.body.customer_po || null,
        sales_order_type: req.body.salesOrderType || null,
        contract: req.body.contracts || null,
        ship_order_type: req.body.shipOrderType || null,
        contractor_id: req.body.contractor_id || null,
        enteredBy: req.body.enteredBy || null,
        shipDetail: req.body.shipDetail || null,
        dateOrdered: req.body.dateOrdered || null,
      };

      const SaleMaterialQuotes =
        await saleMaterialQuotesServices.addSaleMaterialQuotes(postData);
      if (req.body.headerTab) {
        const headerData = {
          material_quote_id: SaleMaterialQuotes.id,
          terms_code: req.body.headerTab.terms_code || null,
          tax_code: req.body.headerTab.tax_code || null,
          order_by: req.body.headerTab.order_by || null,
          phone: req.body.headerTab.phone || null,
          price_by: req.body.headerTab.price_by || null,
          warehouse: req.body.headerTab.warehouse || null,
          sales1: req.body.headerTab.sales1 || null,
          email: req.body.headerTab.email || null,
          finances_type: req.body.headerTab.finances_type || null,
        };

        await saleMaterialQuotesServices.addHeaderTabs(headerData);
      }

      if (
        req.body.totalTab.additionalItems &&
        Array.isArray(req.body.totalTab.additionalItems)
      ) {
        const additionalData = req.body.totalTab.additionalItems.map((tab) => ({
          material_quote_id: SaleMaterialQuotes.id,
          item: tab.item,
          cost: tab.cost,
          price: tab.price,
        }));

        await saleMaterialQuotesServices.addAdditionalTabs(additionalData);
      }
      function toNumber(value) {
        if (value === "" || value === null || value === undefined) {
          return null;
        }
        const num = Number(value);
        return isNaN(num) ? null : num;
      }

      if (req.body.materialItems && Array.isArray(req.body.materialItems)) {
        const materialItemsData = req.body.materialItems.map((tab) => ({
          material_quote_id: SaleMaterialQuotes.id,
          item: tab.item || null,
          description: tab.description || null,
          qty: toNumber(tab.qty),
          cost: toNumber(tab.cost),
          margin: toNumber(tab.margin),
          commission: toNumber(tab.commission),
          price: toNumber(tab.price),
          total: toNumber(tab.total),
          notes: tab.notes || null,
          uom: tab.uom || null,
          std_cost: toNumber(tab.stdCost),
          extPrice: toNumber(tab.extPrice),
          list_price: toNumber(tab.list_price),
          sort_order: toNumber(tab.sort_order),
          onOrder: toNumber(tab.onOrder),
          bo: tab.bo || null,
          other1: tab.other1 || null,
          requestedDate: tab.requestedDate || null,
          warehouse: tab.warehouse || null,
          costPer: toNumber(tab.costPer),
          expectedDate: tab.expectedDate || null,
          receivedToDate: tab.receivedToDate || null,
          openTotal: toNumber(tab.openTotal),
          transferToWarehouse: tab.transferToWarehouse || null,
          origin: tab.origin || null,
          other2: tab.other2 || null,
          discPct: toNumber(tab.discPct),
          tax: tab.tax || null,
          // region: tab.region || null,
          taxCode: tab.taxCode || null,
        }));

        await saleMaterialQuotesServices.addMaterialItems(materialItemsData);
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Sale Material Quotes  added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Sale Material Quotes   failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getAllSaleMaterialQuotes*/
  async getAllSaleMaterialQuotes(req, res) {
    try {
      const { page = 1, per_page = 10, search = "" } = req.query;
      let SaleMaterialQuotes =
        await saleMaterialQuotesServices.getAllSaleMaterialQuotes({
          page,
          per_page,
          search,
        });
      if (!SaleMaterialQuotes) {
        throw new Error("Sale Material Quotes not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            SaleMaterialQuotes,
            "Sale Material Quotes  displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Sale Material Quotes failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getSaleMaterialQuotesById*/
  async getSaleMaterialQuotesById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let saleMaterialQuotesId = req.query.saleMaterialQuotesId;
      let saleMaterialQuotes =
        await saleMaterialQuotesServices.getSaleMaterialQuotesById(
          saleMaterialQuotesId
        );
      if (!saleMaterialQuotes) {
        throw new Error("Sale Material Quotes  not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            saleMaterialQuotes,
            "Sale Material Quotes   displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Sale Material Quotes  failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteSaleMaterialQuotes*/
  async deleteSaleMaterialQuotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let saleMaterialQuotesId = req.query.saleMaterialQuotesId;
      let saleMaterialQuotes =
        await saleMaterialQuotesServices.getSaleMaterialQuotesById(
          saleMaterialQuotesId
        );
      if (!saleMaterialQuotes) {
        throw new Error("sale Material Quotes  not found");
      }
      let saleMaterialQuote =
        await saleMaterialQuotesServices.deleteSaleMaterialQuotes(
          saleMaterialQuotesId
        );
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            saleMaterialQuote,
            "sale Material Quotes deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "sale Material Quotes  deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  async updateSaleMaterialQuotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let saleMaterialQuotesId = req.query.saleMaterialQuotesId;
      let existingQuote =
        await saleMaterialQuotesServices.getSaleMaterialQuotesById(
          saleMaterialQuotesId
        );

      if (!existingQuote) {
        throw new Error("Sale Material Quote not found");
      }

      const postData = {
        user_id: req.userId || null,
        customer_id: req.body.customer_id || null,
        lead_project_id: req.body.lead_project_id || null,
        ship_to: req.body.ship_to || null,
        material_total: req.body.totalTab.material_total || null,
        additional_total: req.body.additional_total || null,
        total: req.body.totalTab.total || null,
        order_gross: req.body.totalTab.order_gross || null,
        discount_amount: req.body.totalTab.discount_amount || null,
        total_misc: req.body.totalTab.total_misc || null,
        taxable: req.body.totalTab.taxable || null,
        tax_amount: req.body.totalTab.tax_amount || null,
        freight: req.body.totalTab.freight || null,
        orderGp: req.body.totalTab.orderGp || null,
        customer_details: req.body.customerDetails || null,
        notes: req.body.notes || null,
        status: req.body.status || null,
        wanted: req.body.wanted || null,
        customer_po: req.body.customer_po || null,
        sales_order_type: req.body.salesOrderType || null,
        contract: req.body.contracts || null,
        ship_order_type: req.body.shipOrderType || null,
        contractor_id: req.body.contractor_id || null,
        enteredBy: req.body.enteredBy || null,
        shipDetail: req.body.shipDetail || null,
        dateOrdered: req.body.dateOrdered || null,
      };

      await saleMaterialQuotesServices.updateSaleMaterialQuotes(
        saleMaterialQuotesId,
        postData
      );

      if (req.body.headerTab) {
        await saleMaterialQuotesServices.deleteHeaderTabs(saleMaterialQuotesId);

        const headerData = {
          material_quote_id: saleMaterialQuotesId,
          terms_code: req.body.headerTab.terms_code || null,
          tax_code: req.body.headerTab.tax_code || null,
          order_by: req.body.headerTab.order_by || null,
          phone: req.body.headerTab.phone || null,
          price_by: req.body.headerTab.price_by || null,
          warehouse: req.body.headerTab.warehouse || null,
          sales1: req.body.headerTab.sales1 || null,
          email: req.body.headerTab.email || null,
          finances_type: req.body.headerTab.finances_type || null,
        };
        await saleMaterialQuotesServices.addHeaderTabs(headerData);
      }

      if (
        req.body.totalTab.additionalItems &&
        Array.isArray(req.body.totalTab.additionalItems)
      ) {
        await saleMaterialQuotesServices.deleteAdditionalTabs(
          saleMaterialQuotesId
        );

        const additionalData = req.body.totalTab.additionalItems.map((tab) => ({
          material_quote_id: saleMaterialQuotesId,
          item: tab.item,
          cost: tab.cost,
          price: tab.price,
        }));

        await saleMaterialQuotesServices.addAdditionalTabs(additionalData);
      }
      function toNumber(value) {
        if (value === "" || value === null || value === undefined) {
          return null;
        }
        const num = Number(value);
        return isNaN(num) ? null : num;
      }

      if (req.body.materialItems && Array.isArray(req.body.materialItems)) {
        await saleMaterialQuotesServices.deleteMaterialItems(
          saleMaterialQuotesId
        );

        const materialItemsData = req.body.materialItems.map((tab) => ({
          material_quote_id: saleMaterialQuotesId,
          item: tab.item || null,
          description: tab.description || null,
          qty: toNumber(tab.qty),
          cost: toNumber(tab.cost),
          margin: toNumber(tab.margin),
          commission: toNumber(tab.commission),
          price: toNumber(tab.price),
          total: toNumber(tab.total),
          notes: tab.notes || null,
          uom: tab.uom || null,
          std_cost: toNumber(tab.stdCost),
          extPrice: toNumber(tab.extPrice),
          list_price: toNumber(tab.list_price),
          sort_order: toNumber(tab.sort_order),
          onOrder: toNumber(tab.onOrder),
          bo: tab.bo || null,
          other1: tab.other1 || null,
          requestedDate: tab.requestedDate || null,
          warehouse: tab.warehouse || null,
          costPer: toNumber(tab.costPer),
          expectedDate: tab.expectedDate || null,
          receivedToDate: tab.receivedToDate || null,
          openTotal: toNumber(tab.openTotal),
          transferToWarehouse: tab.transferToWarehouse || null,
          origin: tab.origin || null,
          other2: tab.other2 || null,
          discPct: toNumber(tab.discPct),
          tax: tab.tax || null,
          // region: tab.region || null,
          taxCode: tab.taxCode || null,
        }));

        await saleMaterialQuotesServices.addMaterialItems(materialItemsData);
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Sale Material Quotes updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Updating Sale Material Quotes failed",
        data: error.response?.data || {},
      });
    }
  },
  // Check if lead already assigned to any contractor
  async CheckleadContractor(req, res) {
    try {
      const { leadId } = req.body;

      if (!leadId) {
        throw new Error("leadId is required");
      }

      const result = await saleMaterialQuotesServices.CheckleadContractor(
        leadId
      );

      return res.status(200).json({
        status: true,
        message: "Check completed",
        data: { assigned: result },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Check failed",
        data: {},
      });
    }
  },
  async getAllItemAndServicesTypeItem(req, res) {
    try {
       
      const search = req.query.search || null;
      const data = await saleMaterialQuotesServices.getAllItemAndServicesTypeItem(search);
      
      return res.status(200).json({
        status: true,
        message: "Items with Service Type Items fetched successfully",
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Check failed",
        data: {},
      });
    }
  },
  async getAllItemAndServicesTypeItemByID(req, res) {
    try {
      const { itemId, itemName } = req.query; 
      
      const data = await saleMaterialQuotesServices.getAllItemAndServicesTypeItemByID(itemId, itemName);
      
      return res.status(200).json({
        status: true,
        message: "Item or Service fetched successfully",
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Check failed",
        data: {},
      });
    }
  },
  validate(method) {
    switch (method) {
      case "addSaleMaterialQuotes": {
        return [
          check("customer_id")
            .not()
            .isEmpty()
            .withMessage("customer_id is Required"),
            check("contractor_id")
            .not()
            .isEmpty()
            .withMessage("contractor_id is Required"),
        ];
      }
    }
  },
};
