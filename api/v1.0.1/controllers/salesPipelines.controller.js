require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const salesPipelinesServices = require("../services/salesPipelines.services");
const salesPipelineStatusesServices = require("../services/salesPipelineStatuses.services");
const salesPipelineTriggersServices = require("../services/salesPipelineTriggers.services");
const salesPipelineDelayIndicatorsServices = require("../services/salesPipelineDelayIndicators.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addSalesPipelines*/
  async addSalesPipelines(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      // 1. Insert pipeline
      const pipelineData = {
        name: req.body.name,
        sales_pipeline_group_id: req.body.materialType, // maps to sales_pipeline column
        ordering: req.body.ordering || 0,
        status: req.body.status || "active",
      };

      const pipeline = await salesPipelinesServices.addSalesPipelines(
        pipelineData
      );

      // 2. Insert pipeline delay indicators
      if (Array.isArray(req.body.pipelineDelayIndicators)) {
        for (const indicator of req.body.pipelineDelayIndicators) {
          await salesPipelineDelayIndicatorsServices.addPipelineDelayIndicator({
            sales_pipeline_id: pipeline.id,
            delayDays: indicator.delayDays,
            color: indicator.color,
          });
        }
      }

      // 3. Insert statuses (statusGroup.pipelineStatus)
      if (req.body.statusGroup?.pipelineStatus?.length) {
        for (const status of req.body.statusGroup.pipelineStatus) {
          const statusData = {
            name: status.status,
            sales_pipeline_id: pipeline.id,
            expectedDays: status.expectedDays || null,
            statusColor: status.statusColor || null,
            percentage: status.percentage || null,
            ordering: status.order || 0,
            is_default: status.is_default || "false",
            hide_status: "0",
          };

          const pipelineStatus =
            await salesPipelineStatusesServices.addSalesPipelineStatus(
              statusData
            );

          // 4. Insert triggers (rules inside each status)
          if (status.rules?.length) {
            for (const rule of status.rules) {
              const triggerData = {
                sales_pipeline_id: pipeline.id,
                status: pipelineStatus.id,
                type: "pipelineStatus",
                field_name: rule.type,
                // field_value: rule.value,
                field_value: rule.value !== "" ? rule.value : null,
              };
              console.log("triggerData", triggerData);

              await salesPipelineTriggersServices.addSalesPipelineTriggers(
                triggerData
              );
            }
          }

          // 5. Insert pipelineGlobal rules
          if (status.pipelineGlobal?.length) {
            for (const globalRule of status.pipelineGlobal) {
              // first global pipeline trigger
              await salesPipelineTriggersServices.addSalesPipelineTriggers({
                pipeline_id: pipeline.id,
                status: pipelineStatus.id,
                type: "pipelineGlobal",
                field_name: "pipeline",
                field_value: globalRule.pipeline,
              });

              // second global status trigger
              await salesPipelineTriggersServices.addSalesPipelineTriggers({
                pipeline_id: pipeline.id,
                status: pipelineStatus.id,
                type: "pipelineGlobal",
                field_name: "pipelineStatus",
                field_value: globalRule.pipelineStatus,
              });
            }
          }
        }
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            pipeline,
            "Pipeline created successfully with statuses, delay indicators and triggers"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Pipeline creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllSalesPipelines(req, res) {
    try {
      const pipelines = await salesPipelinesServices.getAllSalesPipelines(req.query);
  
      res.status(200).json({
        status: true,
        message: "Sales pipelines fetched successfully",
        ...pipelines, // spread to include pagination + data
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch Sales pipelines",
        error: err.message,
      });
    }
  },
  

  // async getSalesPipelinesById(req, res) {
  //   try {
  //     const pipelineId = req.query.id;
  //     if (!pipelineId) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Sales pipelines ID is required",
  //       });
  //     }

  //     const pipeline = await salesPipelinesServices.getSalesPipelinesById(
  //       pipelineId
  //     );

  //     if (!pipeline) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "Sales pipelines not found",
  //       });
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "Sales pipelines fetched successfully",
  //       data: pipeline,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       status: false,
  //       message: "Failed to fetch Sales pipelines",
  //       error: err.message,
  //     });
  //   }
  // },

  async getSalesPipelinesById(req, res) {
    try {
      const pipelineId = req.query.id;
      if (!pipelineId) {
        return res.status(400).json({
          status: false,
          message: "Sales pipelines ID is required",
        });
      }

      const pipeline = await salesPipelinesServices.getSalesPipelinesById(
        pipelineId
      );

      if (!pipeline) {
        return res.status(404).json({
          status: false,
          message: "Sales pipelines not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Sales pipelines fetched successfully",
        data: pipeline,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch Sales pipelines",
        error: err.message,
      });
    }
  },

  async updateSalesPipelines(req, res) {
    try {
      const pipelineId = req.query.id;
      const data = req.body;

      if (!pipelineId) {
        return res.status(400).json({
          status: false,
          message: "Sales pipeline ID is required",
        });
      }

      const updatedPipeline =
        await salesPipelinesServices.updateSalesPipelineWithRelations(
          pipelineId,
          data
        );

      if (!updatedPipeline) {
        return res.status(404).json({
          status: false,
          message: "Sales pipeline not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Sales pipeline updated successfully",
        data: updatedPipeline,
      });
    } catch (err) {
      console.error("Update Sales pipeline Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to update Sales pipeline",
        error: err.message,
      });
    }
  },

  async deleteSalesPipelines(req, res) {
    try {
      const pipelineId = req.query.id;

      if (!pipelineId) {
        return res.status(400).json({
          status: false,
          message: "Sales pipeline ID is required",
        });
      }

      const deleted = await salesPipelinesServices.deleteSalesPipelines(
        pipelineId
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Sales pipeline not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Sales pipeline deleted successfully",
      });
    } catch (err) {
      console.error("deleteSalesPipelines Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to delete Sales pipeline",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addSalesPipelines": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Sales pipelines name is Required")
            .custom(async (value) => {
              const existing =
                await salesPipelinesServices.getSalesPipelinesByName(value);
              if (existing) {
                throw new Error("Sales pipelines name already exists");
              }
              return true;
            }),
        ];
      }

      case "updateSalesPipelines": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Sales pipelines name is Required")
            .custom(async (value, { req }) => {
              const salesPipelinesId = parseInt(req.query.companyType);

              const existing =
                await salesPipelinesServices.getSalesPipelinesByName(value);

              if (existing && existing.id !== salesPipelinesId) {
                throw new Error("Sales pipelines name already exists");
              }

              return true;
            }),
        ];
      }
    }
  },
};
