var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addLeadScopes*/
  async addLeadScopes(postData) {
    try {
      let leadScopes = await db.leadScopesObj.create(postData);
      return leadScopes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* Get leadScopes by Name (for validation) */
  async getLeadScopesByName(name) {
    try {
      const leadScopes = await db.leadScopesObj.findOne({ where: { name } });
      return leadScopes;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*get all leadScopess*/
  // async findAllLeadScopes(query) {
  //   try {
  //     let { page, per_page, limit, take_all, search, id } = query;

  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     limit = parseInt(limit) || per_page;
  //     const offset = (page - 1) * per_page;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         name: { [Op.like]: `%${search}%` },
  //       };
  //     }

  //     let order = [["order", "ASC"]];
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

  //     // ✅ Take all case
  //     if (take_all === "all") {
  //       const leadScopes = await db.leadScopesObj.findAll({
  //         where: whereCondition,
  //         order,
  //         ...(limit ? { limit } : {}),
  //       });

  //       return {
  //         data: leadScopes,
  //         meta: {
  //           current_page: 1,
  //           from: 1,
  //           to: leadScopes.length,
  //           per_page: limit || leadScopes.length,
  //           total: leadScopes.length,
  //           last_page: 1,
  //         },
  //       };
  //     }

  //     // ✅ Normal paginated case
  //     const { rows, count } = await db.leadScopesObj.findAndCountAll({
  //       where: whereCondition,
  //       order,
  //       limit: per_page,
  //       offset,
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: page,
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         per_page,
  //         total: count,
  //         last_page: Math.ceil(count / per_page),
  //       },
  //     };
  //   } catch (e) {
  //     console.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // async findAllLeadScopes(query) {
  //   try {
  //     let { page, per_page, limit, take_all, search, ids } = query;

  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     limit = parseInt(limit) || per_page;
  //     const offset = (page - 1) * per_page;

  //     const Op = db.Sequelize.Op;
  //     let whereCondition = {};
  //     let order = [["order", "ASC"]];

  //     // ✅ Handle search
  //     if (search && search.trim() !== "") {
  //       const searchTerm = search.trim();
  //       whereCondition.name = { [Op.iLike]: `%${searchTerm}%` };

  //       // Bring search-matched items to top
  //       order = [
  //         [
  //           db.Sequelize.literal(
  //             `CASE WHEN name ILIKE '%${searchTerm}%' THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["order", "ASC"],
  //         ["id", "DESC"],
  //       ];
  //     }

  //     // ✅ Handle multiple IDs ([8,4,7,10])
  //     if (ids) {
  //       // Parse array (can come as string like "[8,4,7,10]" or real array)
  //       let idArray = [];
  //       try {
  //         idArray = Array.isArray(ids)
  //           ? ids.map(Number)
  //           : JSON.parse(ids).map(Number);
  //       } catch {
  //         idArray = String(ids)
  //           .replace(/[\[\]\s]/g, "")
  //           .split(",")
  //           .map(Number);
  //       }

  //       if (idArray.length > 0) {
  //         // Build CASE for priority order
  //         const orderCase = `CASE
  //           ${idArray.map((id, i) => `WHEN id = ${id} THEN ${i}`).join(" ")}
  //           ELSE ${idArray.length} END`;

  //         order = [
  //           [db.Sequelize.literal(orderCase), "ASC"],
  //           ["order", "ASC"],
  //           ["id", "DESC"],
  //         ];

  //         // Optionally: include only specific ids + search
  //         if (search && search.trim() !== "") {
  //           whereCondition = {
  //             [Op.and]: [
  //               { id: { [Op.in]: idArray } },
  //               { name: { [Op.iLike]: `%${search.trim()}%` } },
  //             ],
  //           };
  //         } else {
  //           whereCondition.id = { [Op.in]: idArray };
  //         }
  //       }
  //     }

  //     // ✅ Take all case
  //     if (take_all === "all") {
  //       const leadScopes = await db.leadScopesObj.findAll({
  //         where: whereCondition,
  //         order,
  //         ...(limit ? { limit } : {}),
  //       });

  //       return {
  //         data: leadScopes,
  //         meta: {
  //           current_page: 1,
  //           from: 1,
  //           to: leadScopes.length,
  //           per_page: limit || leadScopes.length,
  //           total: leadScopes.length,
  //           last_page: 1,
  //         },
  //       };
  //     }

  //     // ✅ Paginated case
  //     const { rows, count } = await db.leadScopesObj.findAndCountAll({
  //       where: whereCondition,
  //       order,
  //       limit: per_page,
  //       offset,
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: page,
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         per_page,
  //         total: count,
  //         last_page: Math.ceil(count / per_page),
  //       },
  //     };
  //   } catch (e) {
  //     console.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  async findAllLeadScopes(query) {
    try {
      let { page, per_page, limit, take_all, search, ids } = query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || per_page;
      const offset = (page - 1) * per_page;

      const Op = db.Sequelize.Op;
      let whereCondition = {};
      let order = [["order", "ASC"]];

      if (search && search.trim() !== "") {
        const searchTerm = search.trim();
        whereCondition.name = { [Op.iLike]: `%${searchTerm}%` };
      }

      let idArray = [];
      if (ids) {
        try {
          idArray = Array.isArray(ids)
            ? ids.map(Number)
            : JSON.parse(ids).map(Number);
        } catch {
          idArray = String(ids)
            .replace(/[\[\]\s]/g, "")
            .split(",")
            .map(Number)
            .filter(Boolean);
        }
      }

      if (idArray.length > 0) {
        const orderCase = `CASE 
          ${idArray.map((id, i) => `WHEN id = ${id} THEN ${i}`).join(" ")} 
          ELSE ${idArray.length} END`;

        order = [
          [db.Sequelize.literal(orderCase), "ASC"],
          ["order", "ASC"],
          ["id", "DESC"],
        ];
      } else {
        order = [
          ["order", "ASC"],
          ["id", "DESC"],
        ];
      }

      if (take_all === "all") {
        const leadScopes = await db.leadScopesObj.findAll({
          where: whereCondition,
          order,
          ...(limit ? { limit } : {}),
        });

        return {
          data: leadScopes,
          meta: {
            current_page: 1,
            from: 1,
            to: leadScopes.length,
            per_page: limit || leadScopes.length,
            total: leadScopes.length,
            last_page: 1,
          },
        };
      }

      const { rows, count } = await db.leadScopesObj.findAndCountAll({
        where: whereCondition,
        order,
        limit: per_page,
        offset,
      });

      return {
        data: rows,
        meta: {
          current_page: page,
          from: offset + 1,
          to: offset + rows.length,
          per_page,
          total: count,
          last_page: Math.ceil(count / per_page),
        },
      };
    } catch (e) {
      console.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*get by id leadScopess*/
  async getLeadScopesById(id) {
    try {
      const leadScopes = await db.leadScopesObj.findOne({
        where: { id: id },
      });
      return leadScopes;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*update by id leadScopess*/
  async updateLeadScopes(id, updatedData) {
    try {
      const leadScopes = await db.leadScopesObj.findByPk(id);

      if (!leadScopes) {
        return null;
      }

      await leadScopes.update(updatedData);
      return leadScopes;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*delete by id leadScopess*/
  async deleteLeadScopes(id) {
    try {
      const leadScopes = await db.leadScopesObj.findByPk(id);

      if (!leadScopes) {
        return false;
      }

      await leadScopes.destroy();
      return true;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
