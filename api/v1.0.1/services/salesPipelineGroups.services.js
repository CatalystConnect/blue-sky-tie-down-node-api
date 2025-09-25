var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
module.exports = {
  /*addSalesPipelinesGroups*/
  // async addSalesPipelinesGroups(postData) {
  //   try {
  //     let pipelineGroup = await db.salesPipelineGroupsObj.create(postData);
  //     return pipelineGroup;
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // async getPipelineGroupByName(name) {
  //   try {
  //     return await db.salesPipelineGroupsObj.findOne({ where: { name } });
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // /*getAllSalesPipelinesGroups*/
  // async getAllSalesPipelinesGroups(query) {
  //   try {
  //     let { page, per_page, limit, take_all, search, id } = query;

  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     limit = parseInt(limit) || null;
  //     const offset = (page - 1) * per_page;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         name: {
  //           [Op.like]: `%${search}%`,
  //         },
  //       };
  //     }

  //     let order = [["id", "DESC"]];
  //     if (id) {
  //       order = [
  //         [
  //           Sequelize.literal(
  //             `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ];
  //     }

  //     // ✅ Return all without pagination
  //     if (take_all === "all") {
  //       const groups = await db.salesPipelineGroupsObj.findAll({
  //         where: whereCondition,
  //         order: order,
  //         ...(limit ? { limit } : {}),
  //       });

  //       return {
  //         data: groups,
  //         total: groups.length,
  //         current_page: 1,
  //         per_page: groups.length,
  //         last_page: 1,
  //       };
  //     }

  //     // ✅ Paginated result
  //     const { rows, count } = await db.salesPipelineGroupsObj.findAndCountAll({
  //       where: whereCondition,
  //       order: order,
  //       limit: per_page,
  //       offset: offset,
  //     });

  //     return {
  //       data: rows,
  //       total: count,
  //       current_page: page,
  //       per_page: per_page,
  //       last_page: Math.ceil(count / per_page),
  //     };
  //   } catch (e) {
  //     console.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // //    /*get by id Company*/
  // async getSalesPipelinesGroupsById(id) {
  //   try {
  //     return await db.salesPipelineGroupsObj.findOne({
  //       where: { id: id },
  //     });
  //   } catch (e) {
  //     logger.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // //    /*update by id Company*/
  // async updateSalesPipelinesGroups(id, updatedData) {
  //   try {
  //     const pipelineGroup = await db.salesPipelineGroupsObj.findByPk(id);

  //     if (!pipelineGroup) {
  //       return null;
  //     }

  //     await pipelineGroup.update(updatedData);
  //     return pipelineGroup;
  //   } catch (e) {
  //     console.error("Service Update pipeline Group Error:", e.message);
  //     throw e;
  //   }
  // },

  //    /*delete by id Company*/
  //    async deleteCompanyType(id) {
  //      try {
  //        const companyType = await db.salesPipelineGroupsObj.findByPk(id);

  //        if (!companyType) {
  //          return false;
  //        }

  //        await companyType.destroy();
  //        return true;
  //      } catch (e) {
  //        logger.error(commonHelper.customizeCatchMsg(e));
  //        throw e;
  //      }
  //    },
};
