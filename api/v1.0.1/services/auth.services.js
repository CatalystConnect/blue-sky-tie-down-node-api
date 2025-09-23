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
  /*getUserByEmail*/
  async getUserByEmail(email) {
    try {
      let user = await db.userObj.findOne({
        where: { email: email },
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

  async getAllUsers(page, length, role, search, date, id, take_all, limit) {
    try {
      let whereCondition = {};

      if (role) {
        whereCondition.role = role;
      }
      if (id) {
        whereCondition.id = id;
      }
      if (search) {
        whereCondition[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
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
        order: [["id", "DESC"]],
      };

      // total count
      const total = await db.userObj.count({ where: whereCondition });

      if (!take_all) {
        queryOptions.limit = limit ? parseInt(limit) : length || 10;
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
        // include: [{ model: db.departmentObj, as: "department" }],
        attributes: {
          exclude: ["password"],
        },
      });
      console.log('userIduserId',users);
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
};
