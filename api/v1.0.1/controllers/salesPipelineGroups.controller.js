require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const salesPipelineGroupsServices = require("../services/salesPipelineGroups.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addSalesPipelinesGroups*/
  // async addSalesPipelinesGroups(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     let data = req.body;

  //     // 🔍 Check if already exists
  //     const existingPipelineGroup =
  //       await salesPipelineGroupsServices.getPipelineGroupByName(data.name);

  //     if (existingPipelineGroup) {
  //       return res.status(200).send(
  //         commonHelper.parseErrorRespose({
  //           name: { msg: "Sales pipelines group name already exists" },
  //         })
  //       );
  //     }

  //     let postData = {
  //       name: data.name,
  //       status: data.status || "active", 
  //     };

  //     await salesPipelineGroupsServices.addSalesPipelinesGroups(postData);

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           {},
  //           "Sales pipelines groups added successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Sales pipelines groups failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  /*getAllSalesPipelinesGroups*/
  // async getAllSalesPipelinesGroups(req, res) {
  //   try {
  //     const result =
  //       await salesPipelineGroupsServices.getAllSalesPipelinesGroups(req.query);

  //     return res.status(200).json({
  //       status: true,
  //       message: "Sales pipelines groups fetched successfully",
  //       data: result.data,
  //       meta: {
  //         current_page: result.current_page,
  //         per_page: result.per_page,
  //         last_page: result.last_page,
  //         total: result.total,
  //       },
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       status: false,
  //       message: "Failed to fetch sales pipelines groups",
  //       error: err.message,
  //     });
  //   }
  // },

  // async getSalesPipelinesGroupsById(req, res) {
  //   try {
  //     const pipelinesGroupsId = req.query.id;
  //     if (!pipelinesGroupsId) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Sales Pipelines Groups is required",
  //       });
  //     }

  //     const pipelinesGroups =
  //       await salesPipelineGroupsServices.getSalesPipelinesGroupsById(
  //         pipelinesGroupsId
  //       );

  //     if (!pipelinesGroups) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "Sales Pipelines Groups not found",
  //       });
  //     }

  //     res.status(200).json({
  //       status: true,
  //       message: "Sales Pipelines Groups fetched successfully",
  //       data: pipelinesGroups,
  //     });
  //   } catch (err) {
  //     res.status(500).json({
  //       status: false,
  //       message: "Failed to fetch Sales Pipelines Groups",
  //       error: err.message,
  //     });
  //   }
  // },

  //   async updateSalesPipelinesGroups(req, res) {
  //     try {
  //       const pipelinesGroupsId = req.query.id;
  //       const updatedData = req.body;

  //       const pipelinesGroups = await salesPipelineGroupsServices.updateSalesPipelinesGroups(
  //         pipelinesGroupsId,
  //         updatedData
  //       );

  //       if (!pipelinesGroups) {
  //         return res.status(404).json({
  //           status: false,
  //           message: "Sales Pipelines Groups not found",
  //         });
  //       }

  //       res.status(200).json({
  //         status: true,
  //         message: "Sales Pipelines Groups updated successfully",
  //         data: pipelinesGroups,
  //       });
  //     } catch (err) {
  //       console.error("Update Sales Pipelines Groups Error:", err.message);
  //       res.status(500).json({
  //         status: false,
  //         message: "Failed to update Sales Pipelines Groups",
  //         error: err.message,
  //       });
  //     }
  //   },

  //   async deletepipelinesGroups(req, res) {
  //     try {
  //       const pipelinesGroupsId = req.query.id;

  //       if (!pipelinesGroupsId) {
  //         return res.status(400).json({
  //           status: false,
  //           message: "Sales Pipelines Groups is required",
  //         });
  //       }

  //       const deleted = await salesPipelineGroupsServices.deletepipelinesGroups(
  //         pipelinesGroupsId
  //       );

  //       if (!deleted) {
  //         return res.status(404).json({
  //           status: false,
  //           message: "Sales Pipelines Groups not found",
  //         });
  //       }

  //       res.status(200).json({
  //         status: true,
  //         message: "Sales Pipelines Groups deleted successfully",
  //       });
  //     } catch (err) {
  //       res.status(500).json({
  //         status: false,
  //         message: "Failed to delete Sales Pipelines Groups",
  //         error: err.message,
  //       });
  //     }
  //   },

  // validate(method) {
  //   switch (method) {
  //     case "addSalesPipelinesGroups": {
  //       return [
  //         check("name")
  //           .not()
  //           .isEmpty()
  //           .withMessage("Pipeline groups name is required"),
  //       ];
  //     }
  //     case "getSalesPipelinesGroupsById": {
  //       return [
  //         check("id")
  //           .not()
  //           .isEmpty()
  //           .withMessage("PipelineGroupId is Required")
  //           .isInt()
  //           .withMessage("PipelineGroupId must be an integer"),
  //       ];
  //     }
  //   }
  // },
};
