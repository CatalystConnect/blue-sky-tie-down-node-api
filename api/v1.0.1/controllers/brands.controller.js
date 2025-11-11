require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const brandsServices = require("../services/brands.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addBrand*/
  async addBrand(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let postData = {
        name: req.body.name,
        user_id: req.userId, 
      };

      const brand = await brandsServices.addBrand(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(brand, "Brand added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Brand creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async findAllBrands(req, res) {
    try {
      const brands = await brandsServices.findAllBrands(req.query);
      res.status(200).json({
      status: true,
      message: "Brands fetched successfully",
      data: brands.data,
      meta: brands.meta,
    });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch brands",
        error: err.message,
      });
    }
  },

  async findOneBrand(req, res) {
    try {
      const brandId = req.params.id; // get id from route param
      const brand = await brandsServices.findOneBrand(brandId);

      if (!brand) {
        return res.status(404).json({
          status: false,
          message: "Brand not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Brand fetched successfully",
        data: brand,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch brand",
        error: err.message,
      });
    }
  },

  async updateBrand(req, res) {
    try {
      const brandId = req.params.id;
      const updatedData = req.body;

      const brand = await brandsServices.updateBrand(brandId, updatedData);

      if (!brand) {
        return res.status(404).json({
          status: false,
          message: "Brand not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Brand updated successfully",
        data: brand,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to update brand",
        error: err.message,
      });
    }
  },

  async deleteBrand(req, res) {
    try {
      const brandId = req.params.id;

      const deleted = await brandsServices.deleteBrand(brandId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Brand not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Brand deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to delete brand",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addBrand": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Name is required")
            .custom(async (value) => {
              // Check if brand already exists
              const existing = await brandsServices.getBrandByName(value);
              if (existing) {
                throw new Error("Brand name already exists");
              }
              return true;
            }),
        ];
      }

      case "updateBrand": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Name is required")
            .custom(async (value, { req }) => {
              // Check if another brand with same name exists
              const existing = await brandsServices.getBrandByName(value);

              // If exists and its ID is not the same as the one being updated → throw error
              if (existing && existing.id !== parseInt(req.params.id)) {
                throw new Error("Brand name already exists");
              }

              return true;
            }),
        ];
      }
    }
  },
};
