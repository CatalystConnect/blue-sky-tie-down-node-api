module.exports = (sequelize, Sequelize) => {
    const project = sequelize.define(
        "projects",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            site_plan_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            engineer_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            quote_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            job_no: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_pricing: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is_budget_only: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            up_margin: { type: Sequelize.STRING, allowNull: true },
            sp_margin: { type: Sequelize.STRING, allowNull: true },
            mc_margin: { type: Sequelize.STRING, allowNull: true },
            sw_margin: { type: Sequelize.STRING, allowNull: true },
            plan_date: { type: Sequelize.STRING, allowNull: true },
            plan_status: { type: Sequelize.STRING, allowNull: true },
            plan_info: { type: Sequelize.STRING, allowNull: true },
            plan_note: { type: Sequelize.TEXT, allowNull: true },
            zip: { type: Sequelize.STRING, allowNull: true },
            design: { type: Sequelize.STRING, allowNull: true },
            design_total: { type: Sequelize.STRING, allowNull: true },
            design_hr: { type: Sequelize.STRING, allowNull: true },
            design_hrs: { type: Sequelize.STRING, allowNull: true },
            engineering: { type: Sequelize.STRING, allowNull: true },
            engineering_total: { type: Sequelize.STRING, allowNull: true },
            engineering_seal: { type: Sequelize.STRING, allowNull: true },
            engineering_seals: { type: Sequelize.STRING, allowNull: true },
            budget: { type: Sequelize.STRING, allowNull: true },
            budget_total: { type: Sequelize.STRING, allowNull: true },
            budget_hr: { type: Sequelize.STRING, allowNull: true },
            budget_hrs: { type: Sequelize.STRING, allowNull: true },
            shipping: { type: Sequelize.STRING, allowNull: true },
            shipping_total: { type: Sequelize.STRING, allowNull: true },
            shipping_ship: { type: Sequelize.STRING, allowNull: true },
            shipping_shipment: { type: Sequelize.STRING, allowNull: true },
            per_sqft: { type: Sequelize.STRING, allowNull: true },
            bldg_count: { type: Sequelize.STRING, allowNull: true },
            bldg_gsqft: { type: Sequelize.STRING, allowNull: true },
            bldg_sqft: { type: Sequelize.STRING, allowNull: true },
            bldg_cost: { type: Sequelize.STRING, allowNull: true },
            bldg_price: { type: Sequelize.STRING, allowNull: true },
            price: { type: Sequelize.STRING, allowNull: true },
            sw_tiedown: { type: Sequelize.STRING, allowNull: true },
            up_lift: { type: Sequelize.STRING, allowNull: true },
            misc: { type: Sequelize.STRING, allowNull: true },
            anchorage: { type: Sequelize.STRING, allowNull: true },
            total: { type: Sequelize.STRING, allowNull: true },
            created_at: { type: Sequelize.DATE, allowNull: true },
            updated_at: { type: Sequelize.DATE, allowNull: true },
            deleted_at: { type: Sequelize.DATE, allowNull: true },
            tax_id: { type: Sequelize.BIGINT, allowNull: true },
            tax: { type: Sequelize.STRING, allowNull: true },
            taxRate: { type: Sequelize.STRING, allowNull: true },
            customer_id: { type: Sequelize.INTEGER, allowNull: true },
            include: { type: Sequelize.STRING, allowNull: true },
            exclude: { type: Sequelize.STRING, allowNull: true },
            na: { type: Sequelize.STRING, allowNull: true },
            uno: { type: Sequelize.STRING, allowNull: true },
            state: { type: Sequelize.STRING, allowNull: true },
            city: { type: Sequelize.STRING, allowNull: true },
            site_plans: { type: Sequelize.STRING, allowNull: true },
            fill_in_limit: { type: Sequelize.STRING, allowNull: true },
            shipment_limit: { type: Sequelize.STRING, allowNull: true },
            seal_limit: { type: Sequelize.STRING, allowNull: true },
            commission: { type: Sequelize.STRING, allowNull: true },
            commission_rate: { type: Sequelize.STRING, allowNull: true },
            limit_notes: { type: Sequelize.TEXT, allowNull: true },
            contact_id: { type: Sequelize.STRING, allowNull: true },
            contact_email: { type: Sequelize.STRING, allowNull: true },
            budget_book_id: { type: Sequelize.INTEGER, allowNull: true },
            lead_id: { type: Sequelize.INTEGER, allowNull: true },
            terms: { type: Sequelize.TEXT, allowNull: true },
            units: { type: Sequelize.STRING, allowNull: true },
            projectType: { type: Sequelize.STRING, allowNull: true },

            project_phase: { type: Sequelize.STRING, allowNull: true },
            date_received: { type: Sequelize.DATEONLY, allowNull: true },
            rev_status: { type: Sequelize.STRING, allowNull: true },
            plan_reviewed_date: { type: Sequelize.DATEONLY, allowNull: true },
            plan_reviewed_by: { type: Sequelize.INTEGER, allowNull: true },
            plan_revision_notes: { type: Sequelize.TEXT, allowNull: true },
            data_collocated_date: { type: Sequelize.DATEONLY, allowNull: true },
            bldgs: { type: Sequelize.INTEGER, allowNull: true },
            units_count: { type: Sequelize.INTEGER, allowNull: true },
            wind_zone: { type: Sequelize.STRING, allowNull: true },
            seismic_zone: { type: Sequelize.STRING, allowNull: true },
            developer_id: { type: Sequelize.INTEGER, allowNull: true },
            general_contractor_id: { type: Sequelize.INTEGER, allowNull: true },
            assign_to_budget: { type: Sequelize.STRING, allowNull: true },
            take_off_team_id: { type: Sequelize.INTEGER, allowNull: true },
            take_off_type: { type: Sequelize.STRING, allowNull: true },
            take_off_scope: { type: Sequelize.STRING, allowNull: true },
            assign_date: { type: Sequelize.DATEONLY, allowNull: true },
            plan_link: { type: Sequelize.STRING, allowNull: true },
            submissionType: { type: Sequelize.STRING, allowNull: true },
            planFiles: { type: Sequelize.STRING, allowNull: true }
        },
        {timestamps: true,        
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,         
        deletedAt: "deleted_at",
        freezeTableName: true,  
      }
    );
    return project;
};
