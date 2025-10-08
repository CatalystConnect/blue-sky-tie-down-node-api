require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const submittalsServices = require("../services/submittals.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  // Add
  async addSubmittal(req, res) {
    try {
      const postData = {
        name: req.body.name,
        user_id: req.userId,
      };
      const submittal = await submittalsServices.addSubmittal(postData);
      return res.status(200).json({
        status: true,
        message: "Submittal added successfully",
        data: submittal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to add submittal",
        error: error.message,
      });
    }
  },

  // Get all
  async getAllSubmittals(req, res) {
    try {
      const submittals = await submittalsServices.getAllSubmittals();
      return res.status(200).json({
        status: true,
        message: "Submittals fetched successfully",
        data: submittals,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch submittals",
        error: error.message,
      });
    }
  },

  async getSubmittalById(req, res) {
    try {
      const { id } = req.query; // ✅ use query

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Submittal ID is required",
        });
      }

      const submittal = await submittalsServices.getSubmittalById(id);

      if (!submittal) {
        return res.status(404).json({
          status: false,
          message: "Submittal not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Submittal fetched successfully",
        data: submittal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch submittal",
        error: error.message,
      });
    }
  },

  // Update
  async updateSubmittal(req, res) {
    try {
      const { id } = req.query; // ✅ use query
      const { name } = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Submittal ID is required",
        });
      }

      const updatedSubmittal = await submittalsServices.updateSubmittal(id, {
        name,
      });

      if (!updatedSubmittal) {
        return res.status(404).json({
          status: false,
          message: "Submittal not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Submittal updated successfully",
        data: updatedSubmittal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to update submittal",
        error: error.message,
      });
    }
  },

  // Delete
  async deleteSubmittal(req, res) {
    try {
      const { id } = req.query; // ✅ use query

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Submittal ID is required",
        });
      }

      const deleted = await submittalsServices.deleteSubmittal(id);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Submittal not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Submittal deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to delete submittal",
        error: error.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addSubmittals":
        return [check("name").notEmpty().withMessage("Name is required")];
      default:
        return [];
    }
  },
};
