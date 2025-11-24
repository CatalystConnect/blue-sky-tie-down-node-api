'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "admin",
          guard_name: "api",
          is_hidden: false,
          access: JSON.stringify({
            CRM: {
              USERS: ["USERS"],
              LEADS: ["LEADS"],
              COMPANY: ["COMPANY"],
              CONTACT: ["CONTACT"],
              PROJECTS: {
                LIST: ["LIST"],
                DATA_COLLECTION_FORM: ["DATA_COLLECTION_FORM"],
                TAKEOFF_APPROVAL_FORM: ["TAKEOFF_APPROVAL_FORM"],
                ASSIGNED_TAKEOFFS_OVERVIEW: ["ASSIGNED_TAKEOFFS_OVERVIEW"],
                LEAD_PRICING_LIST: ["LEAD_PRICING_LIST"],
              },
              PROJECT: {
                LIST: ["LIST"],
                DATA_COLLECTION: ["DATA_COLLECTION"],
                TAKEOFF_APPROVAL: ["TAKEOFF_APPROVAL"],
                ASSIGNED_TAKEOFFS_OVERVIEW: ["ASSIGNED_TAKEOFFS_OVERVIEW"],
                LEAD_PRICING_LIST: ["LEAD_PRICING_LIST"],
              },
            },
            SALES: {
              BUDGET_BOOK: ["BUDGET_BOOK"],
            },
            TEAM: {
              TEAM: ["TEAM"],
            },
            INVENTORY: {
              VENDOR: ["VENDOR"],
              WAREHOUSE: ["WAREHOUSE"],
            },
            SETTINGS: {
              LEAD: {
                LEADS_STATUS: ["LEADS_STATUS"],
                LEADS_TYPE: ["LEADS_TYPE"],
                LEADS_TAGS: ["LEADS_TAGS"],
                INTERACTION_TYPE: ["INTERACTION_TYPE"],
              },
              ITEM: {
                BRANDS: ["BRANDS"],
                PRODUCT_TAGS: ["PRODUCT_TAGS"],
                UNITS: ["UNITS"],
              },
              BUDGET: {
                BUDGET_BOOK_SCOPE: ["BUDGET_BOOK_SCOPE"],
                BUDGET_CATEGORY: ["BUDGET_CATEGORY"],
                KEY_AREAS: ["KEY_AREAS"],
              },
              SYSTEM: {
                COMPANY_TYPE: ["COMPANY_TYPE"],
                DEPARTMENT: ["DEPARTMENT"],
                TERMS_CODES: ["TERMS_CODES"],
                ZIP_CODE: ["ZIP_CODE"],
              },
              PIPELINE_SETTINGS: {
                PIPELINE: ["PIPELINE"],
                GROUP: ["GROUP"],
              },
              ROLE: ["ROLE"],
              TEAM: ["TEAM"],
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
    );
  },

  async down (queryInterface, Sequelize) {
     return queryInterface.bulkDelete("roles", null, {});
  }
};
