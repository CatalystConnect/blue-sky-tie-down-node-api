var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addTags*/
  async addTags(postData) {
    try {
      let tag = await db.tagsObj.create(postData);
      return tag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllTags*/
  // async getAllTags({ page, per_page, search,id }) {
  //   try {
  //     const limit = parseInt(per_page);
  //     const offset = (page - 1) * limit;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         [Op.or]: [
  //           { title: { [Op.like]: `%${search}%` } },
  //           { color: { [Op.like]: `%${search}%` } },
  //           { type: { [Op.like]: `%${search}%` } },
  //         ]
  //       };
  //     }

  //     const { rows, count } = await db.tagsObj.findAndCountAll({
  //       where: whereCondition,
  //       limit,
  //       offset,
  //       order: [["id", "DESC"]],
  //       raw: true
  //     });

  //     const lastPage = Math.ceil(count / limit);

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: page,
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         last_page: lastPage,
  //         per_page: limit,
  //         total: count
  //       }
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
 async  getAllTags({ page = 1, per_page = 10, search, id }) {
  try {
    const limit = parseInt(per_page) || 10;
    const offset = (page - 1) * limit;

    let whereCondition = {};

    // ✅ Search filter (case-insensitive on title, color, type)
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { color: { [Op.iLike]: `%${searchTerm}%` } },
        { type: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    // ✅ Normalize IDs (single, array string, comma-separated)
    let idsArray = [];
    if (id) {
      try {
        if (id.startsWith("[")) {
          idsArray = JSON.parse(id);
        } else {
          idsArray = id.split(",").map((x) => parseInt(x.trim())).filter(Boolean);
        }
      } catch (err) {
        console.log("Invalid id format", err);
      }
    }

    // ✅ Ordering: prioritize IDs if provided
    let order = [["id", "DESC"]];
    if (idsArray.length > 0) {
      order = [
        [
          Sequelize.literal(
            `CASE 
              ${idsArray
                .map((id, index) => `WHEN "tags"."id" = ${parseInt(id)} THEN ${index}`)
                .join(" ")}
              ELSE ${idsArray.length} 
            END`
          ),
          "ASC",
        ],
        ["id", "DESC"],
      ];
    }

   
    const { rows, count } = await db.tagsObj.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order,
      raw: true,
    });

    const lastPage = Math.ceil(count / limit);

    return {
      data: rows,
      meta: {
        current_page: page,
        from: offset + 1,
        to: offset + rows.length,
        last_page: lastPage,
        per_page: limit,
        total: count,
      },
    };
  } catch (e) {
    logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
    throw e;
  }
},
  /*getTagsById*/
  async getTagsById(tagId) {
    try {
      let tag = await db.tagsObj.findOne({
        where: { id: tagId }
      });
      return tag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteTags*/
  async deleteTags(tagId) {
    try {
      let deleteTag = await db.tagsObj.destroy({
        where: { id: tagId }
      });
      return deleteTag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateTags*/
  async updateTags(data, tagId) {
    try {
      let updateTag = await db.tagsObj.update(data, {
        where: { id: tagId }
      });
      return updateTag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
}