require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const leadServices = require("../services/lead.services");
const addCustomer = require("../services/auth.services");
const activityServices = require("../services/activities.services");
const notesServices = require("../services/notes.services");
var bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator"); // Updated import
const authServices = require("../services/auth.services");
const config = require("../../../config/db.config");
var jwt = require("jsonwebtoken");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
module.exports = {
  /*getAllLeads*/
  async getAllLeads(req, res) {
    try {
      let {
        page = 1,
        length = 10,
        search,
        date,
        role_id,
        take_all,
      } = req.query;

      const userId = req.userId;
      const role = req.role;

      page = parseInt(page);
      length = parseInt(length);

      if (page <= 0 || length <= 0) {
        throw new Error("Page and length must be greater than 0");
      }

      let { leads, count } = await leadServices.getAllLeads(
        page,
        length,
        search,
        date,
        role_id,
        userId,
        role,
        take_all
      );

      let totalPages = Math.ceil(count / length);

      let response = {
        leads: leads,
        total: count,
        page,
        perPage: length,
        totalPages,
      };

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            response,
            "Leads displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /*add lead*/
  async addLead(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;

      let customerId = data.customerId || null;

      if (!customerId) {
        let existingUser = await addCustomer.getUserByEmail(data.email);

        if (existingUser) {
          return res.status(400).json({
            status: false,
            message: "Customer email already exists with us",
            data: { customerId: existingUser.id },
          });
        }

        let newUser = await addCustomer.register({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phone,
          role: "customer",
          password: bcrypt.hashSync("12345678", 10),
        });

        customerId = newUser.id;
      }

      let postData = {
        lattitude: data.lattitude,
        longitude: data.longitude,
        date: data.date,
        address: data.address,
        city: data.city,
        state: data.state,
        scope: data.scope,
        zip: data.zip,
        // firstName: data.firstName,
        customerAddress: data.customerAddress,
        // lastName: data.lastName,
        // email: data.email,
        leadsAge: data.leadsAge,
        // phone: data.phone,
        checkBoxAddress: data.checkBoxAddress,
        customerCity: data.customerCity,
        customerLongitude: data.customerLongitude,
        customerLatitude: data.customerLatitude,
        customerZip: data.customerZip,
        customerState: data.customerState,
        leadLocation: data.leadLocation,
        salesPerson: data.salesPerson || null,
        salesTeam: data.salesTeam || null,
        region: data.region || null,
        dateOfFirstContact: data.dateOfFirstContact || null,
        preferredContractor: data.preferredContractor || null,
        estimatedDealValue: data.estimatedDealValue || null,
        customerId: customerId,
      };

      const newLead = await leadServices.addLead(postData);
      const imageTypes = [
        { prefix: "diagramsImages[measures2DImage]", type: "measures2D" },
        { prefix: "diagramsImages[diagram2DImage]", type: "diagram2D" },
        { prefix: "diagramsImages[satelliteImage]", type: "satellite" },
        {
          prefix: "projectImages[projectLocationPhotos][side2OfProject]",
          type: "side2OfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][frontOfProject]",
          type: "frontOfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][side1OfProject]",
          type: "side1OfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][backOfProject]",
          type: "backOfProject",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][skyLights]",
          type: "skyLights",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][penetrations]",
          type: "penetrations",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][chimneys]",
          type: "chimneys",
        },
        { prefix: "projectImages[projectSpecialPhotos][eave]", type: "eave" },
        {
          prefix: "projectImages[projectSpecialPhotos][transitionsToSiding]",
          type: "transitionsToSiding",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][overheadElectric]",
          type: "overheadElectric",
        },
      ];

      for (const { prefix, type } of imageTypes) {
        const uploadedFiles = Object.keys(req.files)
          .filter((key) => key.startsWith(prefix))
          .flatMap((key) => req.files[key]);

        if (uploadedFiles.length) {
          const projectImagesData = uploadedFiles.map((file) => ({
            lead_id: newLead.id,
            user_id: req.userId,
            file: `files/${file.filename}`,
            file_name: file.originalname,
            image_type: type,
          }));

          await leadServices.projectImages(projectImagesData);
        }
      }

      // return res
      //   .status(200)
      //   .send(commonHelper.parseSuccessRespose("", "Lead added successfully"));
      return res.status(200).send({
        status: true,
        leadId: newLead.id,
        message: "Lead added successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Lead failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getLeadById*/
  async getLeadById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let leadId = req.query.leadId;
      let lead = await leadServices.getLeadById(leadId);
      if (!lead) throw new Error("Lead not found");
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(lead, "Lead displayed successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Fetching leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /*leadUpdate*/
  async leadUpdate(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body; // ✅ Define this first

      // Check if customerId exists
      let customerId = data.customerId || null;

      if (!customerId) {
        let existingUser = await addCustomer.getUserByEmail(data.email);

        if (existingUser) {
          return res.status(400).json({
            status: false,
            message: "Customer email already exists with us",
            data: { customerId: existingUser.id },
          });
        }

        let newUser = await addCustomer.register({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phone,
          role: "customer",
          password: bcrypt.hashSync("12345678", 10),
        });

        customerId = newUser.id;
      }
      let leadId = req.query.leadId;

      let lead = await leadServices.getLeadById(leadId);
      if (!lead) throw new Error("Lead not found");

      let postData = {
        lattitude: data.lattitude,
        longitude: data.longitude,
        date: data.date,
        address: data.address,
        city: data.city,
        state: data.state,
        scope: data.scope,
        zip: data.zip,
        firstName: data.firstName,
        customerAddress: data.customerAddress,
        lastName: data.lastName,
        email: data.email,
        leadsAge: data.leadsAge,
        phone: data.phone,
        checkBoxAddress: data.checkBoxAddress,
        customerCity: data.customerCity,
        customerLongitude: data.customerLongitude,
        customerLatitude: data.customerLatitude,
        customerZip: data.customerZip,
        customerState: data.customerState,
        leadLocation: data.leadLocation,

        salesPerson: data.salesPerson || null,
        salesTeam: data.salesTeam || null,
        region: data.region || null,
        dateOfFirstContact: data.dateOfFirstContact || null,
        preferredContractor: data.preferredContractor || null,
        estimatedDealValue: data.estimatedDealValue || null,
        customerId: data.customerId || null,
      };
      commonHelper.removeFalsyKeys(postData);

      /*addActivity*/
      let moduleName = "leadsObj";
      let id = leadId;
      postData = { ...postData, moduleName, id };
      let changes = await commonHelper.compareChanges(postData);
      if (changes.length != 0) {
        let newData = await commonHelper.transformChanges(
          changes,
          req.userId,
          leadId,
          moduleName
        );
        await leadServices.createActivity(newData);
      }

      let updateLead = await leadServices.leadUpdate(postData, leadId);

      if (req.body.deletedProjectImages) {
        let ids = req.body.deletedProjectImages;

        if (typeof ids === "string") {
          try {
            ids = JSON.parse(ids);
          } catch (e) {
            ids = [ids];
          }
        }

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        await db.projectImagesObj.destroy({
          where: { id: ids },
        });
      }
      // Define all image types with their formData key prefix and DB type
      const imageTypes = [
        // Diagrams Images
        { prefix: "diagramsImages[measures2DImage]", type: "measures2D" },
        { prefix: "diagramsImages[diagram2DImage]", type: "diagram2D" },
        { prefix: "diagramsImages[satelliteImage]", type: "satellite" },

        // Project Location Photos
        {
          prefix: "projectImages[projectLocationPhotos][side2OfProject]",
          type: "side2OfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][frontOfProject]",
          type: "frontOfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][side1OfProject]",
          type: "side1OfProject",
        },
        {
          prefix: "projectImages[projectLocationPhotos][backOfProject]",
          type: "backOfProject",
        },

        // Project Special Photos
        {
          prefix: "projectImages[projectSpecialPhotos][skyLights]",
          type: "skyLights",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][penetrations]",
          type: "penetrations",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][chimneys]",
          type: "chimneys",
        },
        { prefix: "projectImages[projectSpecialPhotos][eave]", type: "eave" },
        {
          prefix: "projectImages[projectSpecialPhotos][transitionsToSiding]",
          type: "transitionsToSiding",
        },
        {
          prefix: "projectImages[projectSpecialPhotos][overheadElectric]",
          type: "overheadElectric",
        },
      ];

      for (const { prefix, type } of imageTypes) {
        const uploadedFiles = Object.keys(req.files)
          .filter((key) => key.startsWith(prefix))
          .flatMap((key) => req.files[key]);

        if (uploadedFiles.length) {
          const projectImagesData = uploadedFiles.map((file) => ({
            lead_id: leadId,
            user_id: req.userId,
            file: `files/${file.filename}`,
            file_name: file.originalname,
            image_type: type, // saves type like 'measures2D', 'frontOfProject', etc.
          }));

          await leadServices.projectImages(projectImagesData);
        }
      }

      // const imageTypes = [
      //   { prefix: "projectImages", type: "projectImages" },
      //   { prefix: "measures2DImage", type: "measures2D" },
      //   { prefix: "diagram2DImage", type: "diagram2D" },
      //   { prefix: "satelliteImage", type: "satellite" },
      // ];

      // for (const { prefix, type } of imageTypes) {
      //   const uploadedFiles = Object.keys(req.files)
      //     .filter((key) => key.startsWith(prefix))
      //     .flatMap((key) => req.files[key]);

      //   if (uploadedFiles.length) {
      //     const projectImagesData = uploadedFiles.map((file) => ({
      //       lead_id: newLead.id,
      //       user_id: req.userId,
      //       file: `files/${file.filename}`,
      //       file_name: file.originalname,
      //       image_type: type,
      //     }));

      //     await leadServices.projectImages(projectImagesData);
      //   }
      // }
      // const uploadedFiles = Object.keys(req.files || {})
      //   .filter((key) => key.startsWith("projectImages"))
      //   .flatMap((key) => req.files[key]);

      // if (uploadedFiles.length) {
      //   const projectImagesData = uploadedFiles.map((file) => ({
      //     lead_id: leadId,
      //     user_id: req.userId,
      //     file: `files/${file.filename}`,
      //     file_name: file.originalname,
      //   }));

      //   await leadServices.projectImages(projectImagesData);
      // }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updateLead,
            "Lead Updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Lead Updated failed",
        data: error.response?.data || {},
      });
    }
  },

  /*leadDelete*/
  async leadDelete(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let leadId = req.query.leadId;
      let lead = await leadServices.getLeadById(leadId);
      if (!lead) throw new Error("Lead not found");
      let leadDelete = await leadServices.leadDelete(leadId);

      let data = {
        isDeleted: "deleted",
      };
      let module = "lead";
      await notesServices.updateNotes(data, leadId, module);
      await activityServices.updateActivity(data, leadId, module);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            leadDelete,
            "Lead deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /*addRoofMeasure*/
  async addRoofMeasure(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;
      let roofMeasure = await leadServices.roofMeasureExist(data.leadId);
      if (roofMeasure) throw new Error("You have already submitted");
      let lead = await leadServices.getLeadById(data.leadId);
      if (!lead) throw new Error("Lead not found");
      let postData = {
        leadId: data.leadId,
        roofArea: data.roofArea,
        predominantPitch: data.predominantPitch,
        ridges: data.ridges,
        hips: data.hips,
        valleys: data.valleys,
        rakes: data.rakes,
        eaves: data.eaves,
        bends: data.bends,
        wallFlash: data.wallFlash,
        step: data.step,
        dripEdge: data.dripEdge,
        starter: data.starter,
      };
      await leadServices.addRoofMeasure(postData);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Roof Measure added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Roof Measure added failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateRoofMeasure*/
  async updateRoofMeasure(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let roofMeasureId = req.query.roofMeasureId;
      let data = req.body;
      let postData = {
        leadId: data.leadId,
        roofArea: data.roofArea,
        predominantPitch: data.predominantPitch,
        ridges: data.ridges,
        hips: data.hips,
        valleys: data.valleys,
        rakes: data.rakes,
        eaves: data.eaves,
        bends: data.bends,
        wallFlash: data.wallFlash,
        step: data.step,
        dripEdge: data.dripEdge,
        starter: data.starter,
      };
      commonHelper.removeFalsyKeys(postData);
      let updateRoofMeasure = await leadServices.updateRoofMeasure(
        postData,
        roofMeasureId
      );
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updateRoofMeasure,
            "Roof Measure updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Roof Measure updated failed",
        data: error.response?.data || {},
      });
    }
  },

  /*roofMeasureList*/
  async roofMeasureList(req, res) {
    try {
      let { page, length } = req.query;
      if (page <= 0) {
        throw new Error("Page number must be greater than 0");
      }
      if (length <= 0) {
        throw new Error("Length number must be greater than 0");
      }
      let roofMeasureList = await leadServices.roofMeasureList(page, length);
      if (!roofMeasureList) {
        throw new Error("Roof Measure not found");
      }
      let roofMeasureTotal = await leadServices.roofMeasureTotal();
      let response = {
        roofMeasure: roofMeasureList,
        totalRoofMeasure: roofMeasureTotal.length,
      };
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            response,
            "Roof Measure displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Roof Measure failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getRoofMeasureByLeadId*/
  async getRoofMeasureByLeadId(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let roofMeasureId = req.query.roofMeasureId;
      let roofMeasure = await leadServices.roofMeasureExist(roofMeasureId);
      if (!roofMeasure) throw new Error("No record found");
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            roofMeasure,
            "Record displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Fetching roofMeasure failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllGenerateContractor*/
  async getAllGenerateContractor(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let { leadId, saleMaterialQuotesId, contractorId } = req.body;

      if (!leadId || !saleMaterialQuotesId || !contractorId) {
        return res.status(400).json({
          status: false,
          message:
            "leadId, saleMaterialQuotesId and contractor_id are required",
          data: {},
        });
      }

      let contractorData = await leadServices.getAllGenerateContractor({
        leadId,
        saleMaterialQuotesId,
        contractorId,
      });

      return res.status(200).json(contractorData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Generate Contractor failed",
        data: error.response?.data || {},
      });
    }
  },

  /* sendContractMail */
  async sendContractMail(req, res) {
    try {
      const datass = req.body;

      if (!datass.lead_id || !datass.status || !datass.custmoreEmail) {
        return res.status(400).send({
          status: false,
          message: "lead_id, custmoreEmail and status are required",
          data: {},
        });
      }

      // const data = await leadServices.sendContractMail(datass);

      // console.log('datadatadata',data)
      // if (!data) {
      //   return res.status(404).send({
      //     status: false,
      //     message: "lead not found for given lead_id and custmoreEmail",
      //     data: {},
      //   });
      // }

      // if (data.id === datass.lead_id && data.customer.email === datass.custmoreEmail) {
      //   const payload = { lead_id: data.id, email: data.email }; // define payload
      //   const secretKey = config.secret;
      //   const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
      //   const statusLink = `https://crm-rooftop.vercel.app/customer-proposal?id=${datass.lead_id}&token=${token}`;

      //   await commonHelper.sendContractMailToCustomer(data.email, statusLink);
      // }

      const lead = await leadServices.sendContractMail(datass);

      if (!lead) {
        return res.status(404).send({
          status: false,
          message: "Lead not found or custmoreEmail mismatch",
          data: {},
        });
      }

      // Generate token using lead + custmoreEmail
      const payload = { lead_id: lead.id, email: datass.custmoreEmail };
      const token = jwt.sign(payload, config.secret, { expiresIn: "1d" });

      const statusLink = `https://crm-rooftop.vercel.app/customer-proposal?id=${lead.id}&token=${token}`;

      // Send mail
      await commonHelper.sendContractMailToCustomer(
        datass.custmoreEmail,
        statusLink
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Contract email sent successfully."
          )
        );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to contract email sent",
        data: {},
      });
    }
  },

  /* acceptRejectStatusUpdate */
  async acceptRejectStatusUpdate(req, res) {
    try {
      const { leadId, status } = req.body;

      // Validate required fields
      if (!leadId || !status) {
        return res.status(400).json({
          status: false,
          message: "leadId and status are required",
          data: {},
        });
      }

      // Call service (pass params correctly)
      const updatedLead = await leadServices.acceptRejectStatusUpdate(
        leadId,
        status
      );

      if (!updatedLead) {
        return res.status(404).json({
          status: false,
          message: "Lead not found for the given leadId",
          data: {},
        });
      }

      return res
        .status(200)
        .json(
          commonHelper.parseSuccessRespose(
            updatedLead,
            "Lead status updated successfully."
          )
        );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to update lead status",
        data: {},
      });
    }
  },

  /* getAllCustomerQuote */
  async getAllCustomerQuote(req, res) {
    try {
      const leadId = req.query.leadId;

      if (!leadId) {
        return res.status(400).send({
          status: false,
          message: "ID is required",
          data: {},
        });
      }

      const data = await leadServices.getAllCustomerQuote(parseInt(leadId));

      if (!data) {
        return res.status(404).send({
          status: false,
          message: "Generated Contractor not found",
          data: {},
        });
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            data,
            "Generated Contractor fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Something went wrong",
        data: {},
      });
    }
  },

  /* getAllLeadBySales */
  async getAllLeadBySales(req, res) {
    try {
      let { page, per_page, limit, search, date } = req.query;

      // fallback: use per_page or limit, default = 10
      const perPage = parseInt(per_page) || parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;

      if (currentPage <= 0 || perPage <= 0) {
        throw new Error("Page and per_page/limit must be greater than 0");
      }

      // pass userId + role from JWT middleware
      let leadsData = await leadServices.getAllLeadBySales(
        currentPage,
        perPage,
        req.userId,
        req.role,
        search,
        date
      );

      if (!leadsData) throw new Error("Lead not found");

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            leadsData,
            "Leads displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /* validate */
  validate(method) {
    switch (method) {
      case "addLead": {
        return [
          check("firstName")
            .trim()
            .custom((value, { req }) => {
              if (!req.body.customerId && !value) {
                throw new Error("First Name is Required");
              }
              if (req.body.customerId && !value) {
                throw new Error("First Name is Required");
              }
              return true;
            }),

          check("email")
            .trim()
            .custom((value, { req }) => {
              if (!req.body.customerId && !value) {
                throw new Error("Email is Required");
              }
              if (req.body.customerId && !value) {
                throw new Error("Email is Required");
              }
              // Check if email already exists
              // const existingUser = authServices.getUserByEmail(value);
              // if (existingUser) {
              //   throw new Error("Email already exists");
              // }
              return true;
            }),

          // check("address").notEmpty().withMessage("Address is Required"),
        ];
      }
      case "getLeadById": {
        return [
          check("leadId").not().isEmpty().withMessage("LeadId is Required"),
        ];
      }
      case "updateRoofMeasure": {
        return [
          check("roofMeasureId")
            .not()
            .isEmpty()
            .withMessage("Roof Measure is Required"),
        ];
      }
      case "getRoofMeasureByLeadId": {
        return [
          check("roofMeasureId")
            .not()
            .isEmpty()
            .withMessage("Roof Measure is Required"),
        ];
      }
    }
  },
};
