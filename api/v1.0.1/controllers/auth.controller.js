require("dotenv").config();
var commonHelper = require("../helper/common.helper");
var bcrypt = require("bcryptjs");
const config = require("../../../config/db.config");
var jwt = require("jsonwebtoken");
const authServices = require("../services/auth.services");
const { check, validationResult } = require("express-validator"); // Updated import
const { access } = require("fs");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");
module.exports = {
  /*user register*/
  async register(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const data = req.body;

      // const existingUser = await db.userObj.findOne({
      //   where: {
      //     [Op.or]: [{ email: data.email }, { phone: data.phone }],
      //   },
      // });

      // if (existingUser) {
      //   return res.status(400).json({
      //     status: false,
      //     message: "Email or phone number already exists",
      //     data: {},
      //   });
      // }
      let postData = {
        name: data.name,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8),
        role: data.role_id,
        phone: data.phone,
        department_id: data.department_id ? Number(data.department_id) : null,
        status: data.status || "active",
        address: data.address,
        userHourlyRate: data.userHourlyRate,
        userType: data.userType || "internal",
        avatar: req.files.avatar
          ? `files/${req.files.avatar[0].filename}`
          : null,
      };

      commonHelper.removeFalsyKeys(postData);
      await authServices.register(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(null, "User registered successfully")
        );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Register failed",
        data: error.response?.data || {},
      });
    }
  },

  /*user login*/
  async login(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let { email, password } = req.body;
      const getUserInfo = await authServices.getUserByEmail(email);
      if (!getUserInfo) throw new Error("User not found");
      let dbPassword = getUserInfo.password;
      var passwordIsValid = bcrypt.compareSync(password, dbPassword);
      if (!passwordIsValid) throw new Error("Invalid password!");

      const roleName = getUserInfo["roles.name"];
      const roleAccess = JSON.parse(getUserInfo["roles.access"] || "[]");

      const payload = {
        id: getUserInfo.id,
        name: getUserInfo.name,
        role: getUserInfo.role,
        roleName: roleName,
        roleAccess: roleAccess,
      };

      var accessToken = jwt.sign(payload, config.secret, {
        expiresIn: "1d", // 24x7 hours
      });
      const { password: usesPass, ...userInfo } = getUserInfo;
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { ...userInfo, accessToken },
            "User logged in successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Login failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllUsers*/
  async getAllUsers(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let {
        page = 1,
        length = 10,
        role,
        search,
        date,
        id,
        take_all,
        per_page,
        type,
      } = req.query;

      page = parseInt(page);
      length = parseInt(length);

      if (!take_all && (page <= 0 || length <= 0)) {
        throw new Error("Page and length must be greater than 0");
      }

      const { users, total } = await authServices.getAllUsers(
        page,
        length,
        role,
        search,
        date,
        id,
        take_all,
        per_page,
        type
      );

      if (!users || users.length === 0) throw new Error("Users not found");

      const lastPage = take_all ? 1 : Math.ceil(total / length);
      const from = total > 0 ? (page - 1) * length + 1 : null;
      const to = total > 0 ? Math.min(page * length, total) : null;

      return res.status(200).send({
        status: true,
        message: "Users displayed successfully",
        data: users,
        meta: {
          current_page: page,
          from,
          last_page: lastPage,
          per_page: take_all ? total : length,
          to,
          total,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "User fetch failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getUserById*/
  async getUserById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let userId = req.query.userId;

      let user = await authServices.getUserById(userId);

      if (Array.isArray(user)) {
        user = user[0] || null;
      }

      if (!user) throw new Error("User not found");

      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        status: user.status,
        role: user.roles?.name || null,
        access: user.roles?.access || null,
        roleId: user.roles?.id || null,
        avatar: user.avatar,
        departments: user.department
          ? {
              id: user.department.id,
              name: user.department.name,
            }
          : null,
        userType: user.userType,
        userHourlyRate: user.userHourlyRate,
      };

      return res.status(200).send({
        status: true,
        message: "Record found successfully",
        data: formattedUser,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "User fetch failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateUser*/
  async updateUser(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const userId = Number(req.query.userId);
      const user = await authServices.getUserById(userId);

      if (!user) {
        return res
          .status(404)
          .send(commonHelper.parseErrorRespose({ userId: "User not found" }));
      }

      const data = req.body;
      let postData = {
        name: data.name,
        email: data.email,
        // password: bcrypt.hashSync(data.password, 8),
        role: data.role_id,
        phone: data.phone,
        department_id: data.department_id ? Number(data.department_id) : null,
        status: data.status || "active",
        address: data.address,
        userHourlyRate: data.userHourlyRate,
        userType: data.userType || "internal",
      };

      if (
        data.password &&
        data.password != null &&
        data.password != undefined &&
        data.password.trim() != "" &&
        data.password.trim() != "undefined"
      ) {
        postData.password = bcrypt.hashSync(data.password, 8);
      }

      console.log("postData", postData);

      if (req.files && req.files.avatar) {
        postData.avatar = `files/${req.files.avatar[0].filename}`;
      }

      commonHelper.removeFalsyKeys(postData);
      const updatedUser = await authServices.updateUser(postData, userId);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedUser,
            "User updated successfully"
          )
        );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "User update failed",
        data: {},
      });
    }
  },

  /*delete user*/
  async deleteUser(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let userId = req.query.userId;
      const user = await authServices.getUserById(userId);
      if (!user) throw new Error("User not found");
      const deleteUser = await authServices.deleteUser(userId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deleteUser,
            "User deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "User updated failed",
        data: error.response?.data || {},
      });
    }
  },

  validate(method) {
    switch (method) {
      case "register": {
        return [
          check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format")
            .custom(async (value) => {
              const existing = await authServices.getUserByEmail(value);
              if (existing) {
                throw new Error("Email already in use by another account");
              }
              return true;
            }),

          check("password").notEmpty().withMessage("Password is required"),
        ];
      }
      case "updateUser": {
        return [
          check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format")
            .custom(async (value, { req }) => {
              const existing = await authServices.getUserByEmail(value);
              if (existing && existing.id !== Number(req.query.userId)) {
                throw new Error("Email already in use by another account");
              }
              return true;
            }),
        ];
      }

      case "login": {
        return [
          check("email").not().isEmpty().withMessage("Email is required"),
          check("password").not().isEmpty().withMessage("Password is required"),
        ];
      }
      case "getUserById": {
        return [
          check("userId").not().isEmpty().withMessage("User id is required"),
        ];
      }
      case "forgotPassword": {
        return [
          check("email").not().isEmpty().withMessage("Email is required"),
        ];
      }
      case "getAllUsers": {
        return [
          check("role")
            .not()
            .isEmpty()
            .withMessage("Role is required")
            .isIn([
              "sales",
              "administrator",
              "super_admin",
              "qualified_contractor",
              "quality_assurance_manager, customer",
            ])
            .withMessage(
              "Invalid role! Please send these roles only sales, administrator, super_admin, qualified_contractor, quality_assurance_manager, customer"
            ),
        ];
      }
    }
  },
};
