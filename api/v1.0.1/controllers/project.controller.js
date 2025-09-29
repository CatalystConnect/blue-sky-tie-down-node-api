require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const projectServices = require("../services/project.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProject*/
    async addProject(req, res) {
        try {
            // const errors = myValidationResult(req);
            // if (!errors.isEmpty()) {
            //     return res
            //         .status(200)
            //         .send(commonHelper.parseErrorRespose(errors.mapped()));
            // }
            let data = req.body;
            let postData = {
                user_id: req.userId,
                site_plan_id: data.site_plan_id,
                engineer_id: data.engineer_id,
                name: data.name,
                address: data.address,
                quote_date: data.quote_date,
                job_no: data.job_no,
                is_pricing: data.is_pricing || false,
                is_budget_only: data.is_budget_only || false,
                up_margin: data.up_margin,
                sp_margin: data.sp_margin,
                mc_margin: data.mc_margin,
                sw_margin: data.sw_margin,
                plan_date: data.plan_date,
                plan_status: data.plan_status,
                plan_info: data.plan_info,
                plan_note: data.plan_note,
                zip: data.zip,
                design: data.design,
                design_total: data.design_total,
                design_hr: data.design_hr,
                design_hrs: data.design_hrs,
                engineering: data.engineering,
                engineering_total: data.engineering_total,
                engineering_seal: data.engineering_seal,
                engineering_seals: data.engineering_seals,
                budget: data.budget,
                budget_total: data.budget_total,
                budget_hr: data.budget_hr,
                budget_hrs: data.budget_hrs,
                shipping: data.shipping,
                shipping_total: data.shipping_total,
                shipping_ship: data.shipping_ship,
                shipping_shipment: data.shipping_shipment,
                per_sqft: data.per_sqft,
                bldg_count: data.bldg_count,
                bldg_gsqft: data.bldg_gsqft,
                bldg_sqft: data.bldg_sqft,
                bldg_cost: data.bldg_cost,
                bldg_price: data.bldg_price,
                price: data.price,
                sw_tiedown: data.sw_tiedown,
                up_lift: data.up_lift,
                misc: data.misc,
                anchorage: data.anchorage,
                total: data.total,
                tax_id: data.tax_id,
                tax: data.tax,
                taxRate: data.taxRate,
                customer_id: data.customer_id,
                include: data.include,
                exclude: data.exclude,
                na: data.na,
                uno: data.uno,
                state: data.state,
                city: data.city,
                site_plans: data.site_plans,
                fill_in_limit: data.fill_in_limit,
                shipment_limit: data.shipment_limit,
                seal_limit: data.seal_limit,
                commission: data.commission,
                commission_rate: data.commission_rate,
                limit_notes: data.limit_notes,
                contact_id: data.contact_id,
                contact_email: data.contact_email,
                budget_book_id: data.budget_book_id,
                lead_id: data.lead_id,
                terms: data.terms,
                units: data.units,
                projectType: data.projectType,
                project_phase: data.project_phase,
                date_received: data.date_received,
                rev_status: data.rev_status,
                plan_reviewed_date: data.plan_reviewed_date,
                plan_reviewed_by: data.plan_reviewed_by,
                plan_revision_notes: data.plan_revision_notes,
                data_collocated_date: data.data_collocated_date,
                bldgs: data.bldgs,
                units_count: data.units_count,
                wind_zone: data.wind_zone,
                seismic_zone: data.seismic_zone,
                developer_id: data.developer_id,
                general_contractor_id: data.general_contractor_id,
                assign_to_budget: data.assign_to_budget,
                take_off_team_id: data.take_off_team_id,
                take_off_type: data.take_off_type,
                take_off_scope: data.take_off_scope,
                assign_date: data.assign_date
            }
            await projectServices.addProject(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Project added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project failed",
                data: error.response?.data || {}
            });
        }
    },
    // /*getAllProject*/
    async getAllProject(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let getAllProject = await projectServices.getAllProject(page, length);
            if (!getAllProject) throw new Error("Projects not found");
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getAllProject, "Projects displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting projects failed",
                data: error.response?.data || {}
            });
        }
    },
    // /*getProjectById*/
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
                .send(commonHelper.parseSuccessRespose(getProjectById, "Project displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting project failed",
                data: error.response?.data || {}
            });
        }
    },
    // /*updateProject*/
    async updateProject(req, res) {
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
                user_id: req.userId,
                site_plan_id: data.site_plan_id,
                engineer_id: data.engineer_id,
                name: data.name,
                address: data.address,
                quote_date: data.quote_date,
                job_no: data.job_no,
                is_pricing: data.is_pricing || false,
                is_budget_only: data.is_budget_only || false,
                up_margin: data.up_margin,
                sp_margin: data.sp_margin,
                mc_margin: data.mc_margin,
                sw_margin: data.sw_margin,
                plan_date: data.plan_date,
                plan_status: data.plan_status,
                plan_info: data.plan_info,
                plan_note: data.plan_note,
                zip: data.zip,
                design: data.design,
                design_total: data.design_total,
                design_hr: data.design_hr,
                design_hrs: data.design_hrs,
                engineering: data.engineering,
                engineering_total: data.engineering_total,
                engineering_seal: data.engineering_seal,
                engineering_seals: data.engineering_seals,
                budget: data.budget,
                budget_total: data.budget_total,
                budget_hr: data.budget_hr,
                budget_hrs: data.budget_hrs,
                shipping: data.shipping,
                shipping_total: data.shipping_total,
                shipping_ship: data.shipping_ship,
                shipping_shipment: data.shipping_shipment,
                per_sqft: data.per_sqft,
                bldg_count: data.bldg_count,
                bldg_gsqft: data.bldg_gsqft,
                bldg_sqft: data.bldg_sqft,
                bldg_cost: data.bldg_cost,
                bldg_price: data.bldg_price,
                price: data.price,
                sw_tiedown: data.sw_tiedown,
                up_lift: data.up_lift,
                misc: data.misc,
                anchorage: data.anchorage,
                total: data.total,
                tax_id: data.tax_id,
                tax: data.tax,
                taxRate: data.taxRate,
                customer_id: data.customer_id,
                include: data.include,
                exclude: data.exclude,
                na: data.na,
                uno: data.uno,
                state: data.state,
                city: data.city,
                site_plans: data.site_plans,
                fill_in_limit: data.fill_in_limit,
                shipment_limit: data.shipment_limit,
                seal_limit: data.seal_limit,
                commission: data.commission,
                commission_rate: data.commission_rate,
                limit_notes: data.limit_notes,
                contact_id: data.contact_id,
                contact_email: data.contact_email,
                budget_book_id: data.budget_book_id,
                lead_id: data.lead_id,
                terms: data.terms,
                units: data.units,
                projectType: data.projectType,
                project_phase: data.project_phase,
                date_received: data.date_received,
                rev_status: data.rev_status,
                plan_reviewed_date: data.plan_reviewed_date,
                plan_reviewed_by: data.plan_reviewed_by,
                plan_revision_notes: data.plan_revision_notes,
                data_collocated_date: data.data_collocated_date,
                bldgs: data.bldgs,
                units_count: data.units_count,
                wind_zone: data.wind_zone,
                seismic_zone: data.seismic_zone,
                developer_id: data.developer_id,
                general_contractor_id: data.general_contractor_id,
                assign_to_budget: data.assign_to_budget,
                take_off_team_id: data.take_off_team_id,
                take_off_type: data.take_off_type,
                take_off_scope: data.take_off_scope,
                assign_date: data.assign_date
            }
            commonHelper.removeFalsyKeys(postData);
           
            let updateProject = await projectServices.updateProject(postData, projectId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateProject, "Project updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project updation failed",
                data: error.response?.data || {}
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
                .send(commonHelper.parseSuccessRespose(deleteProject, "Project deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    // validate(method) {
    //     switch (method) {
    //         case "getProjectById": {
    //             return [
    //                 check("projectId").not().isEmpty().withMessage("ProjectId is Required")
    //             ];
    //         }
    //     }
    // }
};
