require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const unitsServices = require("../services/units.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*add Units*/
  async addUnits(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const postData = {
        user_id: req.userId,
        name: req.body.name,
      };

      const unit = await unitsServices.addUnits(postData);

      return res
        .status(200)
        .send(commonHelper.parseSuccessRespose("", "Units added successfully"));
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Units failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getAddUnits*/
  // async getAddUnits(req, res) {
  //   try {
  //     const { page = 1, per_page = 10, search = "", id = "" } = req.query;
  //     let units = await unitsServices.getAddUnits({
  //       page,
  //       per_page,
  //       search,
  //       id,
  //     });
  //     if (!units) {
  //       throw new Error("Unit not found");
  //     }
  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           units,
  //           "Units displayed successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Getting Units failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

  // ================ Controller =================
  async getAddUnits(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        id = "",
        per_id = "",
        limit = "",
        take_all = "",
      } = req.query;

      const units = await unitsServices.getAddUnits({
        page,
        per_page,
        search,
        id,
        per_id,
        limit,
        take_all,
      });

      if (!units) {
        throw new Error("Unit not found");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            units,
            "Units displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Units failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getUnitById*/
  async getUnitById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let unitId = req.query.unitId;
      let unit = await unitsServices.getUnitById(unitId);
      if (!unit) {
        throw new Error("Unit not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(unit, "Unit displayed successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting units failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteUnits*/
  async deleteUnits(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let unitId = req.query.unitId;
      let unit = await unitsServices.getUnitById(unitId);
      if (!unit) {
        throw new Error("Unit not found");
      }
      let deleteUnit = await unitsServices.deleteUnits(unitId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deleteUnit,
            "Unit deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Unit deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  /*updateUnits*/
  async updateUnits(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let unitId = req.query.unitId;
      let unit = await unitsServices.getUnitById(unitId);
      if (!unit) {
        throw new Error("Unit not found");
      }
      let data = req.body;
      let postData = {
        name: data.name,
      };

      let updateUnit = await unitsServices.updateUnits(postData, unitId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updateUnit,
            "Unit updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Unit updation failed",
        data: error.response?.data || {},
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addUnits": {
        return [check("name").notEmpty().withMessage("Unit is Required")];
      }
      case "updateUnits": {
        return [check("name").notEmpty().withMessage("Unit is Required")];
      }
    }
  },
};
