var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addDepartments*/
  async addDepartments(postData) {
    try {
      let departments = await db.departmentObj.create(postData);
      return departments;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* getAllDepartments */
  // async getAllDepartments({
  //   page = 1,
  //   limit = 10,
  //   search = "",
  //   take_all = false,
  //   id
  // }) {
  //   try {
  //     const offset = (page - 1) * limit;

  //     const whereCondition = {};
  //     if (search) {
  //       whereCondition.name = { [Op.like]: `%${search}%` };
  //     }

  //     if (id) {

  //       if (Array.isArray(id)) {
  //         whereCondition.id = { [Op.in]: id.map(x => parseInt(x)).filter(x => !Number.isNaN(x)) };
  //       } else {
  //         const idInt = parseInt(id);
  //         if (!Number.isNaN(idInt)) {
  //           whereCondition.id = idInt;
  //         }
  //       }
  //     }



  //     let queryOptions = {
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //     };

  //     if (!take_all) {
  //       queryOptions.limit = limit;
  //       queryOptions.offset = offset;
  //     }

  //     const { count, rows } = await db.departmentObj.findAndCountAll(
  //       queryOptions
  //     );

  //     return {
  //       departments: rows,
  //       total: count,
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllDepartments({
    page = 1,
    limit = 10,
    search = "",
    take_all = false,
    id
  }) {
    try {
      page = Number.isNaN(parseInt(page)) ? 1 : parseInt(page);
      limit = Number.isNaN(parseInt(limit)) ? 10 : parseInt(limit);
      const offset = (page - 1) * limit;

      const whereCondition = {};

      // Handle id filter (single or array) — but don't restrict, just for order
      let idInt = null;
      if (id) {
        if (Array.isArray(id)) {
          const ids = id.map(x => parseInt(x)).filter(x => !Number.isNaN(x));
          if (ids.length > 0) idInt = ids[0]; // take first for ordering
          whereCondition.id = { [Op.in]: ids };
        } else {
          const parsed = parseInt(id);
          if (!Number.isNaN(parsed)) {
            idInt = parsed;
            // don't filter by id, we want all rows
          }
        }
      }

      // Build order condition
      let orderCondition = [["id", "DESC"]];
      if (search || idInt) {
        const searchLower = search ? search.toLowerCase() : null;

        let caseExpr = "1"; // default
        if (idInt && searchLower) {
          caseExpr = `CASE 
                      WHEN departments.id = ${idInt} THEN 0
                      WHEN LOWER(name) LIKE '%${searchLower}%' THEN 1
                      ELSE 2 END`;
        } else if (idInt) {
          caseExpr = `CASE WHEN departments.id = ${idInt} THEN 0 ELSE 1 END`;
        } else if (searchLower) {
          caseExpr = `CASE WHEN LOWER(name) LIKE '%${searchLower}%' THEN 0 ELSE 1 END`;
        }

        orderCondition = [
          [db.Sequelize.literal(caseExpr), "ASC"],
          ["id", "DESC"]
        ];
      }

      // Query options
      let queryOptions = {
        where: whereCondition,
        order: orderCondition
      };

      if (!take_all) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      const { count, rows } = await db.departmentObj.findAndCountAll(queryOptions);

      return {
        departments: rows,
        total: count
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* getDepartmentById */
  async getDepartmentById(id) {
    try {
      const department = await db.departmentObj.findOne({
        where: { id: id },
      });
      return department;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* deleteDepartment */
  async deleteDepartment(id) {
    try {
      const deleted = await db.departmentObj.destroy({
        where: { id: id },
      });

      return deleted > 0;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* updateDepartment */
  async updateDepartment(postData) {
    try {
      let department = await db.departmentObj.findByPk(postData.id);

      if (!department) {
        throw new Error("Department not found");
      }

      if (postData.name) {
        department.name = postData.name;
      }

      await department.save();

      return department;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
