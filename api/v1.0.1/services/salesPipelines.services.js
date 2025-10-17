var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addSalesPipelines*/
  async addSalesPipelines(postData) {
    try {
      let pipelines = await db.salesPipelinesObj.create(postData);
      return pipelines;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getSalesPipelinesByName*/
  async getSalesPipelinesByName(name) {
    try {
      return await db.salesPipelinesObj.findOne({ where: { name } });
    } catch (e) {
      console.error("getSalesPipelinesByName Error:", e.message); // replaced logger
      throw e;
    }
  },

  async getAllSalesPipelines(query) {
    try {
      let { page, per_page, limit, take_all, search, id } = query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || null;
      const offset = (page - 1) * per_page;

      const whereCondition = {};
      if (search) {
        whereCondition.name = { [Op.like]: `%${search}%` };
      }

      let order = [["id", "DESC"]];
      if (id) {
        order = [
          [
            Sequelize.literal(
              `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ];
      }

      const includeRelations = [
        { model: db.salesPipelineGroupsObj, as: "salesPipelineGroups" },
        { model: db.salesPipelinesStatusesObj, as: "salesPipelinesStatuses" },
        { model: db.salesPipelinesTriggersObj, as: "salesPipelinesTriggers" },
        {
          model: db.salesPipelinesDelayIndicatorsObj,
          as: "salesPipelinesDelayIndicators",
        },
      ];

      let pipelinesData, total;

      if (take_all === "all") {
        pipelinesData = await db.salesPipelinesObj.findAll({
          where: whereCondition,
          order,
          include: includeRelations,
          ...(limit ? { limit } : {}),
        });
        total = pipelinesData.length;
      } else {
        const { rows, count } = await db.salesPipelinesObj.findAndCountAll({
          where: whereCondition,
          order,
          include: includeRelations,
          limit: per_page,
          offset,
        });
        pipelinesData = rows;
        total = count;
      }

      const formattedData = pipelinesData.map((pipeline) => {
        const statuses =
          pipeline.salesPipelinesStatuses?.map((status) => ({
            id: status.id,
            status: status.name,
            order: status.order,
            is_default:
              status.is_default === "1" || status.is_default === true
                ? "true"
                : "0",
            hide_status: status.hide_status,
            expectedDays: status.expectedDays,
            rules: [],
          })) || [];

        return {
          id: pipeline.id,
          name: pipeline.name,
          materialType: pipeline.salesPipelineGroups || null,
          order: pipeline.order || 0,
          statusGroup: {
            pipelineStatus: statuses,
          },
          pipelineGlobal: {
            pipeline: pipeline.id,
            pipelineStatus: statuses.length ? statuses[0].id : null,
            status: statuses.length ? statuses[0].id : null,
          },
        };
      });

      return {
        data: formattedData,
        total,
        current_page: page,
        per_page,
        last_page: Math.ceil(total / per_page),
      };
    } catch (e) {
      console.error(
        "getAllSalesPipelines Error:",
        commonHelper.customizeCatchMsg(e)
      );
      throw e;
    }
  },

  async getSalesPipelinesById(pipelineId) {
    try {
      const pipeline = await db.salesPipelinesObj.findOne({
        where: { id: pipelineId },
        include: [
          { model: db.salesPipelineGroupsObj, as: "salesPipelineGroups" },
          { model: db.salesPipelinesStatusesObj, as: "salesPipelinesStatuses" },
          { model: db.salesPipelinesTriggersObj, as: "salesPipelinesTriggers" },
          {
            model: db.salesPipelinesDelayIndicatorsObj,
            as: "salesPipelinesDelayIndicators",
          },
        ],
      });

      if (!pipeline) return null;

      const formattedPipeline = {
        id: pipeline.id,
        name: pipeline.name,
        materialType: pipeline.salesPipelineGroups || null,
        order: pipeline.order || 0,
        statusGroup: {
          pipelineStatus:
            pipeline.salesPipelinesStatuses?.map((status) => ({
              id: status.id,
              status: status.name,
              order: status.order,
              is_default: status.is_default,
              leadCount: status.leadCount || 0, // assuming you have this column
              hide_status: status.hide_status,
              expectedDays: status.expectedDays,
              statusColor: status.statusColor,
              percentage: status.percentage,
              rules: [], // fill from triggers if needed
              pipelineGlobal: [], // if needed you can map pipeline-global relations
            })) || [],
        },
        pipelineDelayIndicators: pipeline.salesPipelinesDelayIndicators || [],
      };

      return formattedPipeline;
    } catch (err) {
      console.error("getSalesPipelinesById Error:", err);
      throw err;
    }
  },

  /*updateSalesPipelineWithRelations*/
  async updateSalesPipelineWithRelations(pipelineId, data) {
    try {
      // 1. Find pipeline
      const pipeline = await db.salesPipelinesObj.findByPk(pipelineId);

      if (!pipeline) return null;

      // 2. Update main pipeline data
      await pipeline.update({
        name: data.name,
        sales_pipeline_group_id: data.materialType,
        ordering: data.ordering || 0,
        status: data.status || pipeline.status,
      });

      // 3. Delete existing related records
      await db.salesPipelinesStatusesObj.destroy({
        where: { sales_pipeline_id: pipelineId },
      });
      await db.salesPipelinesTriggersObj.destroy({
        where: { sales_pipeline_id: pipelineId },
      });
      await db.salesPipelinesDelayIndicatorsObj.destroy({
        where: { sales_pipeline_id: pipelineId },
      });

      // 4. Insert new delay indicators
      if (Array.isArray(data.pipelineDelayIndicators)) {
        for (const indicator of data.pipelineDelayIndicators) {
          await db.salesPipelinesDelayIndicatorsObj.create({
            sales_pipeline_id: pipeline.id,
            delayDays: indicator.delayDays,
            color: indicator.color,
          });
        }
      }

      // 5. Insert new statuses and triggers
      if (data.statusGroup?.pipelineStatus?.length) {
        for (const statusItem of data.statusGroup.pipelineStatus) {
          const status = await db.salesPipelinesStatusesObj.create({
            name: statusItem.status,
            sales_pipeline_id: pipeline.id,
            expectedDays: statusItem.expectedDays || null,
            statusColor: statusItem.statusColor || null,
            percentage: statusItem.percentage || null,
            ordering: statusItem.order || 0,
            is_default: statusItem.is_default || "false",
            hide_status: "0",
          });

          // Insert triggers
          if (statusItem.rules?.length) {
            for (const rule of statusItem.rules) {
              await db.salesPipelinesTriggersObj.create({
                sales_pipeline_id: pipeline.id,
                status: status.id,
                type: "pipelineStatus",
                field_name: rule.type,
                field_value: rule.value,
              });
            }
          }

          // Insert pipelineGlobal triggers
          if (statusItem.pipelineGlobal?.length) {
            for (const globalRule of statusItem.pipelineGlobal) {
              await db.salesPipelinesTriggersObj.create({
                sales_pipeline_id: pipeline.id,
                status: status.id,
                type: "pipelineGlobal",
                field_name: "pipeline",
                field_value: globalRule.pipeline,
              });
              await db.salesPipelinesTriggersObj.create({
                sales_pipeline_id: pipeline.id,
                status: status.id,
                type: "pipelineGlobal",
                field_name: "pipelineStatus",
                field_value: globalRule.pipelineStatus,
              });
            }
          }
        }
      }

      // 6. Return pipeline with relations
      return await db.salesPipelinesObj.findOne({
        where: { id: pipeline.id },
        include: [
          { model: db.salesPipelineGroupsObj, as: "salesPipelineGroups" },
          { model: db.salesPipelinesStatusesObj, as: "salesPipelinesStatuses" },
          { model: db.salesPipelinesTriggersObj, as: "salesPipelinesTriggers" },
          {
            model: db.salesPipelinesDelayIndicatorsObj,
            as: "salesPipelinesDelayIndicators",
          },
        ],
      });
    } catch (e) {
      console.error("Update Sales pipeline Service Error:", e.message);
      throw e;
    }
  },

  /*deleteSalesPipelines*/
  async deleteSalesPipelines(id) {
    try {
      const pipeline = await db.salesPipelinesObj.findByPk(id);

      if (!pipeline) {
        return false;
      }

      await pipeline.destroy();

      return true;
    } catch (e) {
      console.error("deleteSalesPipelines Service Error:", e.message);
      throw e;
    }
  },

  async getSalesPipelinesLeads(pipelineId) {
    const whereCondition = {};

    if (pipelineId) {
      whereCondition.id = pipelineId;
    }

    return await db.salesPipelinesObj.findOne({
      where: whereCondition,
      include: [
        { model: db.salesPipelinesTriggersObj, as: "salesPipelinesTriggers" },
      ],
    });
  },
};
