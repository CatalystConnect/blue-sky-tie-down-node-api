require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const departmentsServices = require("../services/departments.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addDepartments*/
  async addDepartments(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;
      let postData = {
        name: data.name,
        status: data.status || "active",
      };
      await departmentsServices.addDepartments(postData);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Add department successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Add Departments failed",
        data: error.response?.data || {},
      });
    }
  },
  /* getAllDepartments */
  async getAllDepartments(req, res) {
    try {
      let { page = 1, per_page = 10, search = "", take_all = false, id } = req.query;
      page = parseInt(page);
      let limit = parseInt(per_page);
      take_all = take_all === "true" || take_all === true;
      if (id === "" || id === undefined || id === null) {
        id = null;
      }

      const { departments, total } =
        await departmentsServices.getAllDepartments({
          page,
          limit,
          search,
          take_all,
          id
        });

      if (!departments || departments.length === 0)
        throw new Error("Departments not found");

      const lastPage = take_all ? 1 : Math.ceil(total / limit);
      const from = total > 0 ? (page - 1) * limit + 1 : 0;
      const to = total > 0 ? Math.min(page * limit, total) : 0;

      return res.status(200).send({
        status: true,
        message: "Departments displayed successfully",
        data: departments,
        meta: {
          current_page: page,
          from,
          to,
          per_page: take_all ? total : limit,
          last_page: lastPage,
          total,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get Departments failed",
        data: error.response?.data || {},
      });
    }
  },

  /* getDepartmentById */
  async getDepartmentById(req, res) {
    try {
      let { id } = req.query;

      if (!id) {
        return res
          .status(200)
          .send(
            commonHelper.parseErrorRespose({ id: "Department ID is required" })
          );
      }

      const department = await departmentsServices.getDepartmentById(id);

      if (!department) {
        return res
          .status(404)
          .send(commonHelper.parseErrorRespose({ id: "Department not found" }));
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            department,
            "Department fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get Department failed",
        data: error.response?.data || {},
      });
    }
  },
  /* deleteDepartment */
  async deleteDepartment(req, res) {
    try {
      let { id } = req.query;

      if (!id) {
        return res
          .status(200)
          .send(
            commonHelper.parseErrorRespose({ id: "Department ID is required" })
          );
      }

      const deleted = await departmentsServices.deleteDepartment(id);

      if (!deleted) {
        return res.status(404).send(
          commonHelper.parseErrorRespose({
            id: "Department not found or already deleted",
          })
        );
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Department deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete Department failed",
        data: error.response?.data || {},
      });
    }
  },
  /* updateDepartment */
  async updateDepartment(req, res) {
    try {
      let data = req.body;

      let postData = {
        id: req.query.id,
        name: data.name,
      };

      let result = await departmentsServices.updateDepartment(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Department updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update Department failed",
        data: error.response?.data || {},
      });
    }
  },
};
