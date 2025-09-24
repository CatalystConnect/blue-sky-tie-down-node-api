require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const companyServices = require("../services/company.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addCompany*/
  async addCompany(req, res) {
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
        company_type: req.body.company_type,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,
        company_notes: req.body.company_notes,
        company_lead_score: req.body.company_lead_score,
        tax: req.body.tax,
      };

      const company = await companyServices.addCompany(postData);

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

  async getAllCompany(req, res) {
    try {
      const company = await companyServices.getAllCompany(req.query);
      res.status(200).json({
        status: true,
        message: "Company fetched successfully",
        data: company,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch company",
        error: err.message,
      });
    }
  },

  async getCompanyById(req, res) {
    try {
      const companyId = req.query.id;
      if (!companyId) {
        return res.status(400).json({
          status: false,
          message: "Company ID is required",
        });
      }

      const company = await companyServices.getCompanyById(companyId);

      if (!company) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company fetched successfully",
        data: company,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch Company",
        error: err.message,
      });
    }
  },

  async updateCompany(req, res) {
    try {
      const companyId = req.query.id;
      const updatedData = req.body;

      const company = await companyServices.updateCompany(
        companyId,
        updatedData
      );

      if (!company) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company updated successfully",
        data: company,
      });
    } catch (err) {
      console.error("Update Company Error:", err.message); 
      res.status(500).json({
        status: false,
        message: "Failed to update company",
        error: err.message,
      });
    }
  },

  async deleteCompany(req, res) {
    try {
      const companyId = req.query.id;

      if (!companyId) {
        return res.status(400).json({
          status: false,
          message: "Company ID is required",
        });
      }

      const deleted = await companyServices.deleteCompany(companyId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Company deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to delete Company",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addCompany": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Company name is Required")
            .custom(async (value) => {
              const existing = await companyServices.getCompanyByName(value);
              if (existing) {
                throw new Error("Company name already exists");
              }
              return true;
            }),
        ];
      }

      case "updateCompany": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Company name is Required")
            .custom(async (value, { req }) => {
              const companyId = parseInt(req.query.company);

              const existing = await companyServices.getCompanyByName(value);

              if (existing && existing.id !== companyId) {
                throw new Error("Company name already exists");
              }

              return true;
            }),
        ];
      }
    }
  },
};
