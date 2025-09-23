var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addContract*/
  async addContract(postData) {
    try {
      let contract = await db.contractObj.create(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllContract*/
  async getAllContract(
    page,
    length,
    qualified,
    status,
    startDate,
    endDate,
    region
  ) {
    try {
      let whereCondition = {};
      if (status) {
        whereCondition.status = { [Op.like]: `%${status}%` };
      }
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        whereCondition.updatedAt = { [Op.between]: [start, end] };
      }
      if (region) {
        whereCondition.contractorRegion = { [Op.like]: `%${region}%` };
      }
      limit = length || 10;
      offset = (page - 1) * limit || 0;
      let contracts = await db.contractObj.findAll({
        where: {
          contractStatus: false,
          qualifiedContractors: qualified || "false",
          ...whereCondition,
        },
        offset,
        limit,
        order: [["id", "DESC"]],
        include: [
          {
            model: db.leadInteractionsObj,
            as: "interactions",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            // order: [["id", "DESC"]],
            required: false,
          },
        ],
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateContract*/
  async updateContract(data, contractId) {
    try {
      let contracts = await db.contractObj.update(data, {
        where: { id: contractId },
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getContract*/
  async getContract(contractId) {
    try {
      let contracts = await db.contractObj.findOne({
        where: { id: contractId },
        raw: true,
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteContract*/
  async deleteContract(contractId) {
    try {
      let contracts = await db.contractObj.destroy({
        where: { id: contractId },
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addBulkContracts*/
  async addBulkContracts(postData) {
    try {
      let contract = await db.contractObj.bulkCreate(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*totalContracts*/
  async totalContracts(qualified) {
    try {
      let contracts = await db.contractObj.findAll({
        where: {
          contractStatus: false,
          qualifiedContractors: qualified || "false",
        },
        raw: true,
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addContractRegion*/
  async addContractRegion(postData) {
    try {
      let contract = await db.contractRegionObj.create(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getContractRegions*/
  async getContractRegions() {
    try {
      let contractRegion = await db.contractRegionObj.findAll({
        order: [["id", "DESC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      return contractRegion;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*contractRegionById*/
  async contractRegionById(regionId) {
    try {
      let contractRegion = await db.contractRegionObj.findOne({
        where: { id: regionId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      return contractRegion;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*contractRegionUpdate*/
  async contractRegionUpdate(data, regionId) {
    try {
      let contractRegion = await db.contractRegionObj.update(data, {
        where: { id: regionId },
      });
      return contractRegion;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteContractRegion*/
  async deleteContractRegion(regionId) {
    try {
      let contractRegion = await db.contractRegionObj.destroy({
        where: { id: regionId },
      });
      return contractRegion;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getRegionByZipCode*/
  async getRegionByZipCode(zipCode) {
    try {
      let contractRegion = await db.contractRegionObj.findAll({
        where: {
          associateZipCode: {
            [Op.contains]: [zipCode],
          },
        },
        attributes: { exclude: ["associateZipCode", "createdAt", "updatedAt"] },
      });
      return contractRegion;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*parentContract*/
  async parentContract(parentContractId) {
    try {
      let contract = await db.contractObj.findOne({
        where: { id: parentContractId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*mergeContracts*/
  async mergeContracts(postData) {
    try {
      let contract = await db.mergeContractsObj.create(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addVerificationContract*/
  async addVerificationContract(postData) {
    try {
      let contract = await db.contractorVerificationObj.create(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getContractorVerification*/
  async getContractorVerification(contractorId) {
    try {
      let contracts = await db.contractorVerificationObj.findOne({
        where: { contractorId: contractorId },
        raw: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getDocument*/
  async getDocument(verificationId, contactorId) {
    try {
      let contracts = await db.contractorVerificationObj.findOne({
        where: {
          id: verificationId,
          contractorId: contactorId,
          isDeleted: null,
        },
        raw: true,
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateDocument*/
  async updateDocument(postData, contactorId, documentId) {
    try {
      let contracts = await db.contractorVerificationObj.update(postData, {
        where: { id: documentId, contractorId: contactorId },
        raw: true,
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getDocumentByContractId*/
  async getDocumentByContractId(contactorId) {
    try {
      let contracts = await db.contractorVerificationObj.findOne({
        where: { contractorId: contactorId },
        raw: true,
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateVerificationContract*/
  async updateVerificationContract(postData, contractorId) {
    try {
      let contract = await db.contractorVerificationObj.update(postData, {
        where: { contractorId: contractorId },
      });
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addLeadInteraction*/
  async addLeadInteraction(postData) {
    try {
      let contract = await db.leadInteractionsObj.create(postData);
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllLeadInteraction*/
  async getAllLeadInteraction(page, length) {
    try {
      limit = length || 10;
      offset = (page - 1) * limit || 0;
      let interactions = await db.leadInteractionsObj.findAll({
        limit,
        offset,
      });
      return interactions;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getContractById*/
  async getContractById(contractId) {
    try {
      let contracts = await db.contractObj.findOne({
        where: { id: contractId },
        include: [
          {
            model: db.leadInteractionsObj,
            as: "interactions",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            order: [["id", "DESC"]],
            required: false,
          },
        ],
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getLeadInteractionByContractId*/
  async getLeadInteractionByContractId(contractId) {
    try {
      let interaction = await db.leadInteractionsObj.findAll({
        where: { contractId: contractId },
        order: [["id", "DESC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return interaction;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getDuplicateContracts*/
  async getDuplicateContracts() {
    try {
      let contract = await db.contractObj.findAll({
        raw: true,
      });
      return contract;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateDuplicateContract*/
  async updateDuplicateContract(data, contractId) {
    try {
      let contracts = await db.contractObj.update(data, {
        where: { refId: contractId },
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateVerifiedDocument*/
  async updateVerifiedDocument(postData, contactorId) {
    try {
      let contracts = await db.contractorVerificationObj.update(postData, {
        where: { contractorId: contactorId },
      });
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getGenerateContractor(contractorId, page = 1, length = 10) {
    try {
      const limit = parseInt(length) || 10;
      const offset = (parseInt(page) - 1) * limit;
      const whereClause = contractorId ? { contractor_id: contractorId } : {};

      const { count, rows } = await db.generatedContractorsObj.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: db.leadsObj,
            as: "lead",
            include: [
              {
                model: db.userObj,
                as: "customer",
                attributes: ["id", "firstName", "lastName","email", "phoneNumber"],
              },
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
                ],
              },
            ],
          },
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
      });

      const result = rows.map((c) => ({
        id: c.id,
        status: c.status || "",
        roofProposal: {
          contractorInformation: {
            companyName: c.contractor?.contractorName || "",
            phone: c.contractor?.contractorPhone || "",
            address: c.contractor?.contractorAddress || "",
            datePrepared: "",
            cityState: `${c.contractor?.contractorCity || ""}, ${
              c.contractor?.contractorState || ""
            }`,
            preparedBy: "",
          },
          projectInformation: {
            customerId: c.lead?.customer?.id || "",
            propertyOwner: `${c.lead?.customer?.firstName || ""} ${
              c.lead?.customer?.lastName || ""
            }`,
            email: c.lead?.customer?.email || "",
            contactNumber: c.lead?.customer?.phoneNumber || "",
            roofType: "",
            projectAddress: c.lead?.address || "",
            license: "",
          },
          orderDetails: {
            products: (c.saleMaterialQuote?.items || []).map((i) => ({
              name: i.itemDetails?.sku || "",
              units: (i.itemDetails?.units || []).map((u) => ({
                quantity: u.qty || "",
                unit: u.um || "",
              })),
            })),
            summary: {
              subtotal: c.saleMaterialQuote?.material_total || 0,
              materialTax: c.saleMaterialQuote?.tax_amount || 0,
              other: c.saleMaterialQuote?.additional_total || 0,
              totalWithTax: c.saleMaterialQuote?.total || 0,
            },
          },
        },
      }));

      return {
        totalProposals: count,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        data: result,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getGenerateContractorById(id) {
    try {
      const contract = await db.generatedContractorsObj.findOne({
        where: { id },
        include: [
          {
            model: db.leadsObj,
            as: "lead",
            include: [
              { model: db.userObj, as: "customer",
                attributes: ["id", "firstName", "lastName","email", "phoneNumber"], 
              },
              { model: db.projectImagesObj, as: "projectImages" },
            ],
          },
          { model: db.contractObj, as: "contractor" },
          { model: db.notesObj, as: "notess" },
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
        status: contract.status || "",
        roofProposal: {
          contractorInformation: {
            companyName: contract.contractor?.contractorName || "",
            phone: contract.contractor?.contractorPhone || "",
            address: contract.contractor?.contractorAddress || "",
            contractNotes: contract.notess?.[0]?.description || "",
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

  // async getGenerateContractorById(id) {
  //     try {
  //         const contract = await db.generatedContractorsObj.findOne({
  //             where: { id },
  //             include: [
  //                 { model: db.leadsObj, as: "lead" },
  //                 { model: db.contractObj, as: "contractor" },
  //                 {
  //                     model: db.saleMaterialQuotesObj,
  //                     as: "saleMaterialQuote",
  //                     include: [
  //                         {
  //                             model: db.saleAdditionalQuotesitemObj,
  //                             as: "items",
  //                             include: [
  //                                 { model: db.itemObj, as: "itemDetails", include: [
  //                                     { model: db.itemUnitsObj, as: "units" }
  //                                 ]}
  //                             ]
  //                         }
  //                     ]
  //                 },
  //             ],
  //         });

  //         if (!contract) return null;

  //         const products = contract.saleMaterialQuote?.items?.map(item => ({
  //             name: item.itemDetails?.sku || "",
  //             units: (item.itemDetails?.units || []).map(u => ({
  //                 quantity: u.qty || "",
  //                 unit: u.um || ""
  //             }))
  //         })) || [];

  //         return {
  //             id: contract.id,
  //             status: contract.status || "",
  //             roofProposal: {
  //                 contractorInformation: {
  //                     companyName: contract.contractor?.contractorName || "",
  //                     phone: contract.contractor?.contractorPhone || "",
  //                     address: contract.contractor?.contractorAddress || "",
  //                     datePrepared: "",
  //                     cityState: `${contract.contractor?.contractorCity || ""}, ${contract.contractor?.contractorState || ""}`,
  //                     preparedBy: "",
  //                 },
  //                 projectInformation: {
  //                     propertyOwner: `${contract.lead?.firstName || ""} ${contract.lead?.lastName || ""}`,
  //                     email: contract.lead?.email || "",
  //                     contactNumber: contract.lead?.phone || "",
  //                     roofType: "",
  //                     projectAddress: contract.lead?.address || "",
  //                     license: "",
  //                 },
  //                 orderDetails: {
  //                     products,
  //                     summary: {
  //                         subtotal: contract.saleMaterialQuote?.material_total || 0,
  //                         materialTax: contract.saleMaterialQuote?.tax_amount || 0,
  //                         other: contract.saleMaterialQuote?.additional_total || 0,
  //                         totalWithTax: contract.saleMaterialQuote?.total || 0,
  //                     },
  //                 },
  //             },
  //         };
  //     } catch (e) {
  //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //         throw e;
  //     }
  // },

  async updateGenerateContractorStatus(id, status) {
    try {
      let contracts = await db.generatedContractorsObj.update(
        { status: status },
        { where: { id: id } }
      );
      return contracts;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateCustomerSignature(customerId, filePath) {
    try {
      const customer = await db.userObj.findOne({
        where: { id: customerId, role: "customer" },
      });

      if (!customer) {
        return null;
      }

      await db.userObj.update(
        { customerSignature: filePath },
        { where: { id: customerId, role: "customer" } }
      );

      const updatedCustomer = await db.userObj.findOne({
        where: { id: customerId, role: "customer" },
        attributes: ["id", "customerSignature"],
      });

      return updatedCustomer;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // async updateContractNotes(contractId, notes) {
  //   try {
  //     await db.notesObj.upsert(
  //       { notes: notes },
  //       { where: { id: contractId } }
  //     );

  //     const contract = await db.contractObj.findOne({
  //       where: { id: contractId },
  //       attributes: ["id", "notes"]
  //     });

  //     return contract;
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async updateContractNotes(contractId, notes, userId) {
    try {
      const note = await db.notesObj.create({
        userId: userId,
        moduleName: "contract",
        moduleId: contractId,
        description: notes,
      });

      const updatedNote = await db.notesObj.findOne({
        where: { moduleId: contractId, moduleName: "contract" },
        order: [["createdAt", "DESC"]],
      });

      return updatedNote;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
