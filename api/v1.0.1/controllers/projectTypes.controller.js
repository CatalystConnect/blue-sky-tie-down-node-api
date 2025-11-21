require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const projectTypesServices = require("../services/projectTypes.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addProjectTypes*/
  async addProjectTypes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;

      let postData = {
        user_id: req.userId,
        title: data.title,
        color: data.color,
        order: data.order,
      };
      await projectTypesServices.addProjectTypes(postData);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Add project types successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Add project types failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllProjectTypes*/
  //  async getAllProjectTypes(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     let { page = 1, per_page = 10, search = "", id = "" } = req.query;
  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     const offset = (page - 1) * per_page;

  //     const result = await projectTypesServices.getAllProjectTypes({
  //       page,
  //       per_page,
  //       search,
  //       offset,
  //       id,
  //     });

  //     return res.status(200).send(
  //       commonHelper.parseSuccessRespose(
  //         result,
  //         "Project types fetched successfully"
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error in getAllProjectTypes controller:", error.message);
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Get project types failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  // async getAllProjectTypes(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     let { page = 1, per_page = 10, search = "", id = [] } = req.query;

  //     // 🧠 Support both: id[]=1&id[]=4 OR id=1,4
  //     let ids = [];

  //     if (Array.isArray(id)) {
  //       ids = id.map((x) => parseInt(x)).filter(Boolean);
  //     } else if (typeof id === "string" && id.trim() !== "") {
  //       ids = id.split(",").map((x) => parseInt(x.trim())).filter(Boolean);
  //     }

  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     const offset = (page - 1) * per_page;

  //     const result = await projectTypesServices.getAllProjectTypes({
  //       page,
  //       per_page,
  //       search,
  //       offset,
  //       ids,
  //     });

  //     return res.status(200).send(
  //       commonHelper.parseSuccessRespose(
  //         result,
  //         "Project types fetched successfully"
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error in getAllProjectTypes controller:", error.message);
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Get project types failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  async getAllProjectTypes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let { page = 1, per_page = 10, search = "", id = [] } = req.query;

      // Parse id param into array of numbers
      let ids = [];
      if (Array.isArray(id)) {
        ids = id.map(x => parseInt(x)).filter(x => !Number.isNaN(x));
      } else if (typeof id === "string" && id.trim() !== "") {
        try {
          if (id.startsWith("[")) {
            ids = JSON.parse(id).map(x => parseInt(x)).filter(x => !Number.isNaN(x));
          } else {
            ids = id.split(",").map(x => parseInt(x.trim())).filter(x => !Number.isNaN(x));
          }
        } catch (e) {
          console.error("Invalid id format", e);
        }
      }

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      const offset = (page - 1) * per_page;

      const result = await projectTypesServices.getAllProjectTypes({
        page,
        per_page,
        search,
        offset,
        ids,   // ✅ send array here
      });

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          result,
          "Project types fetched successfully"
        )
      );
    } catch (error) {
      console.error("Error in getAllProjectTypes controller:", error.message);
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get project types failed",
        data: error.response?.data || {},
      });
    }
  },


  /*getProjectTypesById*/
  async getProjectTypesById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      const result = await projectTypesServices.getProjectTypesById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Project types fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get project types failed",
        data: error.response?.data || {},
      });
    }
  },

  /*deleteProjectTypes*/
  async deleteProjectTypes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      await projectTypesServices.deleteProjectTypes(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Project types deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete project types failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateProjectTypes*/
  async updateProjectTypes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      const data = req.body;

      const postData = {
        title: data.title,
        color: data.color,
        user_id: req.userId,
        order: data.order,
      };

      const result = await projectTypesServices.updateProjectTypes(
        id,
        postData
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Project types updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update project types failed",
        data: error.response?.data || {},
      });
    }
  },
  validate(method) {
    switch (method) {
      case "addProjectTypes": {
        return [
          check("title")
            .notEmpty()
            .withMessage("Title is required")
            .custom(async (value) => {
              const existing = await projectTypesServices.getProjectTypesByName(value);
              if (existing) throw new Error("Project type title already exists");
              return true;
            }),
        ];
      }

      case "updateProjectTypes": {
        return [
          check("title")
            .notEmpty()
            .withMessage("Title is required")
            .custom(async (value, { req }) => {
              const existing = await projectTypesServices.getProjectTypesByName(value);
              if (existing && existing.id !== parseInt(req.query.id)) {
                throw new Error("Project type title already exists");
              }
              return true;
            }),
        ];
      }
    }
  },
};
