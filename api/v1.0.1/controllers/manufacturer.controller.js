require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const manufacturerServices = require("../services/manufacturer.services")
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addManufacturer*/
    async addManufacturer(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const baseUrl = "/public/files/";
                let image = req.file ? `${baseUrl}${req.file.filename}`: null;
            let postData = {
                image: image,
                slug: data.slug,
                status: data.status,
                title: data.title,
            }
            await manufacturerServices.addManufacturer(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Manufacturer add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding Manufacturer failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllManufacturer*/
    async getAllManufacturer(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let getAllManufacturer = await manufacturerServices.getAllManufacturer(page, length);
            getAllManufacturer.forEach(item => {
                if (item.image) { 
                item.image = process.env.BASE_URL + item.image
                }
            })       
            let totalManufacturer = await manufacturerServices.totalManufacturer();
            let response = {
                manufacturer: getAllManufacturer,
                totalRecords: totalManufacturer.length
            }
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "All Catalogs displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Catalog failed",
                data: error.response?.data || {}
            });
        }
    },
      /*getManufacturerById*/
      async getManufacturerById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let manufacturerId = req.query.manufacturerId
            let getManufacturerById = await manufacturerServices.getManufacturerById(manufacturerId);
            if (!getManufacturerById) throw new Error("Manufacturer not found");
            if (getManufacturerById.image != null) { 
                getManufacturerById.image = process.env.BASE_URL + getManufacturerById.image
                }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getManufacturerById, "Manufacturer displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Manufacturer failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateManufacturerById*/
    async updateManufacturerById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let manufacturerId = req.query.manufacturerId
            let getManufacturerById = await manufacturerServices.getManufacturerById(manufacturerId);
            if (!getManufacturerById) throw new Error("Manufacturer not found");
            let data = req.body;
            const baseUrl = "/public/files/";
            let image = req.file ? `${baseUrl}${req.file.filename}`: null;
            let postData = {
                image: image,
                slug: data.slug,
                status: data.status,
                title: data.title,
            }
            commonHelper.removeFalsyKeys(postData);

            let updated = await manufacturerServices.updateManufacturer(postData, manufacturerId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updated, "Manufacturer updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updated Manufacturer failed",
                data: error.response?.data || {}
            });
        }
    },
     /*deleteManufacturerById*/
     async deleteManufacturerById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let manufacturerId = req.query.manufacturerId;
            let getManufacturerById = await manufacturerServices.getManufacturerById(manufacturerId);
            if (!getManufacturerById) throw new Error("Manufacturer not found");
            let deleteManufacturer = await manufacturerServices.deleteManufacturer(manufacturerId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteManufacturer, "Manufacturer deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleted Manufacturer failed",
                data: error.response?.data || {}
            });
        }
    },

    validate(method) {
        switch (method) {
            case "addManufacturer": {
                return [
                    check("status")
                    .optional()
                    .isIn(["Active, In Active"])
                    .withMessage("Invalid status. Accepted values: Active, In Active")
                ];
            }
            case "getManufacturerById": {
                return [
                        check("manufacturerId").not().isEmpty().withMessage("manufacturerId Id is Required"),
                ];
            }
        }
    }
}


