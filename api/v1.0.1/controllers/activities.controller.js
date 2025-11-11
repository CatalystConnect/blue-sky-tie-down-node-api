require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const activityServices = require("../services//activities.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*getActivitiesById*/
    async getActivitiesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { moduleName, activityId } = req.query;
            const activity = await activityServices.getActivitiesById(moduleName, activityId);
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        activity,
                        "Activities displayed successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching activities failed",
                data: error.response?.data || {}
            })
        }
    },
    validate(method) {
        switch (method) {
            case "getActivitiesById": {
                return [
                    check("moduleName").not().isEmpty().withMessage("Module name is required")
                    .isIn(["leadsObj", "contractObj", "workOrderObj"])
                    .withMessage("Invalid module! Please send these modules only leadsObj, contractObj, workOrderObj"),
                    check("activityId").not().isEmpty().withMessage("Activity id is required")
                ];
            }
        }
    }
};
