require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const itemLinksServices = require("../services/itemLinks.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});
var { ITEM_LINK } = require("../helper/constant");
module.exports = {
    /*addItemLink*/
    async addItemLink(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { item_id, linked_item_id, type } = req.body;


            if (!Object.values(ITEM_LINK).includes(type)) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose({
                        type: { msg: 'Invalid item link type' }
                    }));
            }

            const postData = {
                item_id,
                linked_item_id,
                type,
            };

            await itemLinksServices.addItemLink(postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        postData,
                        "Item Link added successfully"
                    )
                );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Add Item Link failed",
                data: {},
            });
        }
    },
    async getAllItemLinks(req, res) {
        try {
            const { item_id } = req.query;

            const result = await itemLinksServices.getAllItemLinks({
                item_id,
            });

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        result,
                        "Item links fetched successfully"
                    )
                );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Get item links failed",
                data: {},
            });
        }
    },
    async updateItemLinks(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id, type } = req.body;

            if (!id) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose({
                        id: { msg: 'Item link id is required' }
                    }));
            }

            // ✅ validate type
            if (type && !Object.values(ITEM_LINK).includes(type)) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose({
                        type: { msg: 'Invalid item link type' }
                    }));
            }

            const updated = await itemLinksServices.updateItemLinks(id, {
                type,
            });

            if (!updated) {
                return res
                    .status(404)
                    .send(commonHelper.parseErrorRespose({
                        message: 'Item link not found'
                    }));
            }

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        updated,
                        "Item link updated successfully"
                    )
                );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Update Item Link failed",
                data: {},
            });
        }
    },
    async deleteItemLinks(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.body;

            if (!id) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose({
                        id: { msg: 'Item link id is required' }
                    }));
            }

            const deleted = await itemLinksServices.deleteItemLinks(id);

            if (!deleted) {
                return res
                    .status(404)
                    .send(commonHelper.parseErrorRespose({
                        message: 'Item link not found'
                    }));
            }

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        "",
                        "Item link deleted successfully"
                    )
                );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Delete Item Link failed",
                data: {},
            });
        }
    }



}