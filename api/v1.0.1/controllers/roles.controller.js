require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const roleServices = require("../services/roles.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*add role*/
    async addRole(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const existingRole = await roleServices.getRoleByName(data.name);
            if (existingRole) {
                throw new Error("This role name already exists");
            }
            let postData = {
                name: data.name,
                guard_name: data.guard_name || null,
                is_hidden: data.is_hidden ?? false
            }
            await roleServices.addRole(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Role added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Role failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllRoles*/
    async getAllRoles(req, res) {
        try {
            let roles = await roleServices.getAllRoles();
            if (!roles) {
                throw new Error("Role not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(roles, "Roles displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting roles failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getRoleById*/
    async getRoleById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let roleId = req.query.roleId;
            let role = await roleServices.getRoleById(roleId);
            if (!role) {
                throw new Error("Role not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(role, "Role displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting roles failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateRole*/
    async updateRole(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let roleId = req.query.roleId;
            let role = await roleServices.getRoleById(roleId);
            if (!role) {
                throw new Error("Role not found");
            }
            let data = req.body;
            let postData = {
                role: data.role,
                name: data.name
            }
            commonHelper.removeFalsyKeys(postData);
            let updateRole = await roleServices.updateRole(postData, roleId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateRole, "Role updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Role updation failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteRole*/
    async deleteRole(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let roleId = req.query.roleId;
            let role = await roleServices.getRoleById(roleId);
            if (!role) {
                throw new Error("Role not found");
            }
            let deleteRole = await roleServices.deleteRole(roleId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteRole, "Role deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Role deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addRole": {
                return [
                    check("role")
                        .not()
                        .isEmpty()
                        .withMessage("Role is Required")
                        .isIn(["sales", "administrator", "super_admin", "qualified_contractor", "quality_assurance_manager"])
                        .withMessage("Invalid role! Please send these roles only sales, administrator, super_admin, qualified_contractor, quality_assurance_manager"),
                    check("name").not().isEmpty().withMessage("Name is Required"),
                ]
            }
            case "getRoleById": {
                return [
                    check("roleId").not().isEmpty().withMessage("RoleId is Required")
                ];
            }
        }
    }
};
