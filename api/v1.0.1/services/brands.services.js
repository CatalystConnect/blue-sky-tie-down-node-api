var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addBrand*/
  async addBrand(postData) {
    try {
      let brand = await db.brandObj.create(postData);
      return brand;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* Get Brand by Name (for validation) */
  async getBrandByName(name) {
    try {
      const brand = await db.brandObj.findOne({ where: { name } });
      return brand;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*get all brands*/
  async findAllBrands(query) {
    try {
      let { page, per_page, limit, take_all, search, id } = query;

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
        const brands = await db.brandObj.findAll({
          where: whereCondition,
          order: order,
          limit: limit || undefined,
        });
        return { data: brands, total: brands.length };
      }

      const { rows, count } = await db.brandObj.findAndCountAll({
        where: whereCondition,
        order: order,
        limit: per_page,
        offset: offset,
      });

      return {
        data: rows,
        total: count,
        current_page: page,
        per_page: per_page,
        last_page: Math.ceil(count / per_page),
      };
    } catch (e) {
      console.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*get by id brands*/
  async findOneBrand(id) {
    try {
      const brand = await db.brandObj.findOne({
        where: { id: id },
      });
      return brand;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*update by id brands*/
  async updateBrand(id, updatedData) {
    try {
      const brand = await db.brandObj.findByPk(id);

      if (!brand) {
        return null;
      }

      await brand.update(updatedData);
      return brand;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*delete by id brands*/
  async deleteBrand(id) {
    try {
      const brand = await db.brandObj.findByPk(id);

      if (!brand) {
        return false;
      }

      await brand.destroy();
      return true;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
