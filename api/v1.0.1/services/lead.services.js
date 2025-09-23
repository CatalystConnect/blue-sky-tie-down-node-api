var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

module.exports = {
  /*getAllLeads*/
  // async getAllLeads(page, length, search, date, role_id, take_all) {
  //   try {
  //     const limit = length || 10;
  //     const offset = (page - 1) * limit || 0;

  //     let salesPersonWhere = [];

  //     let whereCondition = {};

  //     if (date) {
  //       whereCondition.date = date;
  //     }

  //     if (role_id) {
  //       salesPersonWhere = { id: role_id };
  //     }

  //     if (role !== "administrator") {
  //       salesPersonWhere = { role: "sales" };
  //     }

  //     if (date) {
  //       whereCondition.date = date;
  //     }

  //     let queryOptions = {
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //       distinct: true,
  //       include: [
  //         {
  //           model: db.saleMaterialQuotesObj,
  //           as: "quotes",
  //           include: [
  //             {
  //               model: db.contractObj,
  //               as: "contractor",
  //             },
  //           ],
  //         },
  //         {
  //           model: db.generatedContractorsObj,
  //           as: "generatedContractors",
  //           attributes: ["id", "status"],
  //         },
  //         {
  //           model: db.userObj,
  //           as: "customer",
  //           attributes: { exclude: ["password"] },
  //           where: search
  //             ? where(fn("LOWER", col("customer.firstName")), {
  //                 [Op.like]: `%${search.toLowerCase()}%`,
  //               })
  //             : undefined,
  //         },
  //         {
  //           model: db.userObj,
  //           as: "salesPersons",
  //           attributes: { exclude: ["password"] },
  //           where: salesPersonWhere,
  //           required: role !== "administrator",
  //           required: true,
  //         },
  //         {
  //           model: db.projectImagesObj,
  //           as: "projectImages",
  //         },
  //       ],
  //     };

  //     if (!(take_all && take_all === "all")) {
  //       queryOptions.limit = limit;
  //       queryOptions.offset = offset;
  //     }

  //     let { rows: leads, count } = await db.leadsObj.findAndCountAll(
  //       queryOptions
  //     );

  //     return { leads, count };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  async getAllLeads(
    page,
    length,
    search,
    date,
    role_id,
    userId,
    role,
    take_all
  ) {
    try {
      const limit = length || 10;
      const offset = (page - 1) * limit || 0;

      let salesPersonWhere = {};
      let salesPersonRequired = false;
      let whereCondition = {};

      if (date) {
        whereCondition.date = date;
      }
      if (role === "administrator") {
        // admin: only restrict to a specific salesperson if role_id was provided
        if (role_id) {
          salesPersonWhere.id = role_id;
          salesPersonRequired = true; // enforce inner join to actually filter leads
        }
      } else if (role === "sales") {
        // salesperson: always show only their leads
        salesPersonWhere.id = userId;
        salesPersonRequired = true;
      }

      let queryOptions = {
        where: whereCondition,
        order: [["id", "DESC"]],
        distinct: true,
        include: [
          {
            model: db.saleMaterialQuotesObj,
            as: "quotes",
            include: [
              {
                model: db.contractObj,
                as: "contractor",
              },
            ],
          },
          {
            model: db.generatedContractorsObj,
            as: "generatedContractors",
            attributes: ["id", "status"],
          },
          {
            model: db.userObj,
            as: "customer",
            attributes: { exclude: ["password"] },
            where: search
              ? where(fn("LOWER", col("customer.firstName")), {
                  [Op.like]: `%${search.toLowerCase()}%`,
                })
              : undefined,
          },
          {
            model: db.userObj,
            as: "salesPersons",
            attributes: { exclude: ["password"] },
            where: Object.keys(salesPersonWhere).length
              ? salesPersonWhere
              : undefined,
            required: salesPersonRequired,
          },
          {
            model: db.projectImagesObj,
            as: "projectImages",
          },
        ],
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: leads, count } = await db.leadsObj.findAndCountAll(
        queryOptions
      );

      return { leads, count };
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
      let lead = await db.leadsObj.findOne({
        where: { id: leadId },
        // raw: true,
        include: [
          {
            model: db.saleMaterialQuotesObj,
            as: "quotes",
            include: [
              {
                model: db.contractObj,
                as: "contractor",
              },
            ],
          },
          {
            model: db.generatedContractorsObj,
            as: "generatedContractors",
            attributes: ["id", "status"],
          },
          {
            model: db.userObj,
            as: "customer",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.projectImagesObj,
            as: "projectImages",
          },
        ],
      });
      if (lead && lead.projectImages) {
        lead = lead.toJSON();

        const structured = {
          diagrams: {
            measures2D: [],
            diagram2D: [],
            satellite: [],
          },
          projectImages: {
            locationPhotos: {
              side1: [],
              side2: [],
              front: [],
              back: [],
            },
            specialPhotos: {
              skyLights: [],
              penetrations: [],
              chimneys: [],
              eave: [],
              transitionsToSiding: [],
              overheadElectric: [],
            },
          },
        };

        lead.projectImages.forEach((img) => {
          switch (img.image_type) {
            case "measures2D":
              structured.diagrams.measures2D.push(img);
              break;
            case "diagram2D":
              structured.diagrams.diagram2D.push(img);
              break;
            case "satellite":
              structured.diagrams.satellite.push(img);
              break;

            case "side1OfProject":
              structured.projectImages.locationPhotos.side1.push(img);
              break;
            case "side2OfProject":
              structured.projectImages.locationPhotos.side2.push(img);
              break;
            case "frontOfProject":
              structured.projectImages.locationPhotos.front.push(img);
              break;
            case "backOfProject":
              structured.projectImages.locationPhotos.back.push(img);
              break;

            case "skyLights":
              structured.projectImages.specialPhotos.skyLights.push(img);
              break;
            case "penetrations":
              structured.projectImages.specialPhotos.penetrations.push(img);
              break;
            case "chimneys":
              structured.projectImages.specialPhotos.chimneys.push(img);
              break;
            case "eave":
              structured.projectImages.specialPhotos.eave.push(img);
              break;
            case "transitionsToSiding":
              structured.projectImages.specialPhotos.transitionsToSiding.push(
                img
              );
              break;
            case "overheadElectric":
              structured.projectImages.specialPhotos.overheadElectric.push(img);
              break;
          }
        });

        lead.projectImages = structured;
      }

      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*leadUpdate*/
  async leadUpdate(data, leadId) {
    try {
      let lead = await db.leadsObj.update(data, {
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
  /*totalLeads*/
  async totalLeads(page, length, search, date, take_all) {
    try {
      let leads = await db.leadsObj.findAll();
      return leads;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*createActivity*/
  async createActivity(postData) {
    try {
      let lead = await db.activitiesObj.bulkCreate(postData);
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addRoofMeasure*/
  async addRoofMeasure(postData) {
    try {
      let lead = await db.roofMeasureObj.create(postData);
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateRoofMeasure*/
  async updateRoofMeasure(data, leadId) {
    try {
      let updateRoofMeasure = await db.roofMeasureObj.update(data, {
        where: { leadId: leadId },
      });
      return updateRoofMeasure;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getRoofMeasureById*/
  async getRoofMeasureById(roofMeasureId) {
    try {
      let lead = await db.roofMeasureObj.findOne({
        where: { id: roofMeasureId },
        raw: true,
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*roofMeasureList*/
  async roofMeasureList(page, length) {
    try {
      limit = length || 10;
      offset = (page - 1) * limit || 0;
      let roofMeasureObj = await db.roofMeasureObj.findAll({
        offset,
        limit,
        order: [["id", "DESC"]],
      });
      return roofMeasureObj;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*roofMeasureTotal*/
  async roofMeasureTotal() {
    try {
      let roofMeasureObj = await db.roofMeasureObj.findAll();
      return roofMeasureObj;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*roofMeasureExist*/
  async roofMeasureExist(leadId) {
    try {
      let lead = await db.roofMeasureObj.findOne({
        where: { leadId: leadId },
        raw: true,
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllGenerateContractor*/
  async getAllGenerateContractor({
    leadId,
    saleMaterialQuotesId,
    contractorId,
  }) {
    try {
      let lead = await db.leadsObj.findOne({ where: { id: leadId } });
      if (!lead) throw new Error("Lead not found");

      let quote = await db.saleMaterialQuotesObj.findOne({
        where: { id: saleMaterialQuotesId },
      });
      if (!quote) throw new Error("Sale Material Quote not found");

      let contractor = await db.contractObj.findOne({
        where: { id: contractorId },
      });
      if (!contractor) throw new Error("Contractor not found");

      let existing = await db.generatedContractorsObj.findOne({
        where: {
          lead_id: leadId,
          sale_material_quotes_id: saleMaterialQuotesId,
          contractor_id: contractorId,
        },
      });

      if (existing) {
        return {
          status: false,
          message:
            "This contractor is already generated for the given lead & quote",
        };
      }

      let newContractorRecord = await db.generatedContractorsObj.create({
        lead_id: leadId,
        sale_material_quotes_id: saleMaterialQuotesId,
        contractor_id: contractorId,
      });

      return {
        status: true,
        message: "Generate Contractor added successfully",
        lead,
        quote,
        contractor,
        generated: newContractorRecord,
      };
    } catch (err) {
      throw err;
    }
  },

  /*sendContractMail*/
  async sendContractMail(datass) {
    try {
      const lead = await db.leadsObj.findOne({
        where: { id: datass.lead_id },
        include: [
          {
            model: db.userObj,
            as: "customer",
            attributes: ["id", "email"],
          },
        ],
      });

      if (!lead || !lead.customer) {
        return null;
      }

      if (lead.customer.email !== datass.custmoreEmail) {
        return null;
      }

      await db.leadsObj.update(
        { leadContractStatus: datass.status },
        { where: { id: datass.lead_id } }
      );
      return {
        id: lead.id,
        status: datass.status,
        customer: lead.customer,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*acceptRejectStatusUpdate*/
  async acceptRejectStatusUpdate(leadId, status) {
    try {
      const leadData = await db.leadsObj.findOne({ where: { id: leadId } });

      if (!leadData) {
        return null;
      }

      await db.leadsObj.update(
        { leadContractStatus: status },
        { where: { id: leadId } }
      );

      const updatedLead = await db.leadsObj.findOne({ where: { id: leadId } });

      return updatedLead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllCustomerQuote*/
  async getAllCustomerQuote(leadId) {
    try {
      const contract = await db.generatedContractorsObj.findOne({
        where: { lead_id: leadId },
        include: [
          {
            model: db.leadsObj,
            as: "lead",
            include: [
              { model: db.userObj, as: "customer" },
              { model: db.projectImagesObj, as: "projectImages" },
            ],
          },
          { model: db.contractObj, as: "contractor" },
          {
            model: db.saleMaterialQuotesObj,
            as: "saleMaterialQuote",
            include: [
              {
                model: db.saleAdditionalQuotesitemObj,
                as: "items",
                include: [
                  {
                    model: db.itemObj,
                    as: "itemDetails",
                    include: [{ model: db.itemUnitsObj, as: "units" }],
                  },
                  {
                    model: db.unitObj,
                    as: "unitData", // ✅ move here
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!contract) return null;

      const contractData = contract.toJSON();

      const products =
        contract.saleMaterialQuote?.items?.map((item) => ({
          id: item.itemDetails?.id || "",
          name: item.itemDetails?.sku || "",
          units: (item.itemDetails?.units || []).map((u) => ({
            quantity: u.qty || "",
            unit: u.um || "",
          })),
        })) || [];

      if (contractData.lead && contractData.lead.projectImages) {
        const structured = {
          diagrams: {
            measures2D: [],
            diagram2D: [],
            satellite: [],
          },
          projectImages: {
            locationPhotos: {
              side1: [],
              side2: [],
              front: [],
              back: [],
            },
            specialPhotos: {
              skyLights: [],
              penetrations: [],
              chimneys: [],
              eave: [],
              transitionsToSiding: [],
              overheadElectric: [],
            },
          },
        };

        contractData.lead.projectImages.forEach((img) => {
          switch (img.image_type) {
            case "measures2D":
              structured.diagrams.measures2D.push(img);
              break;
            case "diagram2D":
              structured.diagrams.diagram2D.push(img);
              break;
            case "satellite":
              structured.diagrams.satellite.push(img);
              break;

            case "side1OfProject":
              structured.projectImages.locationPhotos.side1.push(img);
              break;
            case "side2OfProject":
              structured.projectImages.locationPhotos.side2.push(img);
              break;
            case "frontOfProject":
              structured.projectImages.locationPhotos.front.push(img);
              break;
            case "backOfProject":
              structured.projectImages.locationPhotos.back.push(img);
              break;

            case "skyLights":
              structured.projectImages.specialPhotos.skyLights.push(img);
              break;
            case "penetrations":
              structured.projectImages.specialPhotos.penetrations.push(img);
              break;
            case "chimneys":
              structured.projectImages.specialPhotos.chimneys.push(img);
              break;
            case "eave":
              structured.projectImages.specialPhotos.eave.push(img);
              break;
            case "transitionsToSiding":
              structured.projectImages.specialPhotos.transitionsToSiding.push(
                img
              );
              break;
            case "overheadElectric":
              structured.projectImages.specialPhotos.overheadElectric.push(img);
              break;
          }
        });

        contractData.lead.projectImages = structured;
      }
      return {
        id: contract.id,
        leadId: contract.lead_id,
        saleMaterialQuoteId: contract.sale_material_quotes_id,
        contractorId: contract.contractor_id,
        status: contract.lead?.leadContractStatus || "",
        roofProposal: {
          contractorInformation: {
            companyName: contract.contractor?.contractorName || "",
            phone: contract.contractor?.contractorPhone || "",
            address: contract.contractor?.contractorAddress || "",
            contractNotes: contract.contractor?.notes || "",
            datePrepared: "",
            cityState: `${contract.contractor?.contractorCity || ""}, ${
              contract.contractor?.contractorState || ""
            }`,
            preparedBy: "",
            preferredContractor: contract.lead?.preferredContractor || "",
          },

          projectInformation: {
            // propertyOwner: `${contract.lead?.firstName || ""} ${contract.lead?.lastName || ""}`,
            // email: contract.lead?.email || "",
            // contactNumber: contract.lead?.phone || "",
            // projectAddress: contract.lead?.address || "",
            leadId: contract.lead?.id || "",
            propertyOwner: `${contract.lead?.customer?.firstName || ""} ${
              contract.lead?.customer?.lastName || ""
            }`,
            email: contract.lead?.customer?.email || "",
            customerId: contract.lead?.customer?.id || "",
            customerSignature: contract.lead?.customer?.customerSignature || "",
            // leadContractStatus: contract.lead?.leadContractStatus || "",
            contactNumber: contract.lead?.customer?.phone || "",
            projectAddress: contract.lead?.address || "",
            roofType: "",
            license: "",
            projectImages: contractData.lead?.projectImages || "",
          },
          orderDetails: {
            products,
            summary: {
              subtotal: contract.saleMaterialQuote?.material_total || 0,
              materialTax: contract.saleMaterialQuote?.tax_amount || 0,
              other: contract.saleMaterialQuote?.additional_total || 0,
              totalWithTax: contract.saleMaterialQuote?.total || 0,
            },
          },

          saleMaterialQuoteData: contract.saleMaterialQuote,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*projectImages*/
  async projectImages(imageDataArray) {
    try {
      if (!imageDataArray || !imageDataArray.length) return [];
      const insertedImages = await db.projectImagesObj.bulkCreate(
        imageDataArray
      );
      return insertedImages;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* getAllLeadBySales */
  async getAllLeadBySales(page, perPage, userId, role, search, date) {
    try {
      const limit = perPage;
      const offset = (page - 1) * limit;

      let salesPersonWhere = [];

      let whereCondition = {};

      if (date) {
        whereCondition.date = date;
      }

      if (role !== "administrator") {
        salesPersonWhere = { role: "sales" };
      }

      const { count, rows } = await db.leadsObj.findAndCountAll({
        offset,
        limit,
        distinct: true,
        order: [["id", "DESC"]],
        where: whereCondition,
        include: [
          {
            model: db.saleMaterialQuotesObj,
            as: "quotes",
            include: [
              {
                model: db.contractObj,
                as: "contractor",
              },
            ],
          },
          {
            model: db.generatedContractorsObj,
            as: "generatedContractors",
            attributes: ["id", "status"],
          },
          {
            model: db.userObj,
            as: "customer",
            attributes: { exclude: ["password"] },
            where: search
              ? where(fn("LOWER", col("customer.firstName")), {
                  [Op.like]: `%${search.toLowerCase()}%`,
                })
              : undefined,
          },
          {
            model: db.userObj,
            as: "salesPersons",
            attributes: { exclude: ["password"] },
            where: salesPersonWhere,
            required: role !== "administrator",
            required: true,
          },
          {
            model: db.projectImagesObj,
            as: "projectImages",
          },
        ],
      });

      return {
        total: count,
        page,
        per_page: limit,
        totalPages: Math.ceil(count / limit),
        leads: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
