require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const inventoryServices = require("../services/inventory.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addInventory*/
    async addInventory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let image;
            const baseUrl = "/public/files/";
            if (req.files["image"]) {
                image = `${baseUrl}${req.files["image"][0].filename}`;
            }
            let productGalleryImages = [];
            if (req.files && req.files["productGallery"]) {
                productGalleryImages = req.files["productGallery"].map(file => `${baseUrl}${file.filename}`);
            }
            let postData = {
                sku: data.sku,
                brand: data.brand,
                image: image,
                shortDescription: data.shortDescription,
                longDescription: data.longDescription,
                units: data.units,
                vendor: data.vendor
            }
            let inventory = await inventoryServices.addInventory(postData);
            for (const image of productGalleryImages) {
            let productGalleryData = {
                inventoryId: inventory.dataValues.id,
                image: image
            }
            await inventoryServices.addProductGallery(productGalleryData)
        }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Add inventory successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Add inventory failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getAllInventory*/
    async getAllInventory(req, res) {
        try {
            let {page, length} = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            const getAllInventory = await inventoryServices.getAllInventory(page, length);
            if (!getAllInventory || getAllInventory.length == 0) {
                throw new Error("Inventories not found");
            }
            getAllInventory.forEach(element => {
                if (element.image) {
                    element.image = process.env.BASE_URL + element.image;
                }
                if(element.gallery){
                    element.gallery.forEach(element => {
                        if(element.image){
                            element.image = process.env.BASE_URL + element.image;
                        }
                    })
                }
            });
            
            const totalInventories = await inventoryServices.totalInventories();
            let response = {
                inventories: getAllInventory,
                totalUsers: totalInventories.length
            }

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        response,
                        "Inventories displayed successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "User fetch failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getInventoryById*/
    async getInventoryById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let inventoryId = req.query.inventoryId;
            const getInventoryById = await inventoryServices.getInventoryById(inventoryId);
            if (!getInventoryById) throw new Error("Inventory not found");
            if (getInventoryById.image) {
                getInventoryById.image = process.env.BASE_URL + getInventoryById.image;
            }
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        getInventoryById,
                        "Inventory displayed successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Inventory fetch failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateInventorById*/
    async updateInventorById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let inventoryId = req.query.inventoryId;
            const getInventoryById = await inventoryServices.getInventoryById(inventoryId);
            if (!getInventoryById) throw new Error("Inventory not found");
            let data = req.body;
            let image;
            const baseUrl = "/public/files/";
            if (req.files["image"]) {
                image = `${baseUrl}${req.files["image"][0].filename}`;
            }
            let productGalleryImages = [];
            if (req.files && req.files["productGallery"]) {
                productGalleryImages = req.files["productGallery"].map(file => `${baseUrl}${file.filename}`);
            }
            let postData = {
                sku: data.sku,
                brand: data.brand,
                image: image,
                shortDescription: data.shortDescription,
                longDescription: data.longDescription,
                units: data.units,
                vendor: data.vendor
            }
            commonHelper.removeFalsyKeys(postData);
            const updateInventorById = await inventoryServices.updateInventorById(postData, inventoryId);
            if(productGalleryImages){
            await inventoryServices.deleteProductGallery(inventoryId)
            for (const image of productGalleryImages) {
                let productGalleryData = {
                    inventoryId: inventoryId,
                    image: image
                }
                await inventoryServices.addProductGallery(productGalleryData)
            }
        }
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        updateInventorById,
                        "Inventory updated successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Inventory updated failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteInventory*/
    async deleteInventory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let inventoryId = req.query.inventoryId;
            const getInventoryById = await inventoryServices.getInventoryById(inventoryId);
            if (!getInventoryById) throw new Error("Inventory not found");
            const deleteInventory = await inventoryServices.deleteInventory(inventoryId);
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        deleteInventory,
                        "Inventory deleted successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Inventory updated failed",
                data: error.response?.data || {}
            });
        }

    },
    validate(method) {
        switch (method) {
            case "getInventoryById": {
                return [
                    check("inventoryId").not().isEmpty().withMessage("Inventory Id is Required"),
                ];
            }
        }
    }
};
