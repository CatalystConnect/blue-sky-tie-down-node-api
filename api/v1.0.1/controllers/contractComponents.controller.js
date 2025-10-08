require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const contractComponentsServices = require("../services/contractComponents.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  // Add
  async addContractComponents(req, res) {
    try {
      const postData = {
        name: req.body.name,
        user_id: req.userId,
      };

      const component = await contractComponentsServices.addContractComponents(
        postData
      );

      return res.status(200).json({
        status: true,
        message: "Contract Component added successfully",
        data: component,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to add Contract Component",
        error: error.message,
      });
    }
  },

  // Get all
  async getAllContractComponents(req, res) {
    try {
      const { page, per_page, take_all } = req.query;

      const components = await contractComponentsServices.getAllContractComponents({
        page,
        per_page,
        take_all,
      });
      return res.status(200).json({
        status: true,
        message: "Contract Components fetched successfully",
        data: components,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch Contract Components",
        error: error.message,
      });
    }
  },

  // Get one
  async getContractComponentsById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Contract Component ID is required",
        });
      }

      const component =
        await contractComponentsServices.getContractComponentsById(id);

      if (!component) {
        return res.status(404).json({
          status: false,
          message: "Contract Component not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Contract Component fetched successfully",
        data: component,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch Contract Component",
        error: error.message,
      });
    }
  },

  // Update
  async updateContractComponents(req, res) {
    try {
      const { id } = req.query;
      const { name } = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Contract Component ID is required",
        });
      }

      const updated = await contractComponentsServices.updateContractComponents(
        id,
        { name }
      );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: "Contract Component not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Contract Component updated successfully",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to update Contract Component",
        error: error.message,
      });
    }
  },

  // Delete
  async deleteContractComponents(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Contract Component ID is required",
        });
      }

      const deleted = await contractComponentsServices.deleteContractComponents(
        id
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Contract Component not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Contract Component deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to delete Contract Component",
        error: error.message,
      });
    }
  },
};
