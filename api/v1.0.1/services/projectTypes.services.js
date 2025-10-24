var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op,Sequelize } = require("sequelize");

module.exports = {
  /*addProjectTypes*/
  async addProjectTypes(postData) {
    try {
      let projectTypes = await db.projectTypesObj.create(postData);
      return projectTypes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

    /* Get Project Types by Name (for validation) */
 async getProjectTypesByName(title) {
    try {
      return await db.projectTypesObj.findOne({ where: { title } });
    } catch (e) {
      console.error("Error in getProjectTypesByName:", e.message);
      throw e;
    }
  },


  // /*getAllProjectTypes*/
  // async getAllProjectTypes({ page, per_page, search,offset }) {
  //   try {
  //     const offset = (page - 1) * per_page;

  //     const whereCondition = {};

  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { title: { [Op.iLike]: `%${search}%` } },
  //         { color: { [Op.iLike]: `%${search}%` } },
  //       ];
  //     }

  //     const { rows, count } = await db.projectTypesObj.findAndCountAll({
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //       per_page,
  //       offset,
  //     });

  //     return {
  //       total: count,
  //       page,
  //       per_page,
  //       data: rows,
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

async getAllProjectTypes({ page, per_page, search, offset, id }) {
  try {
    const whereCondition = {};

    // 🔹 Search condition
    if (search && search.trim() !== "") {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    // 🔹 Order condition (default and prioritized by ID)
    let order = [["id", "DESC"]];

    if (id) {
      order = [
        [
          Sequelize.literal(`CASE WHEN "project_types"."id" = ${parseInt(id)} THEN 0 ELSE 1 END`),
          "ASC",
        ],
        ["id", "DESC"],
      ];
    }

    // 🔹 Separate count to ensure total records are correct
    const total = await db.projectTypesObj.count({ where: whereCondition });

    // 🔹 Fetch paginated data
    const rows = await db.projectTypesObj.findAll({
      where: whereCondition,
      order,
      limit: per_page,
      offset,
    });

    return {
      total,
      page,
      per_page,
      data: rows,
    };
  } catch (e) {
    console.error("Error in getAllProjectTypes:", e.message);
    throw e;
  }
},



  /*getProjectTypesById*/
  async getProjectTypesById(id) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({
        where: { id },
      });

      if (!projectTypes) {
        throw new Error("Project types not found");
      }

      return projectTypes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteProjectTypes*/
  async deleteProjectTypes(id) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({ where: { id } });
      if (!projectTypes) {
        throw new Error("Project types not found");
      }

      // Soft delete
      await projectTypes.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateProjectTypes*/
  async updateProjectTypes(id, postData) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!projectTypes) throw new Error("Project types not found");

      const updated = await projectTypes.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
