require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const tagsServices = require("../services/tags.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addTags*/
    async addTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const postData = {
                user_id: req.userId,
                title: req.body.title,
                color: req.body.color,
                type: req.body.type || 'product',
            };


            const tag = await tagsServices.addTags(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Tag  added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Tag Categories failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllTags*/
    async getAllTags(req, res) {
        try {
            const { page = 1, per_page = 10, search = "",id  } = req.query;

            
            let tags = await tagsServices.getAllTags({
                page: parseInt(page),
                per_page: parseInt(per_page),
                search,
                id
              
            });

            return res.status(200).send({
                status: true,
                message: "Record Found",
                data: tags.data,
                meta: tags.meta
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Getting Tags failed",
                data: {}
            });
        }
    },
    /*getTagsById*/
    async getTagsById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let tagId = req.query.tagId;
            let tag = await tagsServices.getTagsById(tagId);
            if (!tag) {
                throw new Error("Tag  not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(tag, "Tag  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting Tag failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteTags*/
    async deleteTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let tagId = req.query.tagId;
            let tag = await tagsServices.getTagsById(tagId);
            if (!tag) {
                throw new Error("Tag  not found");
            }
            let tags = await tagsServices.deleteTags(tagId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(tags, "Tag deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Tag  deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateTags*/
    async updateTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let tagId = req.query.tagId;
            let tag = await tagsServices.getTagsById(tagId);
            if (!tag) {
                throw new Error("Tag not found");
            }
            let data = req.body;
            let postData = {

                title: data.title,
                color: data.color,
                type: data.type || 'product',
            }

            let tags = await tagsServices.updateTags(postData, tagId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(tags, "Tags updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Tags  updation failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addTags": {
                return [
                    check("title").not().isEmpty().withMessage("Title is Required")
                ];
            }
            case "updateTags": {
                return [
                    check("title").not().isEmpty().withMessage("Title is Required")
                ];
            }
        }
    }

}
