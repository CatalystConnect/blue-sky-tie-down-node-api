var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*register*/
  async register(postData) {
    try {
      let user = await db.userObj.create(postData);
      return user;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getUserByEmail(email) {
    try {
      const user = await db.userObj.findOne({
        where: { email },
      });
      return user;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getUserByEmail*/
  async getUserByEmail(email) {
    try {
      let user = await db.userObj.findOne({
        where: { email: email },
        include: [
          {
            model: db.rolesObj,
            as: "roles",
            attributes: ["id", "name", "access"],
          },
        ],
        raw: true,
      });
      return user;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getUserByPhone*/
  async getUserByPhone(phoneNumber) {
    try {
      let user = await db.userObj.findOne({
        where: { phoneNumber: phoneNumber },
        raw: true,
      });
      return user;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // async getAllUsers(page, length, role, search, date, id, take_all, per_page, type) {
  //   try {
  //     let whereCondition = {};

  //     if (role) {
  //       whereCondition.role = role;
  //     }
  //     // if (id) {
  //     //   whereCondition.id = id;
  //     // }

  //     if (id) {
  //       try {
  //         if (id.startsWith("[")) {
  //           const idsArray = JSON.parse(id);

  //           whereCondition.id = {
  //             [Op.in]: idsArray,
  //           };
  //         } else {
  //           whereCondition.id = id;
  //         }
  //       } catch (err) {
  //         console.log("Invalid id format", err);
  //       }
  //     }
  //     if (type) {
  //       whereCondition.userType = type;
  //     }
  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { name: { [Op.like]: `%${search}%` } },
  //         { email: { [Op.like]: `%${search}%` } },
  //       ];
  //     }

  //     if (date) {
  //       const startOfDay = new Date(date + "T00:00:00");
  //       const endOfDay = new Date(date + "T23:59:59");

  //       whereCondition.createdAt = {
  //         [Op.between]: [startOfDay, endOfDay],
  //       };
  //     }

  //     let queryOptions = {
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //       attributes: { exclude: ["password"] },
  //       include: [
  //         {
  //           model: db.departmentObj,
  //           as: "department",
  //           attributes: ["id", "name"],
  //         },
  //         {
  //           model: db.rolesObj,
  //           as: "roles",
  //           attributes: ["id", "name"],
  //         },
  //       ],
  //     };

  //     // total count
  //     const total = await db.userObj.count({ where: whereCondition });

  //     if (!take_all) {
  //       queryOptions.limit = per_page ? parseInt(per_page) : length || 10;
  //       queryOptions.offset = (page - 1) * (length || 10);
  //     }

  //     const users = await db.userObj.findAll(queryOptions);

  //     return { users, total };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllUsers(page, length, role, search, date, id, take_all, per_page, type) {
    try {
      let whereCondition = {};

      if (role) {
        whereCondition.role = role;
      }

      let idsArray = null;
      if (id) {
        try {
          if (id.startsWith("[")) {
            idsArray = JSON.parse(id);
          } else {
            idsArray = [id];
          }

        } catch (err) {
          console.log("Invalid id format", err);
        }
      }

      if (type) {
        whereCondition.userType = type;
      }

      // if (search) {
      //   whereCondition[Op.or] = [
      //     { name: { [Op.like]: `%${search}%` } },
      //     { email: { [Op.like]: `%${search}%` } },
      //   ];
      // }

      if (search) {
        if (Array.isArray(search)) {
          search = search[search.length - 1]; // pick last param
        }
        if (typeof search === "string") {
          const searchLower = search.toLowerCase();

          whereCondition[Op.or] = [
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("users.name")),
              { [Op.like]: `%${searchLower}%` }
            ),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("users.email")),
              { [Op.like]: `%${searchLower}%` }
            )
          ];
        }
      }

      if (date) {
        const startOfDay = new Date(date + "T00:00:00");
        const endOfDay = new Date(date + "T23:59:59");

        whereCondition.createdAt = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      let queryOptions = {
        where: whereCondition,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.departmentObj,
            as: "department",
            attributes: ["id", "name"],
          },
          {
            model: db.rolesObj,
            as: "roles",
            attributes: ["id", "name"],
          },
        ],
      };

      // ✅ Custom ordering: prioritize IDs first, then rest by id DESC
      if (idsArray && idsArray.length > 0) {
        queryOptions.order = [
          [
            Sequelize.literal(
              `CASE WHEN "users"."id" IN (${idsArray.join(",")}) THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ];
      } else {
        queryOptions.order = [["id", "DESC"]];
      }

      // total count
      const total = await db.userObj.count({ where: whereCondition });

      if (!take_all) {
        queryOptions.limit = per_page ? parseInt(per_page) : length || 10;
        queryOptions.offset = (page - 1) * (length || 10);
      }

      const users = await db.userObj.findAll(queryOptions);

      return { users, total };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getUserById*/
  async getUserById(userId) {
    try {
      let users = await db.userObj.findAll({
        where: { id: userId },
        include: [
          {
            model: db.departmentObj,
            as: "department",
            attributes: ["id", "name"],
          },
          {
            model: db.rolesObj,
            as: "roles",
            attributes: ["id", "name"],
          },
        ],
        attributes: {
          exclude: ["password"],
        },
      });
      if (users.length === 0) {
        users = null;
      }
      return users;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateUser*/
  async updateUser(data, userId) {
    try {
      await db.userObj.update(data, { where: { id: userId } });
      // fetch updated user
      const updatedUser = await db.userObj.findByPk(userId);
      return updatedUser;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getUserById*/
  async deleteUser(userId) {
    try {
      let users = await db.userObj.destroy({
        where: { id: userId },
      });
      return users;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*totalUsers*/
  async totalUsers() {
    try {
      let users = await db.userObj.findAll();
      return users;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getSubContractorByEmail*/
  async getSubContractorByEmail(email) {
    try {
      let user = await db.userObj.findOne({
        where: { email: email, role: "qualified_contractor" },
        raw: true,
      });
      return user;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateSubContractor*/
  async updateSubContractor(data, email) {
    try {
      let updateUser = await db.userObj.update(data, {
        where: { email: email },
      });
      return updateUser;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getCustomerById*/
  async getCustomerById(userId) {
    try {
      let users = await db.leadsObj.findOne({
        where: { id: userId },
        attributes: {
          exclude: ["password"],
        },
        raw: true,
      });
      return users;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllUsersScroll(page, length, role, search, date, id, take_all, per_page, type) {
    try {
      let whereCondition = {};

      if (role) {
        whereCondition.role = role;
      }

      let idsArray = null;
      if (id) {
        try {
          if (id.startsWith("[")) {
            idsArray = JSON.parse(id);
          } else {
            idsArray = [id];
          }

        } catch (err) {
          console.log("Invalid id format", err);
        }
      }

      if (type) {
        whereCondition.userType = type;
      }

      // if (search) {
      //   whereCondition[Op.or] = [
      //     { name: { [Op.like]: `%${search}%` } },
      //     { email: { [Op.like]: `%${search}%` } },
      //   ];
      // }

      if (search) {
        if (Array.isArray(search)) {
          search = search[search.length - 1]; // pick last param
        }
        if (typeof search === "string") {
          const searchLower = search.toLowerCase();

          whereCondition[Op.or] = [
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("users.name")),
              { [Op.like]: `%${searchLower}%` }
            ),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("users.email")),
              { [Op.like]: `%${searchLower}%` }
            )
          ];
        }
      }

      if (date) {
        const startOfDay = new Date(date + "T00:00:00");
        const endOfDay = new Date(date + "T23:59:59");

        whereCondition.createdAt = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      let queryOptions = {
        where: whereCondition,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.departmentObj,
            as: "department",
            attributes: ["id", "name"],
          },
          {
            model: db.rolesObj,
            as: "roles",
            attributes: ["id", "name"],
          },
        ],
      };

      // ✅ Custom ordering: prioritize IDs first, then rest by id DESC
      if (idsArray && idsArray.length > 0) {
        queryOptions.order = [
          [
            Sequelize.literal(
              `CASE WHEN "users"."id" IN (${idsArray.join(",")}) THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ];
      } else {
        queryOptions.order = [["id", "DESC"]];
      }

      // total count
      const total = await db.userObj.count({ where: whereCondition });

      if (!take_all) {
        queryOptions.limit = per_page ? parseInt(per_page) : length || 10;
        queryOptions.offset = (page - 1) * (length || 10);
      }

      const users = await db.userObj.findAll(queryOptions);

      return { users, total };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAllUsersScrollTest(per_page, cursor, role, search) {
    try {
      let whereCondition = {};

     
      if (cursor) {
        whereCondition.id = { [Op.lt]: cursor };
      }

      
      if (role) whereCondition.role = role;

      if (search) {
        const searchLower = search.toLowerCase();
        whereCondition[Op.or] = [
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("users.name")), { [Op.like]: `%${searchLower}%` }),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("users.email")), { [Op.like]: `%${searchLower}%` }),
        ];
      }

      const users = await db.userObj.findAll({
        where: whereCondition,
        limit: per_page,
        order: [["id", "DESC"]],
        attributes: { exclude: ["password"] },
        include: [
          { model: db.departmentObj, as: "department", required: false, attributes: ["id", "name"] },
          { model: db.rolesObj, as: "roles", required: false, attributes: ["id", "name"] },
        ],
      });

      return { users };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
