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
const qs = require("qs");
const db = require("../models");
const {
  uploadFileToDrive,
  getOrCreateSubfolder,
  deleteFileFromDrive,
} = require("../helper/googleDrive");
const path = require("path");
const fs = require("fs");

module.exports = {

 
  async addProject(req, res) {
  try {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .send(commonHelper.parseErrorRespose(errors.mapped()));
    }

    const data = req.body;

    const sanitizeInteger = (value) => (value ? Number(value) : null);
    const sanitizeDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    };

    // ✅ Step 1: Add project to DB
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
      project_phase: data.project_phase || null,
      bldgs: sanitizeInteger(data.bldgs),
      wind_zone: data.wind_zone || null,
      seismic_zone: data.seismic_zone || null,
      developer_id: sanitizeInteger(data.developer_id),
      general_contractor_id: sanitizeInteger(data.general_contractor_id),
      assign_to_budget: sanitizeDate(data.assign_to_budget),
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

    // ✅ Send response immediately (to prevent Heroku 503)
    
    res.status(200).json({
      success: true,
      message: "Project created successfully.",
      
    });

    // ✅ Continue background upload after sending response
    (async () => {
      try {
        console.log("🚀 Background upload started for project:", project.id);

        // Step 2: Create root folder
        const rootFolder = await getOrCreateSubfolder(
          process.env.GOOGLE_DRIVE_FOLDER_ID,
          `${project.id}. ${project.name}`
        );

        // Step 3: Create subfolders
        const projectFilesFolder = await getOrCreateSubfolder(rootFolder, "projectFiles");
        const planSetsFolder = await getOrCreateSubfolder(rootFolder, "PlanSets");
        const completedFolder = await getOrCreateSubfolder(rootFolder, "CompletedFiles");

        const saveFolder = async (module, module_id, drive_id, file_name = null) =>
          await projectServices.addDriveAssociation({
            project_id: project.id,
            module,
            module_id,
            drive_id,
            file_name,
          });

        // Step 4: Upload Project Files
        let projectFiles = [];
        const projectUploads = req.files?.filter((f) =>
          f.fieldname.startsWith("projectFiles")
        ) || [];

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
          await saveFolder("projectFiles", project.id, driveFile.id, file.originalname);
        }

        if (projectFiles.length > 0) {
          await projectServices.updateProject(
            { project_file: JSON.stringify(projectFiles) },
            project.id
          );
        }

        // Step 5: Upload Completed Files
        let completedFiles = [];
        const completedUploads = req.files?.filter((f) =>
          f.fieldname.startsWith("completedFiles")
        ) || [];

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
          await saveFolder("completedFiles", project.id, driveFile.id, file.originalname);
        }

        if (completedFiles.length > 0) {
          await projectServices.updateProject(
            { completedFiles: JSON.stringify(completedFiles) },
            project.id
          );
        }

        // Step 6: Upload Plan Sets
        const planSets = Array.isArray(data.planSets)
          ? data.planSets
          : JSON.parse(data.planSets || "[]");

        for (let index = 0; index < planSets.length; index++) {
          const plan = planSets[index];

          const planSetFolder = await getOrCreateSubfolder(planSetsFolder, `${index + 1}`);

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

          const createdPlan = await projectServices.projectplanSets(planData);
          await saveFolder("planSetFiles", createdPlan.id, planSetFolder);

          const planFiles = req.files?.filter(
            (f) => f.fieldname === `planSets[${index}][planFiles]`
          ) || [];

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
            await saveFolder("planSetFiles", createdPlan.id, driveFile.id, file.originalname);
          }

          await projectServices.updatePlanFiles(createdPlan.id, JSON.stringify(uploadedFiles));
        }

        // Step 7: Handle Tags
        if (data.project_tags) {
          const tagIds = Array.isArray(data.project_tags)
            ? data.project_tags
            : String(data.project_tags).split(",").map((id) => parseInt(id));
          await projectServices.addProjectTags(project.id, tagIds);
        }

        if (data.projectType) {
          const tagIds = Array.isArray(data.projectType)
            ? data.projectType
            : String(data.projectType).split(",").map((id) => parseInt(id));
          await projectServices.addProjectType(project.id, tagIds);
        }

        console.log("✅ Background upload completed for project:", project.id);
      } catch (uploadErr) {
        console.error("❌ Background upload failed for project:", project.id, uploadErr);
      }
    })();

  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.response?.data?.error || error.message || "Project failed",
      data: error.response?.data || {},
    });
  }
},


  async getAllProject(req, res) {
    try {
      let { page, per_page, search, take_all, id } = req.query;
      if (page <= 0 || per_page <= 0) {
        throw new Error("Page and length must be greater than 0");
      }

      take_all = take_all === "all";

      let getAllProject = await projectServices.getAllProject(
        page,
        per_page,
        search,
        take_all,
        id
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
          project_id: projectId,
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
        // projectType: data.projectType || null,
        project_phase: data.project_phase || null,
        bldgs: sanitizeInteger(data.bldgs),
        wind_zone: data.wind_zone || null,
        seismic_zone: data.seismic_zone || null,
        developer_id: sanitizeInteger(data.developer_id),
        general_contractor_id: sanitizeInteger(data.general_contractor_id),
        assign_to_budget: sanitizeDate(data.assign_to_budget),
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

      if (data.projectType) {
        const tagIds = Array.isArray(data.projectType)
          ? data.projectType
          : String(data.projectType)
            .split(",")
            .map((id) => parseInt(id));

        await projectServices.updateProjectTypes(projectId, tagIds);
      }

      if (data.project_tags) {
        const tagIds = Array.isArray(data.project_tags)
          ? data.project_tags
          : String(data.project_tags)
            .split(",")
            .map((id) => parseInt(id));

        await projectServices.updateProjectTags(projectId, tagIds);
      }

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

  // async addProjectPlanSet(req, res) {
  //   try {
  //     const projectId = req.query.projectId;
  //     const getProjectById = await projectServices.getProjectById(projectId);
  //     if (!getProjectById) throw new Error("Project not found");

  //     // Helper to save Google Drive association
  //     const saveFolder = async (
  //       module,
  //       module_id,
  //       drive_id,
  //       file_name = null
  //     ) =>
  //       await projectServices.addDriveAssociation({
  //         parent: projectId,
  //         module,
  //         module_id,
  //         drive_id,
  //         file_name,
  //       });

  //     // Main Project Folder
  //     const mainFolder = await getOrCreateSubfolder(
  //       process.env.GOOGLE_DRIVE_FOLDER_ID,
  //       `${projectId}. ${getProjectById.name}`
  //     );

  //     // PlanSets Folder
  //     const planSetsFolder = await getOrCreateSubfolder(mainFolder, "planSets");

  //     // ✅ Now read your array properly
  //     const planSets = req.body.planSets || [];
  //     if (planSets.length === 0) throw new Error("No planSets data found");

  //     const results = [];

  //     for (const planSetData of planSets) {
  //       // Count existing plan sets
  //       const existingCount = await db.projectplanSetsObj.count({
  //         where: { project_id: projectId },
  //       });
  //       const newPlanSetNumber = existingCount + 1;

  //       // Create numbered folder
  //       const planSetNumberFolder = await getOrCreateSubfolder(
  //         planSetsFolder,
  //         `${newPlanSetNumber}`
  //       );


  //       // Upload Files (if any)
  //       const planSetFiles = [];
  //       const planFilesUploads = req.files?.filter(
  //         (f) => f.fieldname === `planSets[0][planFiles]`
  //       );
  //       if (planFilesUploads?.length > 0) {
  //         for (const file of planFilesUploads) {
  //           const driveFile = await uploadFileToDrive(
  //             file.path,
  //             file.originalname,
  //             file.mimetype,
  //             planSetNumberFolder
  //           );

  //           planSetFiles.push({
  //             name: file.originalname,
  //             link: driveFile.webViewLink,
  //             size: file.size,
  //           });

  //           await saveFolder(
  //             "planSetFiles",
  //             newPlanSetNumber,
  //             driveFile.id,
  //             file.originalname
  //           );
  //         }
  //       }

  //       // ✅ Insert PlanSet record using correct data path
  //       const newPlanSet = await projectServices.projectplanSets({
  //         project_id: projectId,
  //         submissionType: planSetData.submissionType || null,
  //         date_received: planSetData.date_received || null,
  //         plan_link: planSetData.plan_link || null,
  //         planFiles: JSON.stringify(planSetFiles),
  //         plan_date: planSetData.plan_date || null,
  //         rev_status: planSetData.rev_status || null,
  //         plan_reviewed_date: planSetData.plan_reviewed_date || null,
  //         plan_reviewed_by: planSetData.plan_reviewed_by || null,
  //         data_collocated_date: planSetData.data_collocated_date || null,
  //         plan_revision_notes: planSetData.plan_revision_notes || null,
  //         planType: planSetData.planType || null,
  //       });

  //       await saveFolder("planSetFiles", newPlanSet.id, planSetNumberFolder);

  //       results.push(newPlanSet);
  //     }

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           results,
  //           "Project plan set added successfully"
  //         )
  //       );
  //   } catch (error) {
  //     console.error("Error in addProjectPlanSet:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message: error.message || "Adding project plan set failed",
  //     });
  //   }
  // },
  async addProjectPlanSet(req, res) {
    try {
      const projectId = req.query.projectId;
      const getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");

      // Helper to save Google Drive association
      const saveFolder = async (module, module_id, drive_id, file_name = null) =>
        await projectServices.addDriveAssociation({
          project_id: projectId,
          module,
          module_id,
          drive_id,
          file_name,
        });

      // Main Project Folder
      const mainFolder = await getOrCreateSubfolder(
        process.env.GOOGLE_DRIVE_FOLDER_ID,
        `${projectId}. ${getProjectById.name}`
      );

      // PlanSets Folder
      const planSetsFolder = await getOrCreateSubfolder(mainFolder, "planSets");

      // Validate planSets array
      const planSets = req.body.planSets || [];
      if (planSets.length === 0) throw new Error("No planSets data found");

      const results = [];

      for (let index = 0; index < planSets.length; index++) {
        const planSetData = planSets[index];

        // Count existing plan sets for numbering
        const existingCount = await db.projectplanSetsObj.count({
          where: { project_id: projectId },
        });
        const newPlanSetNumber = existingCount + 1;

        // Create numbered subfolder (e.g., 1, 2, 3)
        const planSetNumberFolder = await getOrCreateSubfolder(
          planSetsFolder,
          `${newPlanSetNumber}`
        );

        // ✅ First create PlanSet DB entry
        const newPlanSet = await projectServices.projectplanSets({
          project_id: projectId,
          submissionType: planSetData.submissionType || null,
          date_received: planSetData.date_received || null,
          plan_link: planSetData.plan_link || null,
          planFiles: null, // temporarily null until uploads are done
          plan_date: planSetData.plan_date || null,
          rev_status: planSetData.rev_status || null,
          plan_reviewed_date: planSetData.plan_reviewed_date || null,
          plan_reviewed_by: planSetData.plan_reviewed_by || null,
          data_collocated_date: planSetData.data_collocated_date || null,
          plan_revision_notes: planSetData.plan_revision_notes || null,
          planType: planSetData.planType || null,
        });

        // Save association for the folder itself
        await saveFolder("planSetFiles", newPlanSet.id, planSetNumberFolder);

        // ✅ Upload Files (if any)
        const planSetFiles = [];
        const planFilesUploads = req.files?.filter(
          (f) => f.fieldname === `planSets[${index}][planFiles]`
        );

        if (planFilesUploads?.length > 0) {
          for (const file of planFilesUploads) {
            const driveFile = await uploadFileToDrive(
              file.path,
              file.originalname,
              file.mimetype,
              planSetNumberFolder
            );

            planSetFiles.push({
              name: file.originalname,
              link: driveFile.webViewLink,
              size: file.size,
            });

            // Save file association
            await saveFolder(
              "planSetFiles",
              newPlanSet.id,
              driveFile.id,
              file.originalname
            );
          }

          // Update planFiles column
          await newPlanSet.update({
            planFiles: JSON.stringify(planSetFiles),
          });
        }

        results.push(newPlanSet);
      }

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          results,
          "Project plan set added successfully"
        )
      );
    } catch (error) {
      console.error("Error in addProjectPlanSet:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Adding project plan set failed",
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
  // async updateProjectPlanSetById(req, res) {
  //   try {
  //     const { id } = req.query;
  //     if (!id) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "planSet id is required",
  //         data: {},
  //       });
  //     }

  //     const parsedBody = qs.parse(req.body);
  //     const planSets = parsedBody.planSets;

  //     if (!Array.isArray(planSets) || planSets.length === 0) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "No planSets found in request",
  //         data: {},
  //       });
  //     }

  //     const updatedResults = [];
  //     for (const planSetData of planSets) {
  //       const postData = {
  //         project_id: planSetData.project_id,
  //         submissionType: planSetData.submissionType,
  //         date_received: planSetData.date_received,
  //         plan_link: planSetData.plan_link,
  //         planFiles: planSetData.planFiles,
  //         plan_date: planSetData.plan_date,
  //         rev_status: planSetData.rev_status,
  //         plan_reviewed_date: planSetData.plan_reviewed_date,
  //         plan_reviewed_by: planSetData.plan_reviewed_by,
  //         data_collocated_date: planSetData.data_collocated_date,
  //         plan_revision_notes: planSetData.plan_revision_notes,
  //         planType: planSetData.planType,
  //       };

  //       const updated = await projectServices.updateProjectPlanSetById(id, postData);
  //       if (updated) updatedResults.push(updated);
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "Project plan sets updated successfully",
  //       data: updatedResults,
  //     });
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message: error.message || "Updating project plan sets failed",
  //       data: {},
  //     });
  //   }
  // },
  // async updateProjectPlanSetById(req, res) {
  //   try {
  //     const { id } = req.query;
  //     if (!id) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "planSet id is required",
  //         data: {},
  //       });
  //     }

  //     const parsedBody = qs.parse(req.body);
  //     const planSets = parsedBody.planSets;

  //     if (!Array.isArray(planSets) || planSets.length === 0) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "No planSets found in request",
  //         data: {},
  //       });
  //     }

  //     let deletedOldImages = parsedBody.deletedOldImages || [];


  //     const updatedResults = [];

  //     // for (let i = 0; i < planSets.length; i++) {
  //     //   const planSetData = planSets[i];

  //     //   // 🔍 Fetch existing plan set
  //     //   const existingPlanSet = await db.projectplanSetsObj.findOne({ where: { id } });
  //     //   if (!existingPlanSet) {
  //     //     continue;
  //     //   }

  //     //   const projectId = existingPlanSet.project_id;
  //     //   const getProjectById = await projectServices.getProjectById(projectId);
  //     //   if (!getProjectById) throw new Error("Project not found");

  //     //   // 📁 Google Drive folder setup
  //     //   const mainFolder = await getOrCreateSubfolder(
  //     //     process.env.GOOGLE_DRIVE_FOLDER_ID,
  //     //     `${projectId}. ${getProjectById.name}`
  //     //   );

  //     //   const allPlanSets = await db.gDriveAssociationObj.findAll({
  //     //     where: { parent: projectId },
  //     //   });

  //     //   const planSetsFolder = await getOrCreateSubfolder(mainFolder, "planSets");

  //     //   const planSetNumberFolder = await getOrCreateSubfolder(planSetsFolder, `${id}`);

  //     //   const saveFolder = async (module, module_id, drive_id, file_name = null) =>
  //     //     await projectServices.addDriveAssociation({
  //     //       parent: projectId,
  //     //       module,
  //     //       module_id,
  //     //       drive_id,
  //     //       file_name,
  //     //     });

  //     //   await saveFolder("planSetFiles", id, planSetNumberFolder);

  //     //   const planSetFiles = [];
  //     //   const planFilesUploads = req.files?.filter(
  //     //     (f) => f.fieldname === `planSets[${i}][planFiles]`
  //     //   );
  //     //   if (planFilesUploads?.length > 0) {
  //     //     for (const file of planFilesUploads) {
  //     //       const driveFile = await uploadFileToDrive(
  //     //         file.path,
  //     //         file.originalname,
  //     //         file.mimetype,
  //     //         planSetNumberFolder
  //     //       );

  //     //       planSetFiles.push({
  //     //         name: file.originalname,
  //     //         link: driveFile.webViewLink,
  //     //         size: file.size,
  //     //       });

  //     //       await saveFolder("planSetFiles", id, driveFile.id, file.originalname);
  //     //     }
  //     //   }

  //     //   const postData = {
  //     //     project_id: planSetData.project_id,
  //     //     submissionType: planSetData.submissionType,
  //     //     date_received: planSetData.date_received,
  //     //     plan_link: planSetData.plan_link,
  //     //     planFiles: planSetFiles.length > 0 ? JSON.stringify(planSetFiles) : existingPlanSet.planFiles,
  //     //     plan_date: planSetData.plan_date,
  //     //     rev_status: planSetData.rev_status,
  //     //     plan_reviewed_date: planSetData.plan_reviewed_date,
  //     //     plan_reviewed_by: planSetData.plan_reviewed_by,
  //     //     data_collocated_date: planSetData.data_collocated_date,
  //     //     plan_revision_notes: planSetData.plan_revision_notes,
  //     //     planType: planSetData.planType,
  //     //   };

  //     //   const updated = await projectServices.updateProjectPlanSetById(id, postData);
  //     //   if (updated) updatedResults.push(updated);
  //     // }
  //     for (let i = 0; i < planSets.length; i++) {
  //       const planSetData = planSets[i];
  //       // const id = planSetData.id; // ✅ Fix: define ID properly

  //       // 🔍 Fetch existing plan set
  //       const existingPlanSet = await db.projectplanSetsObj.findOne({
  //         where: { id },
  //       });
  //       if (!existingPlanSet) {
  //         console.warn(`Plan set not found for ID: ${id}`);
  //         continue;
  //       }

  //       const projectId = existingPlanSet.project_id;
  //       const getProjectById = await projectServices.getProjectById(projectId);
  //       if (!getProjectById) throw new Error("Project not found");

  //       // 📁 Google Drive folder setup
  //       const mainFolder = await getOrCreateSubfolder(
  //         process.env.GOOGLE_DRIVE_FOLDER_ID,
  //         `${projectId}. ${getProjectById.name}`
  //       );

  //       const allPlanSets = await db.gDriveAssociationObj.findAll({
  //         where: { module_id: id },
  //       });

  //       console.log("All Drive Associations for this Plan Set:", allPlanSets);

  //       const planSetsFolder = await getOrCreateSubfolder(
  //         mainFolder,
  //         "planSets"
  //       );
  //       const planSetNumberFolder = await getOrCreateSubfolder(
  //         planSetsFolder,
  //         `${id}`
  //       );

  //       const saveFolder = async (
  //         module,
  //         module_id,
  //         drive_id,
  //         file_name = null
  //       ) =>
  //         await projectServices.addDriveAssociation({
  //           parent: projectId,
  //           module,
  //           module_id,
  //           drive_id,
  //           file_name,
  //         });

  //       await saveFolder("planSetFiles", id, planSetNumberFolder);

  //       // 🧩 Step 1: Start with existing files
  //       let existingFiles = [];
  //       if (existingPlanSet.planFiles) {
  //         try {
  //           existingFiles = JSON.parse(existingPlanSet.planFiles);
  //         } catch (err) {
  //           console.warn("Invalid existing planFiles JSON, resetting:", err);
  //           existingFiles = [];
  //         }
  //       }

  //       // 🧩 Step 2: Upload new files and append
  //       const newPlanSetFiles = [];
  //       const planFilesUploads = req.files?.filter(
  //         (f) => f.fieldname === `planSets[${i}][planFiles]`
  //       );

  //       if (planFilesUploads?.length > 0) {
  //         for (const file of planFilesUploads) {
  //           const driveFile = await uploadFileToDrive(
  //             file.path,
  //             file.originalname,
  //             file.mimetype,
  //             planSetNumberFolder
  //           );

  //           newPlanSetFiles.push({
  //             name: file.originalname,
  //             link: driveFile.webViewLink,
  //             size: file.size,
  //           });

  //           await saveFolder(
  //             "planSetFiles",
  //             id,
  //             driveFile.id,
  //             file.originalname
  //           );
  //         }
  //       }

  //       // 🧩 Step 3: Combine old + new files
  //       const combinedFiles = [...existingFiles, ...newPlanSetFiles];

  //       // 🧩 Step 4: Update Plan Set
  //       const postData = {
  //         project_id: planSetData.project_id,
  //         submissionType: planSetData.submissionType,
  //         date_received: planSetData.date_received,
  //         plan_link: planSetData.plan_link,
  //         planFiles: JSON.stringify(combinedFiles), // ✅ keep old + new
  //         plan_date: planSetData.plan_date,
  //         rev_status: planSetData.rev_status,
  //         plan_reviewed_date: planSetData.plan_reviewed_date,
  //         plan_reviewed_by: planSetData.plan_reviewed_by,
  //         data_collocated_date: planSetData.data_collocated_date,
  //         plan_revision_notes: planSetData.plan_revision_notes,
  //         planType: planSetData.planType,
  //       };

  //       const updated = await projectServices.updateProjectPlanSetById(
  //         id,
  //         postData
  //       );
  //       if (updated) updatedResults.push(updated);
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "Project plan sets updated successfully",
  //       data: updatedResults,
  //     });
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message: error.message || "Updating project plan sets failed",
  //       data: {},
  //     });
  //   }
  // },
  // async updateProjectPlanSetById(req, res) {
  //   try {
  //     const { id } = req.query;
  //     if (!id) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "planSet id is required",
  //         data: {},
  //       });
  //     }

  //     const parsedBody = qs.parse(req.body);
  //     const planSets = parsedBody.planSets;
  //     let { deletedOldImages } = req.body;

  //     if (!Array.isArray(planSets) || planSets.length === 0) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "No planSets found in request",
  //         data: {},
  //       });
  //     }

  //     const updatedResults = [];

  //     for (let i = 0; i < planSets.length; i++) {
  //       const planSetData = planSets[i];

  //       // 🔍 Fetch existing plan set
  //       const existingPlanSet = await db.projectplanSetsObj.findOne({ where: { id } });
  //       if (!existingPlanSet) {
  //         console.warn(`Plan set not found for ID: ${id}`);
  //         continue;
  //       }

  //       const projectId = existingPlanSet.project_id;
  //       const getProjectById = await projectServices.getProjectById(projectId);
  //       if (!getProjectById) throw new Error("Project not found");

  //       // 📁 Main Google Drive project folder
  //       const mainFolder = await getOrCreateSubfolder(
  //         process.env.GOOGLE_DRIVE_FOLDER_ID,
  //         `${projectId}. ${getProjectById.name}`
  //       );

  //       // ✅ Find existing Drive folder for this plan set
  //       let planSetNumberFolderId;
  //       const existingFolder = await db.gDriveAssociationObj.findOne({
  //         where: {
  //           module: "planSetFiles",
  //           module_id: id,
  //           parent: projectId,
  //         },
  //       });

  //       if (existingFolder && existingFolder.drive_id) {
  //         planSetNumberFolderId = existingFolder.drive_id;
  //       } else {
  //         const planSetsFolder = await getOrCreateSubfolder(mainFolder, "planSets");
  //         const newFolder = await getOrCreateSubfolder(planSetsFolder, `${id}`);
  //         planSetNumberFolderId = newFolder;

  //         await projectServices.addDriveAssociation({
  //           parent: projectId,
  //           module: "planSetFiles",
  //           module_id: id,
  //           drive_id: newFolder,
  //         });
  //         console.log("📁 Created New Folder:", newFolder);
  //       }

  //       const saveFolder = async (module, module_id, drive_id, file_name = null) =>
  //         await projectServices.addDriveAssociation({
  //           parent: projectId,
  //           module,
  //           module_id,
  //           drive_id,
  //           file_name,
  //         });

  //       // 🧩 Step 1: Get existing files from DB
  //       let existingFiles = [];
  //       if (existingPlanSet.planFiles) {
  //         try {
  //           existingFiles = JSON.parse(existingPlanSet.planFiles);
  //         } catch (err) {
  //           console.warn("Invalid existing planFiles JSON, resetting:", err);
  //           existingFiles = [];
  //         }
  //       }

  //       if (typeof deletedOldImages === "string") {
  //         try {
  //           deletedOldImages = JSON.parse(deletedOldImages);
  //         } catch (err) {
  //           console.error("Failed to parse deletedOldImages:", err.message);
  //           deletedOldImages = [];
  //         }
  //       }

  //       if (Array.isArray(deletedOldImages)) {
  //         for (const url of deletedOldImages) {
  //           try {
  //             const decodedUrl = decodeURIComponent(url);
  //             const match = decodedUrl.match(/\/d\/(.*?)\//);

  //             if (match && match[1]) {
  //               const driveId = match[1];


  //               await projectServices.deleteDriveAssociation(driveId);

  //               console.log("Deleted successfully:", driveId);
  //             } else {
  //               console.log("Invalid Google Drive URL:", decodedUrl);
  //             }
  //           } catch (error) {
  //             console.error("Error while deleting file:", error.message);
  //           }
  //         }
  //       } else {
  //         console.log("deletedOldImages is not an array:", deletedOldImages);
  //       }


  //       const newPlanSetFiles = [];
  //       const planFilesUploads = req.files?.filter(
  //         (f) => f.fieldname === `planSets[${i}][planFiles]`
  //       );

  //       if (planFilesUploads?.length > 0) {
  //         for (const file of planFilesUploads) {
  //           const driveFile = await uploadFileToDrive(
  //             file.path,
  //             file.originalname,
  //             file.mimetype,
  //             planSetNumberFolderId
  //           );

  //           newPlanSetFiles.push({
  //             name: file.originalname,
  //             link: driveFile.webViewLink,
  //             size: file.size,
  //             drive_id: driveFile.id,
  //           });

  //           await saveFolder("planSetFiles", id, driveFile.id, file.originalname);
  //         }
  //       }

  //       // 🧩 Step 4: Combine remaining + new files
  //       const combinedFiles = [...existingFiles, ...newPlanSetFiles];

  //       // 🧩 Step 5: Update Plan Set Record
  //       const postData = {
  //         project_id: planSetData.project_id,
  //         submissionType: planSetData.submissionType,
  //         date_received: planSetData.date_received,
  //         plan_link: Array.isArray(planSetData.plan_link)
  //           ? planSetData.plan_link[0]
  //           : planSetData.plan_link,
  //         planFiles: JSON.stringify(combinedFiles),
  //         plan_date: planSetData.plan_date,
  //         rev_status: planSetData.rev_status,
  //         plan_reviewed_date: planSetData.plan_reviewed_date,
  //         plan_reviewed_by: planSetData.plan_reviewed_by,
  //         data_collocated_date: planSetData.data_collocated_date,
  //         plan_revision_notes: planSetData.plan_revision_notes,
  //         planType: planSetData.planType,
  //       };

  //       const updated = await projectServices.updateProjectPlanSetById(id, postData);
  //       if (updated) updatedResults.push(updated);
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "Project plan sets updated successfully (with deletions handled)",
  //       data: updatedResults,
  //     });
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message: error.message || "Updating project plan sets failed",
  //       data: {},
  //     });
  //   }
  // },

  // async updateProjectPlanSetById(req, res) {
  //   try {
  //     const { id } = req.query;
  //     if (!id) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "planSet id is required",
  //         data: {},
  //       });
  //     }

  //     const parsedBody = qs.parse(req.body);
  //     const planSets = parsedBody.planSets;
  //     let { deletedOldImages } = req.body;

  //     if (!Array.isArray(planSets) || planSets.length === 0) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "No planSets found in request",
  //         data: {},
  //       });
  //     }

  //     const updatedResults = [];

  //     for (let i = 0; i < planSets.length; i++) {
  //       const planSetData = planSets[i];


  //       const existingPlanSet = await db.projectplanSetsObj.findOne({ where: { id } });
  //       if (!existingPlanSet) {
  //         console.warn(`Plan set not found for ID: ${id}`);
  //         continue;
  //       }

  //       const projectId = existingPlanSet.project_id;


  //       const existingFolder = await db.gDriveAssociationObj.findOne({
  //         where: {
  //           module: "planSetFiles",
  //           module_id: id,
  //           parent: projectId,
  //         },
  //       });

  //        const existingPlanSetFiles = await db.projectplanSetsObj.findOne({
  //         where: {
  //           id: id,
  //           project_id: projectId,
  //         },
  //       });

  //       console.log("Existing Plan Set Files from DB:", existingPlanSetFiles);


  //       if (!existingFolder || !existingFolder.drive_id) {
  //         throw new Error(`No existing Google Drive folder found for plan set ID: ${id}`);
  //       }

  //       const planSetFolderId = existingFolder.drive_id;


  //       if (typeof deletedOldImages === "string") {
  //         try {
  //           deletedOldImages = JSON.parse(deletedOldImages);
  //         } catch (err) {
  //           console.error("Failed to parse deletedOldImages:", err.message);
  //           deletedOldImages = [];
  //         }
  //       }


  //       if (Array.isArray(deletedOldImages)) {
  //         for (const url of deletedOldImages) {
  //           try {
  //             const decodedUrl = decodeURIComponent(url);
  //             console.log("Decoded URL for deletion:", decodedUrl);
  //             const match = decodedUrl.match(/\/d\/(.*?)\//);
  //             if (match && match[1]) {
  //               const driveId = match[1];

  //               await projectServices.deleteDriveAssociation(driveId);

  //               await deleteFileFromDrive(driveId);
  //             } else {
  //               console.log("Invalid Google Drive URL:", decodedUrl);
  //             }
  //           } catch (error) {
  //             console.error("Error deleting old image:", error.message);
  //           }
  //         }
  //       }




  //       let existingFiles = [];
  //       if (existingPlanSet.planFiles) {
  //         try {
  //           existingFiles = JSON.parse(existingPlanSet.planFiles);
  //         } catch (err) {
  //           console.warn("Invalid existing planFiles JSON:", err);
  //           existingFiles = [];
  //         }
  //       }

  //       const newPlanSetFiles = [];
  //       const planFilesUploads = req.files?.filter(
  //         (f) => f.fieldname === `planSets[${i}][planFiles]`
  //       );

  //       if (planFilesUploads?.length > 0) {
  //         for (const file of planFilesUploads) {
  //           const driveFile = await uploadFileToDrive(
  //             file.path,
  //             file.originalname,
  //             file.mimetype,
  //             planSetFolderId
  //           );

  //           newPlanSetFiles.push({
  //             name: file.originalname,
  //             link: driveFile.webViewLink,
  //             size: file.size,
  //             drive_id: driveFile.id,
  //           });

  //           // save association
  //           await projectServices.addDriveAssociation({
  //             parent: projectId,
  //             module: "planSetFiles",
  //             module_id: id,
  //             drive_id: driveFile.id,
  //             file_name: file.originalname,
  //           });
  //         }
  //       }


  //       const combinedFiles = [...existingFiles, ...newPlanSetFiles];

  //       const sanitizeInteger = (value) => (value ? Number(value) : null);
  //       const sanitizeDate = (value) => {
  //         if (!value) return null;
  //         const date = new Date(value);
  //         return isNaN(date.getTime()) ? null : date;
  //       };
  //       const postData = {
  //         project_id: projectId,
  //         submissionType: planSetData.submissionType,
  //         date_received: sanitizeDate(planSetData.date_received),
  //         plan_link: Array.isArray(planSetData.plan_link)
  //           ? planSetData.plan_link[0]
  //           : planSetData.plan_link,
  //         planFiles: JSON.stringify(combinedFiles),
  //         plan_date: sanitizeDate(planSetData.plan_date),
  //         rev_status: planSetData.rev_status,
  //         plan_reviewed_date: sanitizeDate(planSetData.plan_reviewed_date),
  //         plan_reviewed_by: sanitizeInteger(planSetData.plan_reviewed_by),
  //         data_collocated_date: sanitizeDate(planSetData.data_collocated_date),
  //         plan_revision_notes: planSetData.plan_revision_notes,
  //         planType: planSetData.planType,
  //       };


  //       const updated = await projectServices.updateProjectPlanSetById(id, postData);
  //       if (updated) updatedResults.push(updated);
  //     }

  //     return res.status(200).json({
  //       status: true,
  //       message: "Plan Set updated successfully (files replaced/deleted)",
  //       data: updatedResults,
  //     });
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return res.status(400).json({
  //       status: false,
  //       message: error.message || "Updating project plan sets failed",
  //       data: {},
  //     });
  //   }
  // },
  async updateProjectPlanSetById(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "planSet id is required",
          data: {},
        });
      }

      const parsedBody = qs.parse(req.body);
      const planSets = parsedBody.planSets;
      let { deletedOldImages } = req.body;

      if (!Array.isArray(planSets) || planSets.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No planSets found in request",
          data: {},
        });
      }

      const updatedResults = [];

      for (let i = 0; i < planSets.length; i++) {
        const planSetData = planSets[i];

        const existingPlanSet = await db.projectplanSetsObj.findOne({ where: { id } });
        if (!existingPlanSet) {
          console.warn(`Plan set not found for ID: ${id}`);
          continue;
        }

        const projectId = existingPlanSet.project_id;

        const existingFolder = await db.gDriveAssociationObj.findOne({
          where: {
            module: "planSetFiles",
            module_id: id,
            project_id: projectId,
          },
        });

        const existingPlanSetFiles = await db.projectplanSetsObj.findOne({
          where: { id, project_id: projectId },
        });

        console.log("Existing Plan Set Files from DB:", existingPlanSetFiles);

        if (!existingFolder || !existingFolder.drive_id) {
          throw new Error(`No existing Google Drive folder found for plan set ID: ${id}`);
        }

        const planSetFolderId = existingFolder.drive_id;


        if (typeof deletedOldImages === "string") {
          try {
            deletedOldImages = JSON.parse(deletedOldImages);
          } catch (err) {
            deletedOldImages = [];
          }
        }


        if (Array.isArray(deletedOldImages) && deletedOldImages.length > 0) {
          for (const url of deletedOldImages) {
            try {
              const decodedUrl = decodeURIComponent(url);
              const match = decodedUrl.match(/\/d\/(.*?)\//);
              if (match && match[1]) {
                const driveId = match[1];
                await projectServices.deleteDriveAssociation(driveId);
                await deleteFileFromDrive(driveId);
              }
            } catch (err) {
              console.error("Error deleting old image:", err.message);
            }
          }


          if (existingPlanSetFiles.planFiles) {
            let currentFiles = [];
            try {
              currentFiles = JSON.parse(existingPlanSetFiles.planFiles);
            } catch (err) {
              console.warn("Invalid existing planFiles JSON:", err);
              currentFiles = [];
            }

            const filteredFiles = currentFiles.filter(
              (file) => !deletedOldImages.includes(file.link)
            );

            await db.projectplanSetsObj.update(
              { planFiles: JSON.stringify(filteredFiles) },
              { where: { id, project_id: projectId } }
            );


          }
        }

        let existingFiles = [];
        if (existingPlanSet.planFiles) {
          try {
            existingFiles = JSON.parse(existingPlanSet.planFiles);
          } catch (err) {
            existingFiles = [];
          }
        }

        const newPlanSetFiles = [];
        const planFilesUploads = req.files?.filter(
          (f) => f.fieldname === `planSets[${i}][planFiles]`
        );

        if (planFilesUploads?.length > 0) {
          for (const file of planFilesUploads) {
            const driveFile = await uploadFileToDrive(
              file.path,
              file.originalname,
              file.mimetype,
              planSetFolderId
            );

            newPlanSetFiles.push({
              name: file.originalname,
              link: driveFile.webViewLink,
              size: file.size,
              drive_id: driveFile.id,
            });

            await projectServices.addDriveAssociation({
              project_id: projectId,
              module: "planSetFiles",
              module_id: id,
              drive_id: driveFile.id,
              file_name: file.originalname,
            });
          }
        }


        const combinedFiles = [
          ...existingFiles.filter((file) => !deletedOldImages?.includes(file.link)),
          ...newPlanSetFiles,
        ];


        const sanitizeInteger = (value) => (value ? Number(value) : null);
        const sanitizeDate = (value) => {
          if (!value) return null;
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        const postData = {
          project_id: projectId,
          submissionType: planSetData.submissionType,
          date_received: sanitizeDate(planSetData.date_received),
          plan_link: Array.isArray(planSetData.plan_link)
            ? planSetData.plan_link[0]
            : planSetData.plan_link,
          planFiles: JSON.stringify(combinedFiles),
          plan_date: sanitizeDate(planSetData.plan_date),
          rev_status: planSetData.rev_status,
          plan_reviewed_date: sanitizeDate(planSetData.plan_reviewed_date),
          plan_reviewed_by: sanitizeInteger(planSetData.plan_reviewed_by),
          data_collocated_date: sanitizeDate(planSetData.data_collocated_date),
          plan_revision_notes: planSetData.plan_revision_notes,
          planType: planSetData.planType,
        };

        const updated = await projectServices.updateProjectPlanSetById(id, postData);
        if (updated) updatedResults.push(updated);
      }

      return res.status(200).json({
        status: true,
        message: "Plan Set updated successfully (files replaced/deleted)",
        data: updatedResults,
      });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Updating project plan sets failed",
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

  async uploadProjectFile(req, res) {
    try {
      const projectId = req.query.projectId;
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
          project_id: project.id,
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
