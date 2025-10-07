const ACCESS_MODULES = {
  HOME: {
    HOME: "Home",
  },

  CRM: {
    USERS: "Users",
    LEADS: "Leads",
    COMPANY: "Company",
    CONTACT: "Contact",
    PROJECTS: {
      LIST: "List",
      DATA_COLLECTION_FORM: "DataCollectionForm",
      TAKEOFF_APPROVAL_FORM: "TakeoffApprovalForm",
      ASSIGNED_TAKEOFFS_OVERVIEW: "AssignedTakeoffsOverview",
      LEAD_PRICING_LIST: "LeadPricingList",
    },
  },

  SALES: {
    BUDGET_BOOK: "BudgetBook",
  },

  INVENTORY: {
    VENDOR: "Vendor",
    WAREHOUSE: "Warehouse",
  },

  SETTINGS: {
    LEAD: {
      LEADS_STATUS: "LeadsStatus",
      LEADS_TYPE: "LeadsType",
      LEADS_TAGS: "LeadsTags",
      INTERACTION_TYPE: "InteractionType",
    },
    ITEM: {
      BRANDS: "Brands",
      PRODUCT_TAGS: "ProductTags",
      UNITS: "Units",
    },
    BUDGET: {
      BUDGET_BOOK_SCOPE: "BudgetBookScope",
      BUDGET_CATEGORY: "BudgetCategory",
      KEY_AREAS: "KeyAreas",
    },
    SYSTEM: {
      COMPANY_TYPE: "CompanyType",
      DEPARTMENT: "Department",
      TERMS_CODES: "TermsCodes",
      ZIP_CODE: "ZipCode",
    },
    PIPELINE_SETTINGS: {
      PIPELINE: "Pipeline",
      GROUP: "Group",
    },
  },

  ROLE: {
    ROLE: "Role",
  },

  TEAM: {
    TEAM: "Team",
  },
};
const PROJECT_STATUS = {
  LEAD: "Lead",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const TAKEOFF_STATUS = {
  NEW: "new",
  PROJECT_DATA_COLLECTED: "ProjectDataCollected",
  TAKEOFF_ASSIGNED: "TakeoffAssigned",
  TAKEOFF_IN_PROGRESS: "TakeoffInProgress",
  TAKEOFF_COMPLETED: "TakeoffCompleted",
};
module.exports = {
  ACCESS_MODULES,
};
