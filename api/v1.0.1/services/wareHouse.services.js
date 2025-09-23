var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  async addWareHouse(postData) {
    try {
      const wareHouse = await db.wareHouseObj.create(postData);
      return wareHouse;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Get All WareHouse */
  async getAllWareHouse({ page, per_page, search, limit, take_all, id }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || per_page;
      const offset = (page - 1) * per_page;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          name: { [Op.like]: `%${search}%` },
        };
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

      if (take_all === "all") {
        const wareHouses = await db.wareHouseObj.findAll({
          where: whereCondition,
          order,
          limit: limit || undefined,
        });
        return { data: wareHouses, total: wareHouses.length };
      }

      const { rows, count } = await db.wareHouseObj.findAndCountAll({
        where: whereCondition,
        order,
        limit: per_page,
        offset,
      });

      return {
        data: rows,
        total: count,
        current_page: page,
        per_page,
        last_page: Math.ceil(count / per_page),
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Update WareHouse */
    async updateWareHouse(wareHouseId, data) {
      try {
        const [updated] = await db.wareHouseObj.update(data, {
          where: { id: wareHouseId },
        });

        if (!updated) return null;

        return await db.wareHouseObj.findOne({ where: { id: wareHouseId } });
      } catch (e) {
        logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
        throw e;
      }
    },

  /* Get WareHouse By Id */
  async getWareHouseById(wareHouseId) {
    try {
      const wareHouse = await db.wareHouseObj.findOne({
        where: { id: wareHouseId },
        raw: true,
      });
      return wareHouse;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Delete WareHouse */
  async deleteWareHouse(wareHouseId) {
    try {
      const deleted = await db.wareHouseObj.destroy({
        where: { id: wareHouseId },
      });
      return deleted; // returns number of rows deleted (0 or 1)
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
