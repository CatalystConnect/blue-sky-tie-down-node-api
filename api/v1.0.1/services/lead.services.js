var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where, Sequelize } = require("sequelize");

module.exports = {
  /*getAllLeads*/
  // async getAllLeads(page, per_page, search, date, take_all) {
  //   try {
  //     page = Math.max(parseInt(page) || 1, 1);
  //     const limit = Math.max(parseInt(per_page) || 10, 1);
  //     const offset = (page - 1) * limit;

  //     let whereCondition = {};

  //     if (date) {
  //       whereCondition.createdAt = {
  //         [Op.gte]: new Date(date + " 00:00:00"),
  //         [Op.lte]: new Date(date + " 23:59:59"),
  //       };
  //     }

  //     const include = [
  //       {
  //         model: db.companyObj,
  //         as: "company",
  //         required: false,
  //       },
  //       {
  //         model: db.projectObj,
  //         as: "project",
  //         required: false,
  //         include: [
  //           { model: db.taxesObj, as: "stateDetails" },
  //           { model: db.taxesObj, as: "zipCodeDetails" },
  //           { model: db.stateObj, as: "states" },
  //         ],
  //       },
  //       { model: db.contactsObj, as: "contact" },
  //       {
  //         model: db.userObj,
  //         as: "salePerson",
  //         attributes: { exclude: ["password"] },
  //       },
  //       {
  //         model: db.userObj,
  //         as: "engineer",
  //         attributes: { exclude: ["password"] },
  //       },
  //       { model: db.leadTeamsObj, as: "leadTeam" },
  //       { model: db.leadStatusesObj, as: "leadStatus" },
  //       {
  //         model: db.leadTagsObj,
  //         as: "lead_tags",
  //         include: [{ model: db.tagsObj, as: "tag" }],
  //       },
  //       {
  //         model: db.salesPipelinesObj,
  //         as: "salesPipelines",
  //         attributes: ["id", "name"],
  //       },
  //       {
  //         model: db.salesPipelinesStatusesObj,
  //         as: "salesPipelinesStatus",
  //         attributes: ["id", "name"],
  //       },
  //     ];

  //     const searchTerm = search?.trim();
  //     if (searchTerm) {
  //       whereCondition[Op.or] = [
  //         { "$company.name$": { [Op.iLike]: `%${searchTerm}%` } },
  //         { "$project.name$": { [Op.iLike]: `%${searchTerm}%` } },
  //       ];
  //     }

  //     const queryOptions = {
  //       where: whereCondition,
  //       include,
  //       distinct: true,
  //       order: [["id", "DESC"]],
  //       subQuery: false,
  //     };

  //     if (!(take_all && take_all === "all")) {
  //       queryOptions.limit = limit;
  //       queryOptions.offset = offset;
  //     }
  //     let { rows: leads, count } = await db.leadsObj.findAndCountAll({
  //       ...queryOptions,
  //     });

  //     let lastPage = Math.ceil(count / limit);
  //     let from = offset + 1;
  //     let to = offset + leads.length;

  //     return {
  //       leads,
  //       meta: {
  //         current_page: page,
  //         from: from,
  //         to: to,
  //         last_page: lastPage,
  //         per_page: limit,
  //         total: count,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // async getAllLeads(page, per_page, search, date, take_all) {
  //   try {
  //     page = Math.max(parseInt(page) || 1, 1);
  //     const limit = Math.max(parseInt(per_page) || 10, 1);
  //     const offset = (page - 1) * limit;

  //     let whereCondition = {};

  //     if (date) {
  //       whereCondition.createdAt = {
  //         [Op.gte]: new Date(date + " 00:00:00"),
  //         [Op.lte]: new Date(date + " 23:59:59"),
  //       };
  //     }

  //     const searchTerm = search?.trim();
  //     if (searchTerm) {
  //       whereCondition[Op.or] = [
  //         { "$company.name$": { [Op.iLike]: `%${searchTerm}%` } },
  //         { "$project.name$": { [Op.iLike]: `%${searchTerm}%` } },
  //       ];
  //     }

  //     // ✅ Step 1: Count total leads
  //     const total = await db.leadsObj.count({
  //       include: [
  //         { model: db.companyObj, as: "company", required: false },
  //         { model: db.projectObj, as: "project", required: false },
  //       ],
  //       where: whereCondition,
  //       distinct: true,
  //     });

  //     // ✅ Step 2: Get only lead IDs for the current page
  //     const idQueryOptions = {
  //       attributes: ["id"],
  //       include: [
  //         { model: db.companyObj, as: "company", required: false },
  //         { model: db.projectObj, as: "project", required: false },
  //       ],
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //     };

  //     if (!(take_all && take_all === "all")) {
  //       idQueryOptions.limit = limit;
  //       idQueryOptions.offset = offset;
  //     }

  //     const idResults = await db.leadsObj.findAll(idQueryOptions);
  //     const leadIds = idResults.map((item) => item.id);

  //     if (leadIds.length === 0) {
  //       return {
  //         leads: [],
  //         meta: {
  //           current_page: page,
  //           from: 0,
  //           to: 0,
  //           last_page: 0,
  //           per_page: limit,
  //           total: total,
  //         },
  //       };
  //     }

  //     // ✅ Step 3: Fetch full leads with includes
  //     const include = [
  //       { model: db.companyObj, as: "company" },
  //       {
  //         model: db.projectObj,
  //         as: "project",
  //         include: [
  //           { model: db.taxesObj, as: "stateDetails" },
  //           { model: db.taxesObj, as: "zipCodeDetails" },
  //           { model: db.stateObj, as: "states" },
  //         ],
  //       },
  //       { model: db.contactsObj, as: "contact" },
  //       {
  //         model: db.userObj,
  //         as: "salePerson",
  //         attributes: { exclude: ["password"] },
  //       },
  //       {
  //         model: db.userObj,
  //         as: "engineer",
  //         attributes: { exclude: ["password"] },
  //       },
  //       { model: db.leadTeamsObj, as: "leadTeam" },
  //       { model: db.leadStatusesObj, as: "leadStatus" },
  //       {
  //         model: db.leadScopeMappingsObj,
  //         as: "leadScopeMappings",
  //         required: false,
  //         separate: true,
  //         include: [
  //           {
  //             model: db.leadScopesObj,
  //             as: "leadScopes",
  //             required: false,
  //             separate: false,
  //           },
  //         ],
  //       },
  //       {
  //         model: db.leadTagsObj,
  //         as: "lead_tags",
  //         include: [{ model: db.tagsObj, as: "tag" }],
  //       },
  //       {
  //         model: db.salesPipelinesObj,
  //         as: "salesPipelines",
  //         attributes: ["id", "name"],
  //       },
  //       {
  //         model: db.salesPipelinesStatusesObj,
  //         as: "salesPipelinesStatus",
  //         attributes: ["id", "name"],
  //       },
  //     ];

  //     const leads = await db.leadsObj.findAll({
  //       where: { id: leadIds },
  //       include,
  //       order: [["id", "DESC"]],
  //     });

  //     const lastPage = Math.ceil(total / limit);
  //     const from = offset + 1;
  //     const to = offset + leads.length;

  //     return {
  //       leads,
  //       meta: {
  //         current_page: page,
  //         from,
  //         to,
  //         last_page: lastPage,
  //         per_page: limit,
  //         total: total,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllLeads(page, per_page, search, date, take_all) {
    try {
      // ---------- pagination safe ----------
      page = Math.max(parseInt(page) || 1, 1);
      const limit = Math.max(parseInt(per_page) || 10, 1);
      const offset = (page - 1) * limit;

      let whereCondition = {};

      // ---------- date filter ----------
      if (date) {
        whereCondition.createdAt = {
          [Op.gte]: new Date(date + " 00:00:00"),
          [Op.lte]: new Date(date + " 23:59:59"),
        };
      }

      // ---------- search ----------
      const searchTerm = search?.trim();
      if (searchTerm) {
        whereCondition[Op.or] = [
          { "$company.name$": { [Op.iLike]: `%${searchTerm}%` } },
          { "$project.name$": { [Op.iLike]: `%${searchTerm}%` } },
        ];
      }

      // ---------- TOTAL COUNT ----------
      const total = await db.leadsObj.count({
        include: [
          { model: db.companyObj, as: "company", required: false },
          { model: db.projectObj, as: "project", required: false },
        ],
        where: whereCondition,
        distinct: true,
      });

      // ---------- STEP 1: IDs (lazy load safe) ----------
      const idQueryOptions = {
        attributes: ["id"],
        include: [
          { model: db.companyObj, as: "company", required: false },
          { model: db.projectObj, as: "project", required: false },
        ],
        where: whereCondition,
        order: [["id", "DESC"]],
      };

      if (!(take_all && take_all === "all")) {
        idQueryOptions.limit = limit;
        idQueryOptions.offset = offset;
      }

      const idResults = await db.leadsObj.findAll(idQueryOptions);
      const leadIds = idResults.map((row) => row.id);

      if (leadIds.length === 0) {
        return {
          leads: [],
          meta: {
            page,
            limit,
            current_count: 0,
            loaded_till_now: offset,
            remaining: total,
            total,
            has_more: false,
          },
        };
      }

      // ---------- STEP 2: FULL DATA ----------
      const leads = await db.leadsObj.findAll({
        where: { id: leadIds },
        include: [
          { model: db.companyObj, as: "company" },
          {
            model: db.projectObj,
            as: "project",
            include: [
              { model: db.taxesObj, as: "stateDetails" },
              { model: db.taxesObj, as: "zipCodeDetails" },
              { model: db.stateObj, as: "states" },
            ],
          },
          { model: db.contactsObj, as: "contact" },
          {
            model: db.userObj,
            as: "salePerson",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.userObj,
            as: "engineer",
            attributes: { exclude: ["password"] },
          },
          { model: db.leadTeamsObj, as: "leadTeam" },
          { model: db.leadStatusesObj, as: "leadStatus" },
          {
            model: db.leadScopeMappingsObj,
            as: "leadScopeMappings",
            separate: true,
            include: [
              {
                model: db.leadScopesObj,
                as: "leadScopes",
              },
            ],
          },
          {
            model: db.leadTagsObj,
            as: "lead_tags",
            include: [{ model: db.tagsObj, as: "tag" }],
          },
          {
            model: db.salesPipelinesObj,
            as: "salesPipelines",
            attributes: ["id", "name"],
          },
          {
            model: db.salesPipelinesStatusesObj,
            as: "salesPipelinesStatus",
            attributes: ["id", "name"],
          },
        ],
        order: [["id", "DESC"]],
      });

      // ---------- LAZY LOAD META ----------
      const current_count = leads.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        leads,
        meta: {
          page,
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*addLead*/
  async addLead(postData) {
    try {
      let lead = await db.leadsObj.create(postData);
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getLeadById*/
  async getLeadById(leadId) {
    try {
      const lead = await db.leadsObj.findOne({
        where: { id: leadId },
        include: [
          {
            model: db.companyObj,
            as: "company",
            required: false,
            separate: false,
            include: [
              {
                model: db.companyTypeObj,
                as: "companyType",
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.contactsObj,
            as: "contact",
            required: false,
            separate: false,
          },
          {
            model: db.userObj,
            as: "salePerson",
            attributes: { exclude: ["password"] },
            required: false,
            separate: false,
          },
          {
            model: db.userObj,
            as: "engineer",
            attributes: { exclude: ["password"] },
            required: false,
            separate: false,
          },
          {
            model: db.leadScopeMappingsObj,
            as: "leadScopeMappings",
            required: false,
            separate: true,
            include: [
              {
                model: db.leadScopesObj,
                as: "leadScopes",
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.leadTeamsObj,
            as: "leadTeam",
            required: false,
            separate: false,
          },
          {
            model: db.leadStatusesObj,
            as: "leadStatus",
            required: false,
            separate: false,
          },
          {
            model: db.projectObj,
            as: "project",
            required: false,
            separate: false,
            include: [
              {
                model: db.projectTypeMappingsObj,
                as: "projectTypeMapping",
                required: false,
                separate: false,
                include: [
                  {
                    model: db.projectTypesObj,
                    as: "projectType",
                    required: false,
                    separate: false,
                  },
                ],
              },
              {
                model: db.taxesObj,
                as: "stateDetails",
                required: false,
                separate: false,
              },
              {
                model: db.taxesObj,
                as: "zipCodeDetails",
                required: false,
                separate: false,
              },
              {
                model: db.stateObj,
                as: "states",
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.budgetBooksObj,
            as: "lead_budget",
            required: false,
            separate: false,
            include: [
              {
                model: db.projectBudgetsObj,
                as: "budgets",
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.leadTagsObj,
            as: "lead_tags",
            required: false,
            separate: false,
            include: [
              {
                model: db.tagsObj,
                as: "tag",
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.leadTeamsMemberObj,
            as: "leadTeamMembers",
            required: false,
            separate: false,
            include: [
              {
                model: db.userObj,
                as: "userData",
                attributes: { exclude: ["password"] },
                required: false,
                separate: false,
              },
            ],
          },
          {
            model: db.salesPipelinesObj,
            as: "salesPipelines",
            attributes: ["id", "name"],
            required: false,
            separate: false,
          },
          {
            model: db.salesPipelinesStatusesObj,
            as: "salesPipelinesStatus",
            attributes: ["id", "name"],
            required: false,
            separate: false,
          },
        ],
      });

      // ---- Calculate budget_totals for each lead_budget ----
      if (lead?.lead_budget?.length) {
        lead.lead_budget = lead.lead_budget.map((element) => {
          const budgets = element.budgets || [];

          const fields = [
            "cost_beam",
            "cost_coridor",
            "cost_deck",
            "cost_misc",
            "cost_misc_hardware",
            "cost_posts",
            "cost_roof",
            "cost_rtu",
            "cost_sill_plate",
            "cost_smu",
            "cost_stair_wells",
            "cost_stl",
            "cost_sw_tiedown",
            "cost_up_lift",
            "price_coridor",
            "price_deck",
            "price_misc",
            "price_misc_hardware",
            "price_posts",
            "price_roof",
            "price_rtu",
            "price_sill_plate",
            "price_smu",
            "price_stair_wells",
            "price_stl",
            "price_sw_tiedown",
            "price_total",
            "price_up_lift",
          ];

          const budget_totals = {};
          fields.forEach((field) => (budget_totals[field] = 0));

          budgets.forEach((item) => {
            fields.forEach((field) => {
              budget_totals[field] += parseFloat(item[field]) || 0;
            });
          });

          return {
            ...element.toJSON(),
            budget_totals,
          };
        });
      }

      const leadWithTotals = {
        ...lead.toJSON(),
        lead_budget: lead.lead_budget,
      };

      return leadWithTotals;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadUpdate*/
  async leadUpdate(data, leadId) {
    try {
      const lead = await db.leadsObj.update(data, {
        where: { id: leadId },
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadDelete*/
  async leadDelete(leadId) {
    try {
      let leads = await db.leadsObj.destroy({
        where: { id: leadId },
      });
      return leads;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*setDefaultLead*/
  async setDefaultLead(leadId, isDefaultLead) {
    try {
      if (isDefaultLead === "true" || isDefaultLead === true) {
        await db.leadsObj.update({ isDefaultLead: false }, { where: {} });
        await db.leadsObj.update(
          { isDefaultLead: true },
          { where: { id: leadId } }
        );
      } else {
        await db.leadsObj.update(
          { isDefaultLead: false },
          { where: { id: leadId } }
        );
      }
      return await db.leadsObj.findByPk(leadId);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllLeadNotes*/
  async getAllLeadNotes(page, length, search, date, lead_id, take_all) {
    try {
      const limit = length || 10;
      const offset = (page - 1) * limit || 0;

      let whereCondition = { lead_id: lead_id };

      if (search) {
        whereCondition.notes = { [Sequelize.Op.like]: `%${search}%` };
      }

      if (date) {
        whereCondition.created_at = {
          [Sequelize.Op.gte]: new Date(date + " 00:00:00"),
          [Sequelize.Op.lte]: new Date(date + " 23:59:59"),
        };
      }

      let queryOptions = {
        where: whereCondition,
        include: [
          {
            model: db.userObj,
            as: "userName",
            attributes: ["id", "name", "email"],
            required: false,
          },
        ],
        order: [["id", "DESC"]],
        distinct: true,
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: notes, count } = await db.leadNotesObj.findAndCountAll(
        queryOptions
      );

      let lastPage = Math.ceil(count / limit);
      let from = offset + 1;
      let to = offset + notes.length;

      return {
        notes,
        meta: {
          current_page: page,
          from: from,
          to: to,
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

  /*addLeadtNotes*/
  async addLeadtNotes(postData) {
    try {
      const addLeadtNotes = await db.leadNotesObj.create(postData);
      return addLeadtNotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateLeadNotes*/
  async updateLeadNotes(leadNoteId, notes) {
    try {
      const [updated] = await db.leadNotesObj.update(
        { notes: notes },
        { where: { id: leadNoteId } }
      );

      if (updated === 0) return null;

      return await db.leadNotesObj.findByPk(leadNoteId);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // Delete Project Notes
  async deleteLeadNotes(leadNoteId) {
    try {
      const deleted = await db.leadNotesObj.destroy({
        where: { id: leadNoteId },
      });
      return deleted > 0;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* updateLeadTeamMember */
  async updateLeadTeamMember(members, leadId) {
    try {
      await db.leadTeamsMemberObj.destroy({ where: { lead_id: leadId } });

      const newMembers = members.map((userId) => ({
        lead_id: leadId,
        user_id: userId,
      }));

      await db.leadTeamsMemberObj.bulkCreate(newMembers);

      return await db.leadTeamsMemberObj.findAll({
        where: { lead_id: leadId },
        // include: [
        //   {
        //     model: db.userObj,
        //     as: "user",
        //     attributes: ["id", "full_name", "email"],
        //   },
        // ],
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* getLeadTeamMembers */
  async getLeadTeamMembers(leadId) {
    try {
      return await db.leadTeamsMemberObj.findAll({
        where: { lead_id: leadId },
        include: [
          {
            model: db.userObj,
            as: "userData",
            attributes: { exclude: ["password"] },
          },
        ],
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* updateLeadDcs */
  async updateLeadDcs(data) {
    try {
      const [updated] = await db.leadsObj.update(
        { dcs: data.dcs },
        { where: { id: data.id } }
      );

      if (updated) {
        return await db.leadsObj.findByPk(data.id);
      }
      return null;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* getAllProjectDatatakeoffLead */
  // async getAllProjectDatatakeoffLead(page, per_page, search, userId) {
  //   try {
  //     const limit = parseInt(per_page) || 10;
  //     const offset = (parseInt(page) - 1) * limit || 0;

  //     // Build project filter
  //     const projectWhere = {
  //       takeoff_status: {
  //         [db.Sequelize.Op.in]: ["takeoff_complete", "budget"],
  //       },
  //     };

  //     if (search && search.trim() !== "") {
  //       projectWhere[db.Sequelize.Op.and] = db.Sequelize.where(
  //         db.Sequelize.fn("LOWER", db.Sequelize.col("project.name")),
  //         {
  //           [db.Sequelize.Op.like]: `%${search.toLowerCase()}%`,
  //         }
  //       );
  //     }

  //     // ✅ 1️⃣ Main query with pagination
  //     const rows = await db.leadsObj.findAll({
  //       include: [
  //         {
  //           model: db.projectObj,
  //           as: "project",
  //           include:[
  //              { model: db.companyObj, as: "engineerCompany" },
  //              { model: db.gDriveAssociationObj, as: "googleDrive" },
  //               {
  //                   model: db.projectplanSetsObj, as: "planSets",}
  //           ], 
  //           required: true,
  //           where: projectWhere,
  //         },
  //         { model: db.companyObj, as: "company" },
  //         { model: db.contactsObj, as: "contact" },
  //         { model: db.leadStatusesObj, as: "leadStatus" },
  //         {
  //           model: db.leadTagsObj,
  //           as: "lead_tags",
  //           include: { model: db.tagsObj, as: "tag" },
  //         },
  //         { model: db.budgetBooksObj, as: "lead_budget" },
  //       ],
  //       limit,
  //       offset,
  //       order: [
  //         [
  //           db.Sequelize.literal(
  //             `CASE WHEN "leads"."priorty" = 'true' THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ],
  //     });

  //     // ✅ 2️⃣ Separate count query for total filtered records
  //     const count = await db.leadsObj.count({
  //       include: [
  //         {
  //           model: db.projectObj,
  //           as: "project",
  //           required: true,
  //           where: projectWhere,

  //         },
  //       ],
  //     });

  //     // ✅ Return only filtered count (not all)
  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         last_page: Math.ceil(count / limit),
  //         per_page: limit,
  //         total: count, // ✅ this is now filtered total
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllProjectDatatakeoffLead(page, per_page, search, userId) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const projectWhere = {
        takeoff_status: {
          [db.Sequelize.Op.in]: ["takeoff_complete", "budget"],
        },
      };

      if (search && search.trim() !== "") {
        projectWhere[db.Sequelize.Op.and] = db.Sequelize.where(
          db.Sequelize.fn("LOWER", db.Sequelize.col("project.name")),
          { [db.Sequelize.Op.like]: `%${search.toLowerCase()}%` }
        );
      }

      // ========== 1) MAIN QUERY ==========
      const rows = await db.leadsObj.findAll({
        include: [
          {
            model: db.projectObj,
            as: "project",
            include: [
              { model: db.companyObj, as: "engineerCompany" },
              { model: db.gDriveAssociationObj, as: "googleDrive" },
              { model: db.projectplanSetsObj, as: "planSets" },
            ],
            required: true,
            where: projectWhere,
          },
          { model: db.companyObj, as: "company" },
          { model: db.contactsObj, as: "contact" },
          { model: db.leadStatusesObj, as: "leadStatus" },
          {
            model: db.leadTagsObj,
            as: "lead_tags",
            include: { model: db.tagsObj, as: "tag" },
          },
          { model: db.budgetBooksObj, as: "lead_budget" },
        ],
        limit,
        offset,
        order: [
          [
            db.Sequelize.literal(`CASE WHEN "leads"."priorty" = 'true' THEN 0 ELSE 1 END`),
            "ASC",
          ],
          ["id", "DESC"],
        ],
      });

      // ========== 2) COUNT ==========
      const count = await db.leadsObj.count({
        include: [
          {
            model: db.projectObj,
            as: "project",
            required: true,
            where: projectWhere,
          },
        ],
      });

      // =======================================================================================
      // ========== 3) APPLY YOUR GOOGLE DRIVE STRUCTURE LOGIC (NO OLD LOGIC CHANGED) ==========
      // =======================================================================================

      const buildFolderStructure = (files) => {
        const folderMap = {};
        const rootFiles = [];

        files.forEach((item) => {
          if (item.type === "folder") {
            folderMap[item.file_name] = { folder: item, files: [] };
          }
        });

        files.forEach((item) => {
          if (item.type === "file" && item.parent) {
            const parentFolder = files.find((f) => f.id === item.parent);
            if (parentFolder && parentFolder.type === "folder") {
              folderMap[parentFolder.file_name].files.push(item);
            } else {
              rootFiles.push(item);
            }
          } else if (item.type === "file") {
            rootFiles.push(item);
          }
        });

        return { rootFiles, folders: folderMap };
      };

      // Loop through each lead row and transform project.googleDrive
      rows.forEach((lead) => {
        const project = lead.project;
        if (!project || !project.googleDrive) return;

        const googleDriveData = project.googleDrive;

        // --- Separate modules ---
        const modules = {
          projectFiles: [],
          completedFiles: [],
          planSet: [],
          budgetFiles: [],
        };

        googleDriveData.forEach((item) => {
          const file = item.dataValues || item;

          if (file.module === "projectFiles") modules.projectFiles.push(file);
          else if (file.module === "completedFiles" || file.module === "CompletedFiles")
            modules.completedFiles.push(file);
          else if (file.module === "planSetFiles") modules.planSet.push(file);
          else if (file.module === "budgetFiles") modules.budgetFiles.push(file);
        });

        // ------- PLAN SET logic -------
        const planSetFolderMap = {};
        project.planSets?.forEach((p, index) => {
          planSetFolderMap[p.id] = index + 1;
        });

        const planSet = {};
        modules.planSet.forEach((item) => {
          const moduleId = item.module_id;
          const folderNumber = planSetFolderMap[moduleId] || moduleId;

          if (!planSet[folderNumber]) {
            planSet[folderNumber] = { folder: null, files: [] };
          }

          if (!item.file_name) {
            planSet[folderNumber].folder = {
              drive_id: item.drive_id,
              createdAt: item.createdAt,
            };
          } else {
            planSet[folderNumber].files.push({
              drive_id: item.drive_id,
              file_name: item.file_name,
              createdAt: item.createdAt,
            });
          }
        });

        // ------- Folder structure for other modules -------
        const projectFiles = buildFolderStructure(modules.projectFiles);
        const completedFiles = buildFolderStructure(modules.completedFiles);
        const budgetFiles = buildFolderStructure(modules.budgetFiles);

        // Final assignment
        project.dataValues.googleDrive = {
          planSet,
          projectFiles,
          completedFiles,
          budgetFiles,
        };
      });

      // =======================================================================================

      return {
        data: rows,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + rows.length,
          last_page: Math.ceil(count / limit),
          per_page: limit,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* updateLeadPriority */
  async updateLeadPriority(id, takeoff_status, priority = false) {
    const updateData = {};

    updateData.priorty = priority;

    const [updatedRows] = await db.leadsObj.update(updateData, {
      where: { id },
    });

    return updatedRows;
  },
};
