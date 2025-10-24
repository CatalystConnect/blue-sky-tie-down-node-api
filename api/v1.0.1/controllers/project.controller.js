require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const projectServices = require("../services/project.services");
const leadServices = require("../services/lead.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
const {
  uploadFileToDrive,
  getOrCreateSubfolder,
} = require("../helper/googleDrive");
const path = require("path");
const fs = require("fs");

module.exports = {
  /*addProject*/
  // async addProject(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }
  //     let data = req.body;

  //     let completedFiles = [];
  //     if (req.files) {
  //       Object.keys(req.files).forEach((key) => {
  //         req.files[key].forEach((file) => {
  //           completedFiles.push({
  //             fileName: file.originalname,
  //             path: `files/${file.filename}`,
  //             size: file.size,
  //           });
  //         });
  //       });
  //     }

  //     completedFiles = JSON.stringify(completedFiles);

  //     const sanitizeInteger = (value) => {
  //       if (value === "" || value === null || value === undefined) return null;
  //       return Number(value);
  //     };

  //     const sanitizeDate = (value) => {
  //       if (!value) return null;
  //       const date = new Date(value);
  //       return isNaN(date.getTime()) ? null : date;
  //     };

  //     let postData = {
  //       user_id: req.userId,
  //       engineer_id: sanitizeInteger(data.engineer_id),
  //       name: data.name || null,
  //       city: data.city || null,
  //       state: sanitizeInteger(data.state) || null,
  //       bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
  //       address: data.address || null,
  //       zip: sanitizeInteger(data.zip),
  //       units: sanitizeInteger(data.units),
  //       projectType: data.projectType || null,
  //       project_phase: data.project_phase || null,
  //       bldgs: sanitizeInteger(data.bldgs),
  //       wind_zone: data.wind_zone || null,
  //       seismic_zone: data.seismic_zone || null,
  //       developer_id: sanitizeInteger(data.developer_id),
  //       general_contractor_id: sanitizeInteger(data.general_contractor_id),
  //       assign_to_budget: sanitizeInteger(data.assign_to_budget),
  //       take_off_team_id: sanitizeInteger(data.take_off_team_id),
  //       take_off_type: data.take_off_type || null,
  //       project_tags: data.project_tags || null,
  //       take_off_scope: data.take_off_scope || null,
  //       assign_date: sanitizeDate(data.assign_date), // returns null if invalid
  //       project_tags: data.project_tags || null,
  //       projectFiles: data.projectFiles || null,
  //       architecture: sanitizeInteger(data.architecture) || null,
  //       takeoffactualtime: sanitizeInteger(data.takeoffactualtime) || null,
  //       dueDate: sanitizeDate(data.dueDate),
  //       projectAttachmentUrls: data.projectAttachmentUrls || null,
  //       attachmentsLink: data.attachmentsLink || null,
  //       projectRifFields: data.projectRifFields || null,
  //       status: "new",
  //       takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
  //       connectplan: data.connectplan || null,
  //       surveyorNotes: data.surveyorNotes || null,
  //       completedFiles: completedFiles || null,
  //       takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime) || null,
  //       project_status: data.project_status || "active",
  //       takeoff_status: data.takeoff_status || null,
  //     };

  //     let project = await projectServices.addProject(postData);

  //     if (data.planSets && typeof data.planSets === "string") {
  //       data.planSets = JSON.parse(data.planSets);
  //     }

  //     if (data.planSets && Array.isArray(data.planSets)) {
  //       for (let plan of data.planSets) {
  //         let planData = {
  //           project_id: project.id,
  //           submissionType: plan.submissionType || null,
  //           date_received: sanitizeDate(plan.date_received),
  //           plan_link: plan.plan_link || null,
  //           planType: plan.planType || null,
  //           planFiles: plan.planFiles || null,
  //           plan_date: sanitizeDate(plan.plan_date),
  //           rev_status: plan.rev_status || null,
  //           plan_reviewed_date: sanitizeDate(plan.plan_reviewed_date),
  //           plan_reviewed_by: sanitizeInteger(plan.plan_reviewed_by) || null,
  //           data_collocated_date: sanitizeDate(plan.data_collocated_date),
  //           plan_revision_notes: plan.plan_revision_notes || null,
  //         };

  //         await projectServices.projectplanSets(planData);
  //       }
  //     }

  //     // const planSets = Array.isArray(data.planSets)
  //     //   ? data.planSets
  //     //   : JSON.parse(data.planSets || "[]");

  //     // for (let index = 0; index < planSets.length; index++) {
  //     //   const plan = planSets[index];
  //     //   // let uploadedFiles = [];

  //     //   // const planFiles = req.files.filter(
  //     //   //   f => f.fieldname === `planSets[${index}][planFiles]`
  //     //   // );

  //     //   // for (let file of planFiles) {
  //     //   //   const driveFile = await uploadFileToDrive(
  //     //   //     file.path,
  //     //   //     file.originalname,
  //     //   //     file.mimetype,
  //     //   //     ["projectFiles", "Plan Files"]
  //     //   //   );

  //     //   //   uploadedFiles.push({
  //     //   //     name: file.originalname,
  //     //   //     link: driveFile.webViewLink,
  //     //   //   });
  //     //   // }

  //     //   const planData = {
  //     //     project_id: project.id,
  //     //     submissionType: plan.submissionType || null,
  //     //     date_received: sanitizeDate(plan.date_received),
  //     //     plan_link: plan.plan_link || null,
  //     //     planType: plan.planType || null,
  //     //     planFiles:  null,
  //     //     plan_date: sanitizeDate(plan.plan_date),
  //     //     rev_status: plan.rev_status || null,
  //     //     plan_reviewed_date: sanitizeDate(plan.plan_reviewed_date),
  //     //     plan_reviewed_by: sanitizeInteger(plan.plan_reviewed_by),
  //     //     data_collocated_date: sanitizeDate(plan.data_collocated_date),
  //     //     plan_revision_notes: plan.plan_revision_notes || null,
  //     //   };

  //     //   await projectServices.projectplanSets(planData);
  //     // }
  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose("", "Project added successfully")
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error || error.message || "Project failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  /*getAllProject*/
  // async addProject(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     const data = req.body;

  //     let completedFiles = [];
  //     if (Array.isArray(req.files)) {
  //       const completedFileUploads = req.files.filter(f =>
  //         f.fieldname.startsWith("completedFiles")
  //       );

  //       for (let file of completedFileUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles", "Completed Files"]
  //         );

  //         completedFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }
  //     }
  //     completedFiles = JSON.stringify(completedFiles);

  //     let projectFiles = [];
  //     if (Array.isArray(req.files)) {
  //       const projectFilesUploads = req.files.filter(f =>
  //         f.fieldname.startsWith("projectFiles")
  //       );

  //       for (let file of projectFilesUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles"]
  //         );

  //         projectFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }
  //     }
  //     projectFiles = JSON.stringify(projectFiles);

  //     const sanitizeInteger = value => {
  //       if (value === "" || value === null || value === undefined) return null;
  //       return Number(value);
  //     };

  //     const sanitizeDate = value => {
  //       if (!value) return null;
  //       const date = new Date(value);
  //       return isNaN(date.getTime()) ? null : date;
  //     };

  //     const postData = {
  //       user_id: req.userId,
  //       engineer_id: sanitizeInteger(data.engineer_id),
  //       name: data.name || null,
  //       city: data.city || null,
  //       state: sanitizeInteger(data.state) || null,
  //       bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
  //       address: data.address || null,
  //       zip: sanitizeInteger(data.zip),
  //       units: sanitizeInteger(data.units),
  //       projectType: data.projectType || null,
  //       project_phase: data.project_phase || null,
  //       bldgs: sanitizeInteger(data.bldgs),
  //       wind_zone: data.wind_zone || null,
  //       seismic_zone: data.seismic_zone || null,
  //       developer_id: sanitizeInteger(data.developer_id),
  //       general_contractor_id: sanitizeInteger(data.general_contractor_id),
  //       assign_to_budget: sanitizeInteger(data.assign_to_budget),
  //       take_off_team_id: sanitizeInteger(data.take_off_team_id),
  //       take_off_type: data.take_off_type || null,
  //       take_off_scope: data.take_off_scope || null,
  //       assign_date: sanitizeDate(data.assign_date),
  //       // project_tags: sanitizeInteger(data.project_tags) || null,
  //       project_file: projectFiles || null,
  //       architecture: sanitizeInteger(data.architecture) || null,
  //       takeoffactualtime: sanitizeInteger(data.takeoffactualtime) || null,
  //       dueDate: sanitizeDate(data.dueDate),
  //       projectAttachmentUrls: data.projectAttachmentUrls || null,
  //       attachmentsLink: data.attachmentsLink || null,
  //       projectRifFields: data.projectRifFields || null,
  //       status: "new",
  //       takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
  //       connectplan: data.connectplan || null,
  //       surveyorNotes: data.surveyorNotes || null,
  //       completedFiles: completedFiles || null,
  //       takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime) || null,
  //       takeoffDueDate: data.takeoffDueDate || null,
  //       takeoffStartDate: data.takeoffStartDate || null,
  //       project_status: data.project_status || "active",
  //       takeoff_status: data.takeoff_status || null,
  //     };

  //     const project = await projectServices.addProject(postData);

  //     if (data.project_tags) {

  //       const tagIds = Array.isArray(data.project_tags)
  //         ? data.project_tags
  //         : String(data.project_tags).split(",").map(id => parseInt(id));

  //       await projectServices.addProjectTags(project.id, tagIds);
  //     }

  //     const planSets = Array.isArray(data.planSets)
  //       ? data.planSets
  //       : JSON.parse(data.planSets || "[]");

  //     for (let index = 0; index < planSets.length; index++) {
  //       const plan = planSets[index];
  //       let uploadedFiles = [];

  //       const planFiles = req.files.filter(
  //         f => f.fieldname === `planSets[${index}][planFiles]`
  //       );

  //       for (let file of planFiles) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles", "Plan Files"]
  //         );

  //         uploadedFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //         });
  //       }

  //       const planData = {
  //         project_id: project.id,
  //         submissionType: plan.submissionType || null,
  //         date_received: sanitizeDate(plan.date_received),
  //         plan_link: plan.plan_link || null,
  //         planType: plan.planType || null,
  //         planFiles: JSON.stringify(uploadedFiles),
  //         plan_date: sanitizeDate(plan.plan_date),
  //         rev_status: plan.rev_status || null,
  //         plan_reviewed_date: sanitizeDate(plan.plan_reviewed_date),
  //         plan_reviewed_by: sanitizeInteger(plan.plan_reviewed_by),
  //         data_collocated_date: sanitizeDate(plan.data_collocated_date),
  //         plan_revision_notes: plan.plan_revision_notes || null,
  //       };

  //       await projectServices.projectplanSets(planData);
  //     }

  //     return res
  //       .status(200)
  //       .send(commonHelper.parseSuccessRespose("", "Project added successfully"));
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error || error.message || "Project failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

  async addProject(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const data = req.body;

      // --- Sanitize helpers ---
      const sanitizeInteger = (value) => (value ? Number(value) : null);
      const sanitizeDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      };

      // --- Step 1: Add project to DB ---
      const postData = {
        user_id: req.userId,
        engineer_id: sanitizeInteger(data.engineer_id),
        name: data.name || null,
        city: data.city || null,
        state: sanitizeInteger(data.state),
        bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
        address: data.address || null,
        zip: sanitizeInteger(data.zip),
        units: sanitizeInteger(data.units),
        projectType: data.projectType || null,
        project_phase: data.project_phase || null,
        bldgs: sanitizeInteger(data.bldgs),
        wind_zone: data.wind_zone || null,
        seismic_zone: data.seismic_zone || null,
        developer_id: sanitizeInteger(data.developer_id),
        general_contractor_id: sanitizeInteger(data.general_contractor_id),
        assign_to_budget: sanitizeInteger(data.assign_to_budget),
        take_off_team_id: sanitizeInteger(data.take_off_team_id),
        take_off_type: data.take_off_type || null,
        take_off_scope: data.take_off_scope || null,
        assign_date: sanitizeDate(data.assign_date),
        architecture: sanitizeInteger(data.architecture),
        takeoffactualtime: sanitizeInteger(data.takeoffactualtime),
        dueDate: sanitizeDate(data.dueDate),
        status: "new",
        takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
        connectplan: data.connectplan || null,
        surveyorNotes: data.surveyorNotes || null,
        takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime),
        takeoffDueDate: sanitizeDate(data.takeoffDueDate),
        takeoffStartDate: sanitizeDate(data.takeoffStartDate),
        project_status: data.project_status || "active",
        takeoff_status: data.takeoff_status || null,
        work_hours: data.work_hours || null,
      };

      const project = await projectServices.addProject(postData);

      // --- Step 2: Create Project root folder ---
      const rootFolder = await getOrCreateSubfolder(
        process.env.GOOGLE_DRIVE_FOLDER_ID,
        `${project.id}. ${project.name}`
      );

      // --- Step 3: Create subfolders ---
      const projectFilesFolder = await getOrCreateSubfolder(
        rootFolder,
        "projectFiles"
      );
      const planSetsFolder = await getOrCreateSubfolder(rootFolder, "PlanSets");
      const completedFolder = await getOrCreateSubfolder(
        rootFolder,
        "CompletedFiles"
      );
      // const leadFilesFolder = await getOrCreateSubfolder(
      //   rootFolder,
      //   "Lead Files"
      // );

      // --- Step 4: Save folders in gDriveAssociation ---
      const saveFolder = async (module, module_id, drive_id, file_name) =>
        await projectServices.addDriveAssociation({
          parent: project.id,
          module,
          module_id,
          drive_id,
          file_name,
        });

      // await saveFolder("projectFiles", project.id, projectFilesFolder);
      // await saveFolder("completedFiles", project.id, completedFolder);
      // await saveFolder("planSets", project.id, planSetsFolder);
      // await saveFolder("leadFiles", project.id, leadFilesFolder);

      // --- Step 5: Upload Project Files ---
      let projectFiles = [];
      if (Array.isArray(req.files)) {
        const projectUploads = req.files.filter((f) =>
          f.fieldname.startsWith("projectFiles")
        );

        for (let file of projectUploads) {
          const driveFile = await uploadFileToDrive(
            file.path,
            file.originalname,
            file.mimetype,
            projectFilesFolder
          );
          projectFiles.push({
            name: file.originalname,
            link: driveFile.webViewLink,
            size: file.size,
          });

          await saveFolder(
            "projectFiles",
            project.id,
            driveFile.id,
            file.originalname
          );
        }
      }

      if (projectFiles.length > 0) {
        const updateData = { project_file: JSON.stringify(projectFiles) };
        const updateResult = await projectServices.updateProject(
          updateData,
          project.id
        );
      } else {
        console.log("No completed files found to update.");
      }

      // --- Step 6: Upload Completed Files ---
      let completedFiles = [];
      if (Array.isArray(req.files)) {
        const completedUploads = req.files.filter((f) =>
          f.fieldname.startsWith("completedFiles")
        );
        for (let file of completedUploads) {
          const driveFile = await uploadFileToDrive(
            file.path,
            file.originalname,
            file.mimetype,
            completedFolder
          );
          completedFiles.push({
            name: file.originalname,
            link: driveFile.webViewLink,
            size: file.size,
          });
          await saveFolder(
            "completedFiles",
            project.id,
            driveFile.id,
            file.originalname
          );
        }
      }

      if (completedFiles.length > 0) {
        const updateData = { completedFiles: JSON.stringify(completedFiles) };
        const updateResult = await projectServices.updateProject(
          updateData,
          project.id
        );
      } else {
        console.log("No completed files found to update.");
      }

      // --- Step 7: Upload Plan Sets ---
      const planSets = Array.isArray(data.planSets)
        ? data.planSets
        : JSON.parse(data.planSets || "[]");
      for (let index = 0; index < planSets.length; index++) {
        const plan = planSets[index];
        const planSetFolder = await getOrCreateSubfolder(
          planSetsFolder,
          `${index + 1}`
        );
        await saveFolder("planSetFiles", index + 1, planSetFolder);

        const planFiles = req.files.filter(
          (f) => f.fieldname === `planSets[${index}][planFiles]`
        );
        let uploadedFiles = [];
        for (let file of planFiles) {
          const driveFile = await uploadFileToDrive(
            file.path,
            file.originalname,
            file.mimetype,
            planSetFolder
          );
          uploadedFiles.push({
            name: file.originalname,
            link: driveFile.webViewLink,
          });
          await saveFolder("planSetFiles", index + 1, driveFile.id);
        }

        const planData = {
          project_id: project.id,
          submissionType: plan.submissionType || null,
          date_received: sanitizeDate(plan.date_received),
          plan_link: plan.plan_link || null,
          planType: plan.planType || null,
          planFiles: null,
          plan_date: sanitizeDate(plan.plan_date),
          rev_status: plan.rev_status || null,
          plan_reviewed_date: sanitizeDate(plan.plan_reviewed_date),
          plan_reviewed_by: sanitizeInteger(plan.plan_reviewed_by),
          data_collocated_date: sanitizeDate(plan.data_collocated_date),
          plan_revision_notes: plan.plan_revision_notes || null,
        };
        // await projectServices.projectplanSets(planData);

        const createdPlan = await projectServices.projectplanSets(planData);

        // const planSetFolder = await getOrCreateSubfolder(
        //   planSetsFolder,
        //   `${createdPlan.id}` // use DB ID
        // );

        // const planFiles = req.files.filter(
        //   (f) => f.fieldname === `planSets[${index}][planFiles]`
        // );

        // let uploadedFiles = [];
        // for (let file of planFiles) {
        //   const driveFile = await uploadFileToDrive(
        //     file.path,
        //     file.originalname,
        //     file.mimetype,
        //     planSetFolder
        //   );
        //   uploadedFiles.push({
        //     name: file.originalname,
        //     link: driveFile.webViewLink,
        //   });
        //   await saveFolder(
        //     "planSetFiles",
        //     createdPlan.id,
        //     driveFile.id,
        //     file.originalname
        //   );
        // }

        // --- Step 4: Update planFiles field in DB ---
        await projectServices.updatePlanFiles(
          createdPlan.id,
          JSON.stringify(uploadedFiles)
        );
      }

      // --- Step 8: Handle project tags ---
      if (data.project_tags) {
        const tagIds = Array.isArray(data.project_tags)
          ? data.project_tags
          : String(data.project_tags)
              .split(",")
              .map((id) => parseInt(id));
        await projectServices.addProjectTags(project.id, tagIds);
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Project added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Project failed",
        data: error.response?.data || {},
      });
    }
  },
  async getAllProject(req, res) {
    try {
      let { page, per_page, search } = req.query;
      if (page <= 0 || per_page <= 0) {
        throw new Error("Page and length must be greater than 0");
      }
      let getAllProject = await projectServices.getAllProject(
        page,
        per_page,
        search
      );
      if (!getAllProject) throw new Error("Projects not found");
      return res.status(200).send({
        status: true,
        message: " Get all Projects",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting projects failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getProjectById*/
  async getProjectById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            getProjectById,
            "Project displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting project failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*updateProject*/

  //   async getProjectById(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     const projectId = req.query.projectId;
  //     let project = await projectServices.getProjectById(projectId);

  //     if (!project) throw new Error("Project not found");

  //     // ✅ Convert project_file links
  //     if (project.project_file) {
  //       try {
  //         const parsedFiles = JSON.parse(project.project_file);
  //         project.project_file = parsedFiles.map((file) => {
  //           let fileIdMatch = file.link?.match(/\/d\/(.*?)\//);
  //           let fileId = fileIdMatch ? fileIdMatch[1] : null;

  //           if (fileId) {
  //             file.link = `https://drive.google.com/uc?export=view&id=${fileId}`;
  //           }
  //           return file;
  //         });
  //       } catch (e) {
  //         project.project_file = [];
  //       }
  //     }

  //     // ✅ Same conversion for projectFiles if needed
  //     if (project.projectFiles) {
  //       try {
  //         const parsedFiles = JSON.parse(project.projectFiles);
  //         project.projectFiles = parsedFiles.map((file) => {
  //           let fileIdMatch = file.link?.match(/\/d\/(.*?)\//);
  //           let fileId = fileIdMatch ? fileIdMatch[1] : null;

  //           if (fileId) {
  //             file.link = `https://drive.google.com/uc?export=view&id=${fileId}`;
  //           }
  //           return file;
  //         });
  //       } catch (e) {
  //         project.projectFiles = [];
  //       }
  //     }

  //     return res.status(200).send(
  //       commonHelper.parseSuccessRespose(project, "Project displayed successfully")
  //     );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Getting project failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

  // async updateProject(req, res) {
  //   try {
  //     // const errors = myValidationResult(req);
  //     // if (!errors.isEmpty()) {
  //     //     return res
  //     //         .status(200)
  //     //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     // }
  //     let projectId = req.query.projectId;
  //     let getProjectById = await projectServices.getProjectById(projectId);

  //     if (!getProjectById) throw new Error("Project not found");
  //     let data = req.body;
  //     // let completedFiles = [];
  //     // if (req.files) {
  //     //   Object.keys(req.files).forEach((key) => {
  //     //     req.files[key].forEach((file) => {
  //     //       completedFiles.push({
  //     //         fileName: file.originalname,
  //     //         path: `files/${file.filename}`,
  //     //         size: file.size,
  //     //       });
  //     //     });
  //     //   });
  //     // }

  //     // completedFiles = JSON.stringify(completedFiles);
  //     let completedFiles = [];
  //     if (Array.isArray(req.files)) {
  //       const completedFileUploads = req.files.filter(f =>
  //         f.fieldname.startsWith("completedFiles")
  //       );

  //       for (let file of completedFileUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles", "Completed Files"]
  //         );

  //         completedFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }
  //     }
  //     completedFiles = JSON.stringify(completedFiles);

  //     let projectFiles = [];
  //     if (Array.isArray(req.files)) {
  //       const projectFilesUploads = req.files.filter(f =>
  //         f.fieldname.startsWith("projectFiles")
  //       );

  //       for (let file of projectFilesUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles"]
  //         );

  //         projectFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }
  //     }
  //     projectFiles = JSON.stringify(projectFiles);

  //     const sanitizeInteger = (value) => {
  //       if (value === "" || value === null || value === undefined) return null;
  //       return Number(value);
  //     };
  //     const sanitizeDate = (value) => {
  //       if (!value) return null;
  //       const date = new Date(value);
  //       return isNaN(date.getTime()) ? null : date;
  //     };

  //     let postData = {
  //       user_id: req.userId,
  //       engineer_id: sanitizeInteger(data.engineer_id),
  //       name: data.name || null,
  //       city: data.city || null,
  //       state: sanitizeInteger(data.state) || null,
  //       bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
  //       address: data.address || null,
  //       zip: sanitizeInteger(data.zip),
  //       units: sanitizeInteger(data.units),
  //       projectType: data.projectType || null,
  //       project_phase: data.project_phase || null,
  //       bldgs: sanitizeInteger(data.bldgs),
  //       wind_zone: data.wind_zone || null,
  //       seismic_zone: data.seismic_zone || null,
  //       developer_id: sanitizeInteger(data.developer_id),
  //       general_contractor_id: sanitizeInteger(data.general_contractor_id),
  //       assign_to_budget: sanitizeInteger(data.assign_to_budget),
  //       take_off_team_id: sanitizeInteger(data.take_off_team_id),
  //       take_off_type: data.take_off_type || null,
  //       take_off_scope: data.take_off_scope || null,
  //       takeoffDueDate: sanitizeDate(data.takeoffDueDate) || null,
  //       takeoffStartDate: sanitizeDate(data.takeoffStartDate) || null,
  //       assign_date: sanitizeDate(data.assign_date), // returns null if invalid
  //       // project_tags: sanitizeInteger(data.project_tags) || null,
  //       // project_tags: data.project_tags || null,
  //       projectFiles: projectFiles || null,
  //       architecture: sanitizeInteger(data.architecture) || null,
  //       takeoffactualtime: sanitizeInteger(data.takeoffactualtime) || null,
  //       dueDate: sanitizeDate(data.dueDate),
  //       projectAttachmentUrls: data.projectAttachmentUrls || null,
  //       attachmentsLink: data.attachmentsLink || null,
  //       projectRifFields: data.projectRifFields || null,
  //       status: "new",
  //       takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
  //       connectplan: data.connectplan || null,
  //       surveyorNotes: data.surveyorNotes || null,
  //       completedFiles: completedFiles || null,
  //       takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime) || null,
  //       project_status: data.project_status || "active",
  //       takeoff_status: data.takeoff_status || null,
  //       work_hours: data.work_hours || null,
  //     };
  //     commonHelper.removeFalsyKeys(postData);

  //     if (data.project_tags) {
  //       const tagIds = Array.isArray(data.project_tags)
  //         ? data.project_tags
  //         : String(data.project_tags).split(",").map(id => parseInt(id));

  //       await projectServices.removeProjectTags(projectId);

  //       await projectServices.addProjectTags(projectId, tagIds);
  //     }

  //     let updateProject = await projectServices.updateProject(
  //       postData,
  //       projectId
  //     );

  //     await db.projectplanSetsObj.destroy({
  //       where: { project_id: projectId },
  //     });
  //     if (data.planSets && typeof data.planSets === "string") {
  //       data.planSets = JSON.parse(data.planSets);
  //     }

  //     if (data.planSets && Array.isArray(data.planSets)) {
  //       for (let plan of data.planSets) {
  //         let planData = {
  //           project_id: projectId,
  //           submissionType: plan.submissionType || null,
  //           date_received: sanitizeDate(plan.date_received),
  //           plan_link: plan.plan_link || null,
  //           planFiles: plan.planFiles || null,
  //           plan_date: sanitizeDate(plan.plan_date),
  //           rev_status: plan.rev_status || null,
  //           plan_reviewed_date: sanitizeDate(plan.plan_reviewed_date),
  //           plan_reviewed_by: sanitizeInteger(plan.plan_reviewed_by) || null,
  //           data_collocated_date: sanitizeDate(plan.data_collocated_date),
  //           plan_revision_notes: plan.plan_revision_notes || null,
  //         };

  //         await projectServices.projectplanSets(planData);
  //       }
  //     }
  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           updateProject,
  //           "Project updated successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Project updation failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

  // async updateProject(req, res) {
  //   try {
  //     const projectId = req.query.projectId;
  //     const getProjectById = await projectServices.getProjectById(projectId);
  //     if (!getProjectById) throw new Error("Project not found");

  //     const data = req.body;

  //     // 🔹 Helper: delete from Google Drive
  //     const deleteFilesFromDrive = async (fileLinks = []) => {
  //       for (const link of fileLinks) {
  //         try {
  //           const match = link.match(/\/d\/([^/]+)\//);
  //           if (match && match[1]) {
  //             const fileId = match[1];
  //             await drive.files.delete({ fileId, supportsAllDrives: true });
  //             console.log(`Deleted from Drive: ${fileId}`);
  //           }
  //         } catch (err) {
  //           console.error(`Drive deletion failed for: ${link}`, err.message);
  //         }
  //       }
  //     };

  //     // 🔹 Parse deleted files arrays
  //     const deletedCompletedFiles =
  //       typeof data.deletedCompletedFiles === "string"
  //         ? JSON.parse(data.deletedCompletedFiles || "[]")
  //         : data.deletedCompletedFiles || [];

  //     const deletedProjectFiles =
  //       typeof data.deletedProjectFiles === "string"
  //         ? JSON.parse(data.deletedProjectFiles || "[]")
  //         : data.deletedProjectFiles || [];

  //     // 🔹 Delete files from Drive
  //     if (deletedCompletedFiles.length)
  //       await deleteFilesFromDrive(deletedCompletedFiles);
  //     if (deletedProjectFiles.length)
  //       await deleteFilesFromDrive(deletedProjectFiles);

  //     // 🔹 Parse existing DB JSON
  //     let existingCompleted = [];
  //     let existingProject = [];

  //     try {
  //       existingCompleted = JSON.parse(getProjectById.completedFiles || "[]");
  //     } catch {
  //       existingCompleted = [];
  //     }

  //     try {
  //       existingProject = JSON.parse(getProjectById.project_file || "[]");
  //     } catch {
  //       existingProject = [];
  //     }

  //     // 🔹 Remove deleted entries from existing arrays
  //     if (deletedCompletedFiles.length) {
  //       existingCompleted = existingCompleted.filter(
  //         (file) => !deletedCompletedFiles.includes(file.link)
  //       );
  //     }
  //     if (deletedProjectFiles.length) {
  //       existingProject = existingProject.filter(
  //         (file) => !deletedProjectFiles.includes(file.link)
  //       );
  //     }

  //     // 🔹 Handle uploads
  //     let completedFiles = [];
  //     let projectFiles = [];

  //     if (Array.isArray(req.files)) {
  //       // Completed Files
  //       const completedUploads = req.files.filter((f) =>
  //         f.fieldname.startsWith("completedFiles")
  //       );
  //       for (const file of completedUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles", "Completed Files"]
  //         );
  //         completedFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }

  //       // Project Files
  //       const projectUploads = req.files.filter((f) =>
  //         f.fieldname.startsWith("projectFiles")
  //       );
  //       console.log("📂 projectUploads:", projectUploads.length);
  //       for (const file of projectUploads) {
  //         const driveFile = await uploadFileToDrive(
  //           file.path,
  //           file.originalname,
  //           file.mimetype,
  //           ["projectFiles"]
  //         );
  //         projectFiles.push({
  //           name: file.originalname,
  //           link: driveFile.webViewLink,
  //           size: file.size,
  //         });
  //       }
  //     }

  //     // 🔹 Merge existing + new uploads
  //     existingCompleted.push(...completedFiles);
  //     existingProject.push(...projectFiles);

  //     // 🔹 Convert to escaped JSON string
  //     const completedFilesString = JSON.stringify(existingCompleted);
  //     const projectFilesString = JSON.stringify(existingProject);

  //     // 🔹 Sanitizers
  //     const sanitizeInteger = (v) => (v === "" || v == null ? null : Number(v));
  //     const sanitizeDate = (v) =>
  //       !v ? null : isNaN(new Date(v)) ? null : new Date(v);

  //     // 🔹 Prepare final update payload
  //     const postData = {
  //       user_id: req.userId,
  //       engineer_id: sanitizeInteger(data.engineer_id),
  //       name: data.name || null,
  //       city: data.city || null,
  //       state: sanitizeInteger(data.state),
  //       bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
  //       address: data.address || null,
  //       zip: sanitizeInteger(data.zip),
  //       units: sanitizeInteger(data.units),
  //       projectType: data.projectType || null,
  //       project_phase: data.project_phase || null,
  //       bldgs: sanitizeInteger(data.bldgs),
  //       wind_zone: data.wind_zone || null,
  //       seismic_zone: data.seismic_zone || null,
  //       developer_id: sanitizeInteger(data.developer_id),
  //       general_contractor_id: sanitizeInteger(data.general_contractor_id),
  //       assign_to_budget: sanitizeInteger(data.assign_to_budget),
  //       take_off_team_id: sanitizeInteger(data.take_off_team_id),
  //       take_off_type: data.take_off_type || null,
  //       take_off_scope: data.take_off_scope || null,
  //       takeoffDueDate: sanitizeDate(data.takeoffDueDate),
  //       takeoffStartDate: sanitizeDate(data.takeoffStartDate),
  //       assign_date: sanitizeDate(data.assign_date),
  //       project_file: projectFilesString, // 🔹 updated column
  //       completedFiles: completedFilesString,
  //       architecture: sanitizeInteger(data.architecture),
  //       takeoffactualtime: sanitizeInteger(data.takeoffactualtime),
  //       dueDate: sanitizeDate(data.dueDate),
  //       projectAttachmentUrls: data.projectAttachmentUrls || null,
  //       attachmentsLink: data.attachmentsLink || null,
  //       projectRifFields: data.projectRifFields || null,
  //       status: "new",
  //       takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
  //       connectplan: data.connectplan || null,
  //       surveyorNotes: data.surveyorNotes || null,
  //       takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime),
  //       project_status: data.project_status || "active",
  //       takeoff_status: data.takeoff_status || null,
  //       work_hours: data.work_hours || null,
  //     };

  //     commonHelper.removeFalsyKeys(postData);

  //     // 🔹 Update DB
  //     const updateProject = await projectServices.updateProject(
  //       postData,
  //       projectId
  //     );

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           updateProject,
  //           "Project updated successfully (files synced)"
  //         )
  //       );
  //   } catch (error) {
  //     console.error("Update project failed:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Project updation failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

  async updateProject(req, res) {
    try {
      const projectId = req.query.projectId;
      const getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");

      const data = req.body;

      // 🔹 Helper: delete from Google Drive
      const deleteFilesFromDrive = async (fileLinks = []) => {
        for (const link of fileLinks) {
          try {
            const match = link.match(/\/d\/([^/]+)\//);
            if (match && match[1]) {
              const fileId = match[1];
              await drive.files.delete({ fileId, supportsAllDrives: true });
              console.log(`Deleted from Drive: ${fileId}`);

              // 🔹 Remove from gDriveAssociation
              await projectServices.deleteDriveAssociation(fileId);
            }
          } catch (err) {
            console.error(`Drive deletion failed for: ${link}`, err.message);
          }
        }
      };

      // 🔹 Parse deleted files arrays
      const deletedCompletedFiles =
        typeof data.deletedCompletedFiles === "string"
          ? JSON.parse(data.deletedCompletedFiles || "[]")
          : data.deletedCompletedFiles || [];

      const deletedProjectFiles =
        typeof data.deletedProjectFiles === "string"
          ? JSON.parse(data.deletedProjectFiles || "[]")
          : data.deletedProjectFiles || [];

      // 🔹 Delete files from Drive
      if (deletedCompletedFiles.length)
        await deleteFilesFromDrive(deletedCompletedFiles);
      if (deletedProjectFiles.length)
        await deleteFilesFromDrive(deletedProjectFiles);

      // 🔹 Parse existing DB JSON
      let existingCompleted = [];
      let existingProject = [];

      try {
        existingCompleted = JSON.parse(getProjectById.completedFiles || "[]");
      } catch {
        existingCompleted = [];
      }

      try {
        existingProject = JSON.parse(getProjectById.project_file || "[]");
      } catch {
        existingProject = [];
      }

      // 🔹 Remove deleted entries from existing arrays
      if (deletedCompletedFiles.length) {
        existingCompleted = existingCompleted.filter(
          (file) => !deletedCompletedFiles.includes(file.link)
        );
      }
      if (deletedProjectFiles.length) {
        existingProject = existingProject.filter(
          (file) => !deletedProjectFiles.includes(file.link)
        );
      }

      // 🔹 Helper: Save file to Google Drive association
      const saveFolder = async (module, module_id, drive_id, file_name) =>
        await projectServices.addDriveAssociation({
          parent: projectId,
          module,
          module_id,
          drive_id,
          file_name,
        });

      // 🔹 Handle uploads
      let completedFiles = [];
      let projectFiles = [];

      if (Array.isArray(req.files)) {
        // Completed Files
        const completedUploads = req.files.filter((f) =>
          f.fieldname.startsWith("completedFiles")
        );

        const mainFolders = await getOrCreateSubfolder(
          process.env.GOOGLE_DRIVE_FOLDER_ID,
          `${projectId}. ${getProjectById.name}`
        );
        const completedFolder = await getOrCreateSubfolder(
          mainFolders,
          "completedFiles"
        );

        // const completedFolder = await getOrCreateSubfolder(
        //   process.env.GOOGLE_DRIVE_FOLDER_ID,
        //   `${projectId}. ${getProjectById.name}`,
        //   "completedFiles"
        // );
        for (const file of completedUploads) {
          const driveFile = await uploadFileToDrive(
            file.path,
            file.originalname,
            file.mimetype,
            completedFolder
          );
          completedFiles.push({
            name: file.originalname,
            link: driveFile.webViewLink,
            size: file.size,
          });
          await saveFolder(
            "completedFiles",
            projectId,
            driveFile.id,
            file.originalname
          );
        }

        // Project Files
        const projectUploads = req.files.filter((f) =>
          f.fieldname.startsWith("projectFiles")
        );
        const mainFolder = await getOrCreateSubfolder(
          process.env.GOOGLE_DRIVE_FOLDER_ID,
          `${projectId}. ${getProjectById.name}`
        );
        const projectFilesFolder = await getOrCreateSubfolder(
          mainFolder,
          "projectFiles"
        );

        // const projectFilesFolder = await getOrCreateSubfolder(
        //   process.env.GOOGLE_DRIVE_FOLDER_ID,
        //   `${projectId}. ${getProjectById.name}`,
        //   "projectFiles"
        // );

        for (const file of projectUploads) {
          const driveFile = await uploadFileToDrive(
            file.path,
            file.originalname,
            file.mimetype,
            projectFilesFolder
          );

          projectFiles.push({
            name: file.originalname,
            link: driveFile.webViewLink,
            size: file.size,
          });
          await saveFolder(
            "projectFiles",
            projectId,
            driveFile.id,
            file.originalname
          );
        }
      }

      // 🔹 Merge existing + new uploads
      existingCompleted.push(...completedFiles);
      existingProject.push(...projectFiles);

      // 🔹 Convert to JSON string
      const completedFilesString = JSON.stringify(existingCompleted);
      const projectFilesString = JSON.stringify(existingProject);

      // 🔹 Sanitizers
      const sanitizeInteger = (v) => (v === "" || v == null ? null : Number(v));
      const sanitizeDate = (v) =>
        !v ? null : isNaN(new Date(v)) ? null : new Date(v);

      // 🔹 Prepare final update payload
      const postData = {
        user_id: req.userId,
        engineer_id: sanitizeInteger(data.engineer_id),
        name: data.name || null,
        city: data.city || null,
        state: sanitizeInteger(data.state),
        bldg_gsqft: sanitizeInteger(data.bldg_gsqft),
        address: data.address || null,
        zip: sanitizeInteger(data.zip),
        units: sanitizeInteger(data.units),
        projectType: data.projectType || null,
        project_phase: data.project_phase || null,
        bldgs: sanitizeInteger(data.bldgs),
        wind_zone: data.wind_zone || null,
        seismic_zone: data.seismic_zone || null,
        developer_id: sanitizeInteger(data.developer_id),
        general_contractor_id: sanitizeInteger(data.general_contractor_id),
        assign_to_budget: sanitizeInteger(data.assign_to_budget),
        take_off_team_id: sanitizeInteger(data.take_off_team_id),
        take_off_type: data.take_off_type || null,
        take_off_scope: data.take_off_scope || null,
        takeoffDueDate: sanitizeDate(data.takeoffDueDate),
        takeoffStartDate: sanitizeDate(data.takeoffStartDate),
        assign_date: sanitizeDate(data.assign_date),
        project_file: projectFilesString,
        completedFiles: completedFilesString,
        architecture: sanitizeInteger(data.architecture),
        takeoffactualtime: sanitizeInteger(data.takeoffactualtime),
        dueDate: sanitizeDate(data.dueDate),
        projectAttachmentUrls: data.projectAttachmentUrls || null,
        attachmentsLink: data.attachmentsLink || null,
        projectRifFields: data.projectRifFields || null,
        status: "new",
        takeofCompleteDate: sanitizeDate(data.takeofCompleteDate),
        connectplan: data.connectplan || null,
        surveyorNotes: data.surveyorNotes || null,
        takeOfEstimateTime: sanitizeInteger(data.takeOfEstimateTime),
        project_status: data.project_status || "active",
        takeoff_status: data.takeoff_status || null,
        work_hours: data.work_hours || null,
      };

      commonHelper.removeFalsyKeys(postData);

      // 🔹 Update DB
      const updatedProject = await projectServices.updateProject(
        postData,
        projectId
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedProject,
            "Project updated successfully (files synced)"
          )
        );
    } catch (error) {
      console.error("Update project failed:", error);
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project updation failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*deleteProject*/
  async deleteProject(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");
      let deleteProject = await projectServices.deleteProject(projectId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deleteProject,
            "Project deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*setDefaultLead*/
  async setDefaultLead(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const leadId = req.query.leadId;
      const { isDefaultLead } = req.body;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId is required",
        });
      }

      if (isDefaultLead === undefined) {
        return res.status(400).json({
          status: false,
          message: "isDefaultLead is required in body",
        });
      }

      const updatedLead = await leadServices.setDefaultLead(
        leadId,
        isDefaultLead
      );

      if (!updatedLead) {
        throw new Error("Lead not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedLead,
            `Lead updated successfully with isDefaultLead=${isDefaultLead}`
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to set default lead",
        data: error.response?.data || {},
      });
    }
  },
  async updateProjectPlanSet(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);

      if (!getProjectById) throw new Error("Project not found");
      let data = req.body;
      let postData = {
        project_id: projectId,
        submissionType: data.submissionType,
        date_received: data.date_received,
        plan_link: data.plan_link,
        planFiles: data.planFiles,
        plan_date: data.plan_date,
        rev_status: data.rev_status,
        plan_reviewed_date: data.plan_reviewed_date,
        plan_reviewed_by: data.plan_reviewed_by,
        data_collocated_date: data.data_collocated_date,
        plan_revision_notes: data.plan_revision_notes,
      };
      // commonHelper.removeFalsyKeys(postData);
      // await db.projectplanSetsObj.destroy({
      //     where: { project_id: projectId },
      // });

      await projectServices.projectplanSets(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Project plan set updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project plan set updation failed",
        data: error.response?.data || {},
      });
    }
  },
  async addProjectPlanSet(req, res) {
    try {
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);

      if (!getProjectById) throw new Error("Project not found");

      let data = req.body;
      let postData = {
        project_id: projectId,
        submissionType: data.submissionType,
        date_received: data.date_received,
        plan_link: data.plan_link,
        planFiles: data.planFiles,
        plan_date: data.plan_date,
        rev_status: data.rev_status,
        plan_reviewed_date: data.plan_reviewed_date,
        plan_reviewed_by: data.plan_reviewed_by,
        data_collocated_date: data.data_collocated_date,
        plan_revision_notes: data.plan_revision_notes,
      };

      const newPlanSet = await projectServices.projectplanSets(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            newPlanSet,
            "Project plan set added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Adding project plan set failed",
        data: error.response?.data || {},
      });
    }
  },

  async getProjectPlanSet(req, res) {
    try {
      const { projectId, search, id, page, per_page } = req.query;

      if (!projectId) {
        return res.status(400).json({
          status: false,
          message: "projectId is required",
          data: {},
        });
      }
      const planSets = await projectServices.getProjectPlanSet({
        project_id: projectId,
        id,
        search,
        page,
        per_page,
      });

      return res.status(200).json({
        status: true,
        message: "Project plan sets fetched successfully",
        data: planSets.records,
        meta: planSets.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Fetching project plan sets failed",
        data: {},
      });
    }
  },

  // /*deleteProject*/
  async deleteProject(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");
      let deleteProject = await projectServices.deleteProject(projectId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deleteProject,
            "Project deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*setDefaultLead*/
  async setDefaultLead(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const leadId = req.query.leadId;
      const { isDefaultLead } = req.body;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId is required",
        });
      }

      if (isDefaultLead === undefined) {
        return res.status(400).json({
          status: false,
          message: "isDefaultLead is required in body",
        });
      }

      const updatedLead = await leadServices.setDefaultLead(
        leadId,
        isDefaultLead
      );

      if (!updatedLead) {
        throw new Error("Lead not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedLead,
            `Lead updated successfully with isDefaultLead=${isDefaultLead}`
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to set default lead",
        data: error.response?.data || {},
      });
    }
  },
  async updateProjectPlanSet(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);

      if (!getProjectById) throw new Error("Project not found");
      let data = req.body;
      let postData = {
        project_id: projectId,
        submissionType: data.submissionType,
        date_received: data.date_received,
        plan_link: data.plan_link,
        planFiles: data.planFiles,
        plan_date: data.plan_date,
        rev_status: data.rev_status,
        plan_reviewed_date: data.plan_reviewed_date,
        plan_reviewed_by: data.plan_reviewed_by,
        data_collocated_date: data.data_collocated_date,
        plan_revision_notes: data.plan_revision_notes,
      };
      commonHelper.removeFalsyKeys(postData);
      await db.projectplanSetsObj.destroy({
        where: { project_id: projectId },
      });

      await projectServices.projectplanSets(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Project plan set updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project plan set updation failed",
        data: error.response?.data || {},
      });
    }
  },

  /*addProjectNotes*/
  async addProjectNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { project_id, notes } = req.body;

      if (!project_id || !notes) {
        return res.status(400).json({
          status: false,
          message: "project_id and notes are required",
        });
      }

      const postData = {
        user_id: req.userId, // comes from token
        project_id,
        notes,
      };

      const projectNotes = await projectServices.addProjectNotes(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            projectNotes,
            "Project notes added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project notes failed",
        data: error.response?.data || {},
      });
    }
  },

  async listProjectNotes(req, res) {
    try {
      const { page = 1, per_page = 10, projectId } = req.query;

      if (!projectId) {
        return res.status(400).json({
          status: false,
          message: "project_id is required",
        });
      }

      const notes = await projectServices.listProjectNotes(
        projectId,
        parseInt(page),
        parseInt(per_page)
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            notes,
            "Project notes fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to fetch project notes",
        data: {},
      });
    }
  },

  async updateProjectNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { projectNoteId, notes } = req.body;

      if (!projectNoteId || !notes) {
        return res.status(400).json({
          status: false,
          message: "Project note id and notes are required",
        });
      }

      const updatedNote = await projectServices.updateProjectNotes(
        projectNoteId,
        notes
      );

      if (!updatedNote) {
        throw new Error("Project note not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedNote,
            "Project note updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to update project note",
        data: {},
      });
    }
  },

  async deleteProjectNotes(req, res) {
    try {
      const { projectNoteId } = req.query;

      if (!projectNoteId) {
        return res.status(400).json({
          status: false,
          message: "project note id is required",
        });
      }

      const deleted = await projectServices.deleteProjectNotes(projectNoteId);

      if (!deleted) {
        throw new Error("Project note not found or already deleted");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Project note deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to delete project note",
        data: {},
      });
    }
  },
  async updateProjectPlanSetById(req, res) {
    try {
      const { id } = req.query;
      const data = req.body;
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "planSet id is required",
          data: {},
        });
      }

      let postData = {
        project_id: data.project_id,
        submissionType: data.submissionType,
        date_received: data.date_received,
        plan_link: data.plan_link,
        planFiles: data.planFiles,
        plan_date: data.plan_date,
        rev_status: data.rev_status,
        plan_reviewed_date: data.plan_reviewed_date,
        plan_reviewed_by: data.plan_reviewed_by,
        data_collocated_date: data.data_collocated_date,
        plan_revision_notes: data.plan_revision_notes,
      };

      const updatedPlanSet = await projectServices.updateProjectPlanSetById(
        id,
        postData
      );

      if (!updatedPlanSet) {
        return res.status(404).json({
          status: false,
          message: "Plan set not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project plan set updated successfully",
        data: updatedPlanSet,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project plan set failed",
        data: {},
      });
    }
  },

  async deleteProjectPlanSet(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "planSet id is required",
          data: {},
        });
      }

      const deleted = await projectServices.deleteProjectPlanSet(id);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Plan set not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project plan set deleted successfully",
        data: {},
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Deleting project plan set failed",
        data: {},
      });
    }
  },
  // Get Project Plan Set By ID
  async getProjectPlanSetById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "planSet id is required",
          data: {},
        });
      }

      const planSet = await projectServices.getProjectPlanSetById(id);

      if (!planSet) {
        return res.status(404).json({
          status: false,
          message: "Plan set not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project plan set fetched successfully",
        data: planSet,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Fetching project plan set failed",
        data: {},
      });
    }
  },
  async getAllProjectDataStatusNew(req, res) {
    try {
      let { page = 1, per_page = 10, search = "" } = req.query;

      page = parseInt(page);
      per_page = parseInt(per_page);

      if (page <= 0 || per_page <= 0) {
        return res.status(400).json({
          status: false,
          message: "Page and per_page must be greater than 0",
          data: {},
        });
      }

      const getAllProject = await projectServices.getAllProjectDataStatusNew(
        page,
        per_page,
        search
      );

      if (!getAllProject || getAllProject.data.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No projects found with status 'new'",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message: "Projects with status 'new' fetched successfully",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Getting projects failed",
        data: {},
      });
    }
  },
  async updateProjectType(req, res) {
    try {
      const { projectId } = req.query;
      const { name, units, projectType } = req.body;

      if (!projectId || !projectType) {
        return res.status(400).json({
          status: false,
          message: "projectId and projectType are required",
          data: {},
        });
      }
      const updatedProject = await projectServices.updateProjectType(
        projectId,
        projectType,
        name,
        units
      );

      if (!updatedProject) {
        return res.status(404).json({
          status: false,
          message: "Project not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project type updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project type failed",
        data: {},
      });
    }
  },
  async updateProjecttakeOffStatusDataCollect(req, res) {
    try {
      const { projectId } = req.query;
      const { takeoff_status } = req.body;

      if (!projectId || !takeoff_status) {
        return res.status(400).json({
          status: false,
          message: "projectId and takeoff_status are required",
          data: {},
        });
      }
      const updatedProject =
        await projectServices.updateProjecttakeOffStatusDataCollect(
          projectId,
          takeoff_status
        );

      if (!updatedProject) {
        return res.status(404).json({
          status: false,
          message: "Project not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project takeoff status updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project takeoff status failed",
        data: {},
      });
    }
  },
  async updateProjecttakeOffStatusAssignToBudget(req, res) {
    try {
      const { projectId } = req.query;
      const { takeoff_status } = req.body;

      if (!projectId || !takeoff_status) {
        return res.status(400).json({
          status: false,
          message: "projectId and takeoff_status are required",
          data: {},
        });
      }
      const updatedProject =
        await projectServices.updateProjecttakeOffStatusAssignToBudget(
          projectId,
          takeoff_status
        );

      if (!updatedProject) {
        return res.status(404).json({
          status: false,
          message: "Project not found",
          data: {},
        });
      }

      return res.status(200).json({
        status: true,
        message: "Project takeoff status updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project takeoff status failed",
        data: {},
      });
    }
  },
  async getAllProjectDatatakeoffStatusDataCollected(req, res) {
    try {
      let { page = 1, per_page = 10, search = "" } = req.query;

      page = parseInt(page);
      per_page = parseInt(per_page);

      if (page <= 0 || per_page <= 0) {
        return res.status(400).json({
          status: false,
          message: "Page and per_page must be greater than 0",
          data: {},
        });
      }
      const getAllProject =
        await projectServices.getAllProjectDatatakeoffStatusDataCollected(
          page,
          per_page,
          search
        );

      if (!getAllProject || getAllProject.data.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No projects found with takeoff_status 'data collected'",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message:
          "Projects with takeoff_status 'data collected' fetched successfully",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Getting projects failed",
        data: {},
      });
    }
  },
  async getAllProjectDatatakeoffAssignToTeam(req, res) {
    try {
      let { page = 1, per_page = 10, search = "" } = req.query;

      page = parseInt(page);
      per_page = parseInt(per_page);
      userId = req.userId;

      if (page <= 0 || per_page <= 0) {
        return res.status(400).json({
          status: false,
          message: "Page and per_page must be greater than 0",
          data: {},
        });
      }
      const getAllProject =
        await projectServices.getAllProjectDatatakeoffAssignToTeam(
          page,
          per_page,
          search,
          userId
        );

      if (!getAllProject || getAllProject.data.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No projects found with takeoff_status 'assign to team'",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message:
          "Projects with takeoff_status 'assign to team' fetched successfully",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Getting projects failed",
        data: {},
      });
    }
  },
  // async updateProjecttakeOffStatus(req, res) {
  //     try {
  //         const { takeoff_status, ids } = req.body;

  //         if (!takeoff_status || !Array.isArray(ids) || ids.length === 0) {
  //             return res.status(400).json({
  //                 status: false,
  //                 message: "takeoff_status and ids[] are required",
  //             });
  //         }

  //         const updatedCount = await projectServices.updateProjecttakeOffStatus(ids, takeoff_status);

  //         if (updatedCount === 0) {
  //             return res.status(404).json({
  //                 status: false,
  //                 message: "No projects found for the given IDs",
  //                 data: {},
  //             });
  //         }

  //         return res.status(200).json({
  //             status: true,
  //             message: "Project takeoff status updated successfully",
  //             updatedCount,
  //         });

  //     } catch (error) {
  //         console.error("Error updating project takeoff status:", error);
  //         return res.status(400).json({
  //             status: false,
  //             message: error.message || "Updating project takeoff status failed",
  //             data: {},
  //         });
  //     }
  // }
  async updateProjecttakeOffStatus(req, res) {
    try {
      const { takeoff_status, ids } = req.body;

      // Update all projects
      const updatePromises = ids.map((item) =>
        projectServices.updateProjecttakeOffStatus(
          [item.id],
          takeoff_status,
          item.priority
        )
      );

      await Promise.all(updatePromises);

      return res.status(200).json({
        status: true,
        message:
          "Projects takeoff status and star approval updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project takeoff status failed",
        data: {},
      });
    }
  },
  async getAllProjectDatatakeoffLead(req, res) {
    try {
      let { page = 1, per_page = 10, search = "" } = req.query;
      const userId = req.userId;

      page = parseInt(page);
      per_page = parseInt(per_page);

      if (page <= 0 || per_page <= 0) {
        return res.status(400).json({
          status: false,
          message: "Page and per_page must be greater than 0",
          data: {},
        });
      }
      const getAllProject = await projectServices.getAllProjectDatatakeoffLead(
        page,
        per_page,
        search,
        userId
      );

      if (!getAllProject || getAllProject.data.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No projects found with takeoff_status 'lead list'",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message: "Projects with takeoff_status 'lead' fetched successfully",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Getting projects failed",
        data: {},
      });
    }
  },
  async uploadProjectFile(req, res) {
    try {
      const projectId = req.query.projectId
      if (!projectId) throw new Error("Project ID is required");

      const project = await projectServices.getProjectById(projectId);
      if (!project) throw new Error("Project not found");

      if (!req.files || req.files.length === 0)
        throw new Error("No files uploaded");

      // --- Step 1: Get or create root folder ---
      const rootFolder = await getOrCreateSubfolder(
        process.env.GOOGLE_DRIVE_FOLDER_ID,
        `${project.id}. ${project.name}`
      );

      // --- Step 2: Get or create projectFiles folder ---
      const projectFilesFolder = await getOrCreateSubfolder(
        rootFolder,
        "projectFiles"
      );

      // --- Step 3: Save file to Google Drive ---
      const saveFolder = async (module, module_id, drive_id, file_name) =>
        await projectServices.addDriveAssociation({
          parent: project.id,
          module,
          module_id,
          drive_id,
          file_name,
        });

      let uploadedFiles = [];
      for (const file of req.files) {
        const driveFile = await uploadFileToDrive(
          file.path,
          file.originalname,
          file.mimetype,
          projectFilesFolder
        );

        uploadedFiles.push({
          name: file.originalname,
          link: driveFile.webViewLink,
          size: file.size,
        });

        await saveFolder(
          "projectFiles",
          project.id,
          driveFile.id,
          file.originalname
        );
      }

      // --- Step 4: Merge with existing project_file ---
      let existingFiles = [];
      try {
        existingFiles = JSON.parse(project.project_file || "[]");
      } catch (e) {
        existingFiles = [];
      }

      const allFiles = [...existingFiles, ...uploadedFiles];


       if (allFiles.length > 0) {
        const updateData = { project_file: JSON.stringify(allFiles) };
        const updateResult = await projectServices.updateProject(
          updateData,
          project.id
        );
      } else {
        console.log("No completed files found to update.");
      }

      return res.status(200).json({
        status: true,
        message: "Files uploaded and project_file updated successfully",
        data: allFiles,
      });
    } catch (error) {
      console.error("Upload project file failed:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "File upload failed",
        data: {},
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addProject": {
        return [
          check("name").not().isEmpty().withMessage("Project name is required"),
        ];
      }
      // case "updateProject": {
      //     return [
      //         check("name").not().isEmpty().withMessage("Project name is required")
      //     ];
      // }
    }
  },
};
