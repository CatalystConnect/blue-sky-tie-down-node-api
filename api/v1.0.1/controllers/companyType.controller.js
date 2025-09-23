require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const companyTypeServices = require("../services/companyType.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addCompanyType*/
  async addCompanyType(req, res) {
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
        background_color: req.body.background_color,
        sort_order: req.body.sort_order,
      };

      const company = await companyTypeServices.addCompanyType(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            company,
            "Company added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Company creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllCompanyType(req, res) {
    try {
      const company = await companyTypeServices.getAllCompanyType(req.query);
      res.status(200).json({
        status: true,
        message: "Company type fetched successfully",
        data: company,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch company type",
        error: err.message,
      });
    }
  },

  async getCompanyTypeById(req, res) {
    try {
      const companyTypeId = req.query.companyType;
      if (!companyTypeId) {
        return res.status(400).json({
          status: false,
          message: "Company type ID is required",
        });
      }

      const companyType = await companyTypeServices.getCompanyTypeById(
        companyTypeId
      );

      if (!companyType) {
        return res.status(404).json({
          status: false,
          message: "Company type not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company type fetched successfully",
        data: companyType,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch Company type",
        error: err.message,
      });
    }
  },

  async updateCompanyType(req, res) {
    try {
      const companyTypeId = req.query.companyType;
      const updatedData = req.body;

      const companyType = await companyTypeServices.updateCompanyType(
        companyTypeId,
        updatedData
      );

      if (!companyType) {
        return res.status(404).json({
          status: false,
          message: "Company type not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company type updated successfully",
        data: companyType,
      });
    } catch (err) {
      console.error("Update Company type Error:", err.message);
      res.status(500).json({
        status: false,
        message: "Failed to update company type",
        error: err.message,
      });
    }
  },

  async deleteCompanyType(req, res) {
    try {
      const companyTypeId = req.query.companyType;

      if (!companyTypeId) {
        return res.status(400).json({
          status: false,
          message: "Company type ID is required",
        });
      }

      const deleted = await companyTypeServices.deleteCompanyType(
        companyTypeId
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Company type not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company type deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to delete Company type",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addCompanyType": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Company type name is Required")
            .custom(async (value) => {
              const existing = await companyTypeServices.getCompanyTypeByName(
                value
              );
              if (existing) {
                throw new Error("Company type name already exists");
              }
              return true;
            }),
        ];
      }

      case "updateCompanyType": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Company type name is Required")
            .custom(async (value, { req }) => {
              const companyTypeId = parseInt(req.query.companyType);

              const existing = await companyTypeServices.getCompanyTypeByName(
                value
              );

              if (existing && existing.id !== companyTypeId) {
                throw new Error("Company type name already exists");
              }

              return true;
            }),
        ];
      }
    }
  },
};
