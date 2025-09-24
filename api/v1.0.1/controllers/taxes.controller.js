require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const taxesServices = require("../services/taxes.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addtaxes*/
  async addtaxes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let postData = {
        user_id: req.userId,
        name: req.body.name,
        rate: req.body.rate,
        zipcode: req.body.zipcode,
      };

      const taxes = await taxesServices.addtaxes(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(taxes, "Taxes added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Taxes creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllTaxes(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        limit = "",
        take_all = "",
        id = "",
      } = req.query;

      const result = await taxesServices.getAllTaxes({
        page,
        per_page,
        search,
        limit,
        take_all,
        id,
      });

      if (!result || !result.data || result.data.length === 0) {
        throw new Error("Taxes not found");
      }

      return res.status(200).send({
        status: true,
        message: "Taxes displayed successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting all taxes failed",
        data: error.response?.data || {},
      });
    }
  },

  async getTaxesById(req, res) {
    try {
      const taxesId = req.query.id || req.params.id;

      if (!taxesId) {
        return res.status(400).json({
          status: false,
          message: "taxes ID is required",
        });
      }

      const taxes = await taxesServices.getTaxesById(taxesId);

      if (!taxes) {
        return res.status(404).json({
          status: false,
          message: "taxes not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "taxes fetched successfully",
        data: taxes,
      });
    } catch (err) {
      console.error("Get taxes Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to fetch taxes",
        error: err.message,
      });
    }
  },

  async deleteTaxes(req, res) {
    try {
      const taxesId = req.query.id || req.params.id;

      if (!taxesId) {
        return res.status(400).json({
          status: false,
          message: "Taxes ID is required",
        });
      }

      const deleted = await taxesServices.deleteTaxes(taxesId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Taxes not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Taxes deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to delete taxes",
        error: err.message,
      });
    }
  },

  async updateTaxes(req, res) {
    try {
      const taxesId = req.query.id || req.params.id;
      const updatedData = req.body;

      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const taxes = await taxesServices.updateTaxes(taxesId, updatedData);

      if (!taxes) {
        return res.status(404).json({
          status: false,
          message: "Taxes not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Taxes updated successfully",
        data: taxes,
      });
    } catch (err) {
      console.error("Update taxes Error:", err.message); // fixed logger
      res.status(500).json({
        status: false,
        message: "Failed to update taxes",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addtaxes": {
        return [check("name").notEmpty().withMessage("Taxes name is Required")];
      }

      case "updateTaxes": {
        return [check("name").notEmpty().withMessage("Taxes name is Required")];
      }
    }
  },
};
