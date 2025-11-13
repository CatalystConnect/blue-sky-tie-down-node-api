require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../../config/config")[env];
const { Sequelize, Op } = require("sequelize");
const dbObj = new Sequelize(config.url, config);
const db = {};
db.Sequelize = Sequelize;
db.dbObj = dbObj;
db.Op = Op;

db.dbObj
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

/*Models defined*/
db.userObj = require("./users.models")(db.dbObj, Sequelize);
db.leadsObj = require("./leads.models")(db.dbObj, Sequelize);
db.leadScopeMappingsObj = require("./leadScopeMappings.models")(
  db.dbObj,
  Sequelize
);
db.leadNotesObj = require("./leadNotes.models")(db.dbObj, Sequelize);
db.rolesObj = require("./roles.model")(db.dbObj, Sequelize);
db.contractObj = require("./contract.models")(db.dbObj, Sequelize);
db.workOrderObj = require("./workOrders.models")(db.dbObj, Sequelize);
db.budgetHistoryObj = require("./budgetHistory.models")(db.dbObj, Sequelize);
db.workOrderImagesObj = require("./workOrderImages.models")(
  db.dbObj,
  Sequelize
);
db.contractRegionObj = require("./contractorRegion.models")(
  db.dbObj,
  Sequelize
);
db.workOrderCategoriesObj = require("./workOrderCategories.model")(
  db.dbObj,
  Sequelize
);
db.mergeContractsObj = require("./mergeContracts.models")(db.dbObj, Sequelize);
db.mergeContractsObj = require("./mergeContracts.models")(db.dbObj, Sequelize);
db.notesObj = require("./notes.models")(db.dbObj, Sequelize);
db.activitiesObj = require("./activities.models")(db.dbObj, Sequelize);
db.contractorVerificationObj = require("./contractorVerification.models")(
  db.dbObj,
  Sequelize
);
db.leadInteractionsObj = require("./leadInteractions.models")(
  db.dbObj,
  Sequelize
);
db.interactionsObj = require("./interactions.models")(db.dbObj, Sequelize);
db.catalogObj = require("./catalog.models")(db.dbObj, Sequelize);
db.catalogVariationsObj = require("./catalogVariations.models")(
  db.dbObj,
  Sequelize
);
db.manufacturerObj = require("./manufacturer.models")(db.dbObj, Sequelize);
db.materialObj = require("./material.models")(db.dbObj, Sequelize);
db.materialQuotesObj = require("./materialQuotes")(db.dbObj, Sequelize);
db.additionalQuotesObj = require("./additionalQuotes")(db.dbObj, Sequelize);
db.attributeObj = require("./attribute.models")(db.dbObj, Sequelize);
db.configureAttributeObj = require("./configureAttribute.models")(
  db.dbObj,
  Sequelize
);
db.productAttributeObj = require("./productAttribute.models")(
  db.dbObj,
  Sequelize
);
db.productCategoryObj = require("./productCategory.models")(
  db.dbObj,
  Sequelize
);
db.productCategoryAssociationObj = require("./productCategoryAsso.models")(
  db.dbObj,
  Sequelize
);
db.inventoryObj = require("./inventory.models")(db.dbObj, Sequelize);
db.inventoryImagesObj = require("./inventoryImages.models")(
  db.dbObj,
  Sequelize
);
db.applyWorkOrderObj = require("./applyWorkOrder.models")(db.dbObj, Sequelize);
db.catalogAttributeObj = require("./catalologAttributes.models")(
  db.dbObj,
  Sequelize
);
db.customerObj = require("./customer.models")(db.dbObj, Sequelize);
db.jwtTokenObj = require("./jwtToken.models")(db.dbObj, Sequelize);
db.projectObj = require("./project.models")(db.dbObj, Sequelize);
db.projectNotesObj = require("./projectNotes.models")(db.dbObj, Sequelize);
db.projectplanSetsObj = require("./projectPlanSet.models")(db.dbObj, Sequelize);

db.roofMeasureObj = require("./roofMeasure.models")(db.dbObj, Sequelize);
db.takeOffQuotesItemsObj = require("./takeOffQuotesItems.models")(
  db.dbObj,
  Sequelize
);
db.takeOffQuotesObj = require("./takeOffQuotes.models")(db.dbObj, Sequelize);
db.chatObj = require("./chat.models")(db.dbObj, Sequelize);
db.brandObj = require("./brands.models")(db.dbObj, Sequelize);
db.leadScopesObj = require("./leadScopes.models")(db.dbObj, Sequelize);
db.unitObj = require("./units.models")(db.dbObj, Sequelize);
db.vendorsObj = require("./vendors.models")(db.dbObj, Sequelize);
db.productCategoriesObj = require("./productCategories.models")(
  db.dbObj,
  Sequelize
);
db.tagsObj = require("./tags.models")(db.dbObj, Sequelize);
db.itemObj = require("./item.models")(db.dbObj, Sequelize);
db.companyObj = require("./company.models")(db.dbObj, Sequelize);
db.brandItemObj = require("./itemBrands.models")(db.dbObj, Sequelize);
db.itemImagesObj = require("./itemImages.models")(db.dbObj, Sequelize);
db.itemTagObj = require("./itemTags.models")(db.dbObj, Sequelize);
db.itemCategoriesObj = require("./itemCategories.models")(db.dbObj, Sequelize);
db.itemUnitsObj = require("./itemUnits.models")(db.dbObj, Sequelize);
db.itemVendorObj = require("./itemVendors.models")(db.dbObj, Sequelize);
db.itemWebsObj = require("./itemWebs.models")(db.dbObj, Sequelize);
db.saleMaterialQuotesObj = require("./saleMaterialQuotes.models")(
  db.dbObj,
  Sequelize
);
db.SaleMaterialQuoteHeaderTabsObj =
  require("./saleMaterialQuoteHeaderTabs.models")(db.dbObj, Sequelize);
db.companyTypeObj = require("./companyType.models")(db.dbObj, Sequelize);
db.saleAdditionalQuotesObj = require("./saleMaterialQuoteAdditionals.models")(
  db.dbObj,
  Sequelize
);
db.saleAdditionalQuotesitemObj = require("./saleMaterialQuoteItems.models")(
  db.dbObj,
  Sequelize
);
db.generatedContractorsObj = require("./generatedContractors.models")(
  db.dbObj,
  Sequelize
);
db.wareHouseObj = require("./wareHouse.models")(db.dbObj, Sequelize);
db.taxesObj = require("./taxes.models")(db.dbObj, Sequelize);
db.serviceTypeitemsObj = require("./serviceTypeItem.models")(
  db.dbObj,
  Sequelize
);
db.projectImagesObj = require("./projectImages.models")(db.dbObj, Sequelize);
db.warehouseItemsObj = require("./warehouseItems.models")(db.dbObj, Sequelize);
db.departmentObj = require("./departments.models")(db.dbObj, Sequelize);
db.leadStatusesObj = require("./leadStatuses.models")(db.dbObj, Sequelize);
db.leadTagsObj = require("./leadTags.models")(db.dbObj, Sequelize);
db.projectTypesObj = require("./projectTypes.models")(db.dbObj, Sequelize);
db.ticketsObj = require("./tickets.models")(db.dbObj, Sequelize);

db.leadTeamsObj = require("./leadTeams.models")(db.dbObj, Sequelize);
db.leadTeamsMemberObj = require("./leadTeamMembers.models")(
  db.dbObj,
  Sequelize
);
db.leadTypesObj = require("./leadTypes.models")(db.dbObj, Sequelize);
db.teamsCodesObj = require("./termsCodes.models")(db.dbObj, Sequelize);

db.interactionTypesObj = require("./interactionTypes.models")(
  db.dbObj,
  Sequelize
);
db.contactsObj = require("./contacts.models")(db.dbObj, Sequelize);
db.salesPipelineGroupsObj = require("./salesPipelineGroups.models")(
  db.dbObj,
  Sequelize
);
db.salesPipelinesObj = require("./salesPipelines.models")(db.dbObj, Sequelize);
db.salesPipelinesStatusesObj = require("./salesPipelineStatuses.models")(
  db.dbObj,
  Sequelize
);
db.salesPipelinesTriggersObj = require("./salesPipelineTriggers.models")(
  db.dbObj,
  Sequelize
);
db.salesPipelinesDelayIndicatorsObj =
  require("./salesPipelineDelayIndicators.models")(db.dbObj, Sequelize);

db.budgetKeyAreasObj = require("./budgetKeyAreas.models")(db.dbObj, Sequelize);
db.budgetCategoryObj = require("./budgetCategory.models")(db.dbObj, Sequelize);
db.budgetScopeObj = require("./budgetScope.models")(db.dbObj, Sequelize);
db.scopeCategoryObj = require("./scopeCategory.models")(db.dbObj, Sequelize);
db.scopeGroupObj = require("./scopeGroup.models")(db.dbObj, Sequelize);
db.scopeSegmentObj = require("./scopeSegment.models")(db.dbObj, Sequelize);
db.budgetBooksScopeIncludesObj = require("./budgetBooksScopeIncludes.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksContractsObj = require("./budgetBooksContracts.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksKeyAreasObj = require("./budgetBooksKeyAreas.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksDrawingsObj = require("./budgetBooksDrawings.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksObj = require("./budgetBooks.models")(db.dbObj, Sequelize);
db.sitePlansObj = require("./sitePlans.models")(db.dbObj, Sequelize);
db.budgetBooksSitesObj = require("./budgetBooksSites.models")(
  db.dbObj,
  Sequelize
);
db.projectBudgetsObj = require("./projectBudgets.models")(db.dbObj, Sequelize);
db.budgetBookOthersObj = require("./budgetBookOthers.models")(
  db.dbObj,
  Sequelize
);
db.sitePlanItemsObj = require("./sitePlanItems.models")(db.dbObj, Sequelize);
db.veOptionsObj = require("./veOptions.models")(db.dbObj, Sequelize);
db.optionPackageObj = require("./optionPackage.models")(db.dbObj, Sequelize);
db.submittalsObj = require("./submittals.models")(db.dbObj, Sequelize);
db.contractComponentsObj = require("./contractComponents.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksScopesObj = require("./budgetBooksScopes.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksScopeCategoriesObj =
  require("./budgetBooksScopeCategories.models")(db.dbObj, Sequelize);
db.budgetBooksScopeGroupsObj = require("./budgetBooksScopeGroups.models")(
  db.dbObj,
  Sequelize
);
db.budgetBooksScopeSegmentsObj = require("./budgetBooksScopeSegments.models")(
  db.dbObj,
  Sequelize
);
db.budgetBookDocumentsObj = require("./budgetBookDocuments.models")(
  db.dbObj,
  Sequelize
);
db.projectPhasesObj = require("./projectPhases.models")(db.dbObj, Sequelize);
db.projectTagsObj = require("./projectTags.models")(db.dbObj, Sequelize);
db.stateObj = require("./state.models")(db.dbObj, Sequelize);
db.projectTagMappingsObj = require("./projectTagMappings.models")(
  db.dbObj,
  Sequelize
);
db.gDriveAssociationObj = require("./gDriveAssociation.models")(
  db.dbObj,
  Sequelize
);
db.projectTypeMappingsObj = require("./projectTypeMappings.models")(
  db.dbObj,
  Sequelize
);
db.budgetHistoryObj = require("./budgetHistory.models")(db.dbObj, Sequelize);

/*Associations*/
db.projectObj.belongsTo(db.taxesObj, {
  foreignKey: "zip",
  as: "zipCodeDetails",
});
db.interactionsObj.belongsTo(db.userObj, {
  foreignKey: "user_id",
  as: "userInteractions",
});
db.interactionsObj.belongsTo(db.contactsObj, {
  foreignKey: "contact_id",
  as: "contactInteractions",
});
db.interactionsObj.belongsTo(db.interactionTypesObj, {
  foreignKey: "interaction_type_id",
  as: "interactionTypes",
});
db.projectObj.belongsTo(db.taxesObj, {
  foreignKey: "state",
  as: "stateDetails",
});

// db.budgetBooksObj.belongsTo(db.projectObj, {
//   foreignKey: "project_id",
//   as: "budgetProject",
// });

// db.budgetBooksObj.belongsTo(db.leadsObj, {
//   foreignKey: "lead_id",
//   as: "budgetLead",
// });
db.leadsObj.hasMany(db.leadScopeMappingsObj, {
  foreignKey: "lead_id",
  as: "leadScopeMappings",
});
db.leadScopeMappingsObj.belongsTo(db.leadScopesObj, {
  foreignKey: "lead_scope_id",
  as: "leadScopes",
});
db.sitePlansObj.hasMany(db.budgetBookOthersObj, {
  foreignKey: "site_plan_id",
  as: "budgetBookOthers",
});
// db.budgetBookOthersObj.belongsTo(db.sitePlansObj, {
//   foreignKey: "site_plan_id",
//   as: "budgetBookOthersData",
// });
// budgetBooksObj model
db.budgetBooksObj.belongsTo(db.companyObj, {
  foreignKey: "engineer_id",
  as: "engineer",
});
db.budgetBooksObj.belongsTo(db.projectObj, {
  foreignKey: "project_id",
  as: "budgetProject",
});
db.projectObj.hasMany(db.budgetBooksObj, {
  foreignKey: "project_id",
  as: "budgetBook",
});
db.budgetBooksObj.belongsTo(db.leadsObj, {
  foreignKey: "lead_id",
  as: "budgetLead",
});
db.budgetBooksObj.hasMany(db.veOptionsObj, {
  foreignKey: "budget_books_id",
  as: "veOptions",
});
db.budgetBooksObj.hasMany(db.optionPackageObj, {
  foreignKey: "budget_books_id",
  as: "optionPackages",
});
db.budgetBooksObj.hasMany(db.sitePlansObj, {
  foreignKey: "budget_books_id",
  as: "sitePlan",
});
db.budgetBooksObj.hasMany(db.sitePlanItemsObj, {
  foreignKey: "budget_books_id",
  as: "sitePlan2",
});
db.budgetBooksObj.hasMany(db.projectBudgetsObj, {
  foreignKey: "budget_books_id",
  as: "budgets",
});
db.budgetBooksObj.hasMany(db.budgetBooksSitesObj, {
  foreignKey: "budget_books_id",
  as: "sites",
});
db.budgetBooksObj.hasMany(db.budgetBooksScopesObj, {
  foreignKey: "budget_books_id",
  as: "projectScopes",
});

db.budgetBooksScopesObj.hasMany(db.budgetBooksScopeCategoriesObj, {
  foreignKey: "budget_books_scope_id",
  as: "categories",
});
db.budgetBooksScopeCategoriesObj.hasMany(db.budgetBooksScopeGroupsObj, {
  foreignKey: "budget_books_scope_category_id",
  as: "groups",
});
db.budgetBooksScopeGroupsObj.hasMany(db.budgetBooksScopeSegmentsObj, {
  foreignKey: "budget_books_scope_group_id",
  as: "segments",
});
db.budgetBooksScopeSegmentsObj.belongsTo(db.scopeSegmentObj, {
  foreignKey: "scope_sagment_id",
  as: "scopeSagment",
});
db.budgetBooksScopesObj.belongsTo(db.budgetScopeObj, {
  foreignKey: "scope_id",
  as: "scope",
});
db.budgetScopeObj.belongsTo(db.budgetCategoryObj, {
  foreignKey: "category_id",
  as: "budgetCategory",
});

db.budgetBooksScopeCategoriesObj.belongsTo(db.scopeCategoryObj, {
  foreignKey: "scope_category_id",
  as: "scopeCategory",
});
db.budgetBooksScopeGroupsObj.belongsTo(db.scopeGroupObj, {
  foreignKey: "scope_group_id",
  as: "scopeGroup",
});

db.budgetBooksObj.hasMany(db.budgetBooksScopeIncludesObj, {
  foreignKey: "budget_books_id",
  as: "budgetBooksScopeIncludes",
});

db.budgetBooksObj.hasMany(db.budgetBooksContractsObj, {
  foreignKey: "budget_books_id",
  as: "budgetBooksContracts",
});
db.budgetBooksContractsObj.belongsTo(db.contractComponentsObj, {
  foreignKey: "contract_component_id",
  as: "contractComponents",
});
db.budgetBooksKeyAreasObj.belongsTo(db.budgetKeyAreasObj, {
  foreignKey: "key_area_id",
  as: "budgetKeyAreas",
});
db.budgetBooksDrawingsObj.belongsTo(db.submittalsObj, {
  foreignKey: "submittal_id",
  as: "submittals",
});
db.budgetBooksObj.hasMany(db.budgetBooksKeyAreasObj, {
  foreignKey: "budget_books_id",
  as: "budgetBooksKeyAreas",
});
db.budgetBooksObj.hasMany(db.budgetBooksDrawingsObj, {
  foreignKey: "budget_books_id",
  as: "budgetBooksDrawings",
});

db.salesPipelinesTriggersObj.belongsTo(db.salesPipelinesStatusesObj, {
  foreignKey: "field_value",
  as: "pipelinesStatuses",
});
db.salesPipelinesStatusesObj.hasMany(db.salesPipelinesTriggersObj, {
  foreignKey: "field_value",
  as: "pipelinesStatusesData",
});

db.salesPipelinesObj.hasMany(db.salesPipelinesDelayIndicatorsObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesDelayIndicators",
});
db.salesPipelinesDelayIndicatorsObj.belongsTo(db.salesPipelinesObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesDelayIndicatorsData",
});

db.salesPipelinesObj.hasMany(db.salesPipelinesTriggersObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesTriggers",
});
db.salesPipelinesTriggersObj.belongsTo(db.salesPipelinesObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesTriggersData",
});

db.salesPipelinesObj.hasMany(db.salesPipelinesStatusesObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesStatuses",
});
db.salesPipelinesStatusesObj.belongsTo(db.salesPipelinesObj, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipelinesStatusesData",
});

db.salesPipelinesObj.belongsTo(db.salesPipelineGroupsObj, {
  foreignKey: "sales_pipeline_group_id",
  as: "salesPipelineGroups",
});

db.salesPipelineGroupsObj.hasMany(db.salesPipelinesObj, {
  foreignKey: "sales_pipeline_group_id",
  as: "salesPipelineGroupsData",
});

db.leadTeamsObj.belongsTo(db.userObj, {
  foreignKey: "contact_id",
  as: "contactDetails",
});

db.userObj.hasMany(db.leadTeamsObj, {
  foreignKey: "contact_id",
  as: "leadUser",
});

db.warehouseItemsObj.belongsTo(db.contractObj, {
  foreignKey: "contractor_id",
  as: "contractorData",
});
db.contractObj.hasMany(db.warehouseItemsObj, {
  foreignKey: "contractor_id",
  as: "warehouseItemsData",
});

db.workOrderObj.hasMany(db.workOrderImagesObj, {
  foreignKey: "workOrderId",
  as: "images",
});
db.workOrderImagesObj.belongsTo(db.workOrderObj, {
  foreignKey: "workOrderId",
  as: "images",
});

db.contractRegionObj.hasMany(db.workOrderObj, {
  foreignKey: "region",
  as: "regions",
});
db.workOrderObj.belongsTo(db.contractRegionObj, {
  foreignKey: "region",
  as: "regions",
});

db.contractObj.hasMany(db.leadInteractionsObj, {
  foreignKey: "contractId",
  as: "interactions",
});
db.leadInteractionsObj.belongsTo(db.contractObj, {
  foreignKey: "contractId",
  as: "interactions",
});

db.contractObj.hasMany(db.leadInteractionsObj, {
  foreignKey: "contractId",
  as: "interactionCount",
});
db.leadInteractionsObj.belongsTo(db.contractObj, {
  foreignKey: "contractId",
  as: "interactionCount",
});

db.catalogObj.hasMany(db.catalogVariationsObj, {
  foreignKey: "catalogId",
  as: "variations",
});
db.catalogVariationsObj.belongsTo(db.catalogObj, {
  foreignKey: "catalogId",
  as: "variations",
});

db.materialObj.hasMany(db.materialQuotesObj, {
  foreignKey: "materialId",
  as: "materialQuotes",
});
db.materialQuotesObj.belongsTo(db.materialObj, {
  foreignKey: "materialId",
  as: "materialQuotes",
});

db.materialObj.hasMany(db.additionalQuotesObj, {
  foreignKey: "materialId",
  as: "additionalQuotes",
});
db.additionalQuotesObj.belongsTo(db.materialObj, {
  foreignKey: "materialId",
  as: "additionalQuotes",
});

db.attributeObj.hasMany(db.configureAttributeObj, {
  foreignKey: "attributeId",
  as: "configAttributes",
});
db.configureAttributeObj.belongsTo(db.attributeObj, {
  foreignKey: "attributeId",
  as: "configAttributes",
});

db.catalogObj.hasMany(db.productAttributeObj, {
  foreignKey: "productId",
  as: "productAttributes",
});
db.productAttributeObj.belongsTo(db.catalogObj, {
  foreignKey: "productId",
  as: "productAttributes",
});

db.inventoryObj.hasMany(db.inventoryImagesObj, {
  foreignKey: "inventoryId",
  as: "gallery",
});
db.inventoryImagesObj.belongsTo(db.inventoryObj, {
  foreignKey: "inventoryId",
  as: "gallery",
});

db.catalogObj.hasMany(db.catalogAttributeObj, {
  foreignKey: "catalogId",
  as: "attributes",
});
db.catalogAttributeObj.belongsTo(db.catalogObj, {
  foreignKey: "catalogId",
  as: "attributes",
});

db.workOrderObj.hasMany(db.applyWorkOrderObj, {
  foreignKey: "workOrderId",
  as: "biders",
});
db.applyWorkOrderObj.belongsTo(db.workOrderObj, {
  foreignKey: "workOrderId",
  as: "biders",
});

db.userObj.hasMany(db.applyWorkOrderObj, {
  foreignKey: "contractorId",
  as: "applyWorkOrders",
});
db.applyWorkOrderObj.belongsTo(db.userObj, {
  foreignKey: "contractorId",
  as: "contractorInfo",
});

// Category → Association
db.productCategoryObj.hasMany(db.productCategoryAssociationObj, {
  foreignKey: "categoryId",
  as: "product",
});

// Association → Category
db.productCategoryAssociationObj.belongsTo(db.productCategoryObj, {
  foreignKey: "categoryId", // FIXED TYPO HERE
  as: "category",
});

// Association → Product
db.productCategoryAssociationObj.belongsTo(db.catalogObj, {
  foreignKey: "productId",
  as: "productDetails",
});

db.takeOffQuotesObj.hasMany(db.takeOffQuotesItemsObj, {
  foreignKey: "quoteId",
  as: "quotes",
});
db.takeOffQuotesItemsObj.belongsTo(db.takeOffQuotesObj, {
  foreignKey: "quoteId",
  as: "quotes",
});

db.catalogObj.hasMany(db.catalogVariationsObj, {
  foreignKey: "catalogId",
  as: "variation",
});
db.catalogVariationsObj.belongsTo(db.catalogObj, {
  foreignKey: "catalogId",
  as: "variation",
});

db.workOrderObj.hasMany(db.applyWorkOrderObj, {
  foreignKey: "workOrderId",
  as: "workOrders",
});
db.applyWorkOrderObj.belongsTo(db.workOrderObj, {
  foreignKey: "workOrderId",
  as: "workOrders",
});

db.userObj.hasMany(db.applyWorkOrderObj, {
  foreignKey: "contractorId",
  as: "contractor",
});
db.applyWorkOrderObj.belongsTo(db.userObj, {
  foreignKey: "contractorId",
  as: "contractor",
});

db.itemObj.hasMany(db.itemCategoriesObj, {
  foreignKey: "item_id",
  as: "item_categories",
});
db.itemObj.hasMany(db.itemTagObj, { foreignKey: "item_id", as: "item_tags" });
db.itemObj.hasMany(db.itemUnitsObj, {
  foreignKey: "item_id",
  as: "item_units",
});
db.itemObj.hasMany(db.itemVendorObj, {
  foreignKey: "item_id",
  as: "item_vendors",
});
db.itemObj.hasMany(db.itemWebsObj, { foreignKey: "item_id", as: "item_webs" });
db.itemObj.hasMany(db.itemImagesObj, {
  foreignKey: "item_id",
  as: "item_images",
});
db.itemObj.belongsTo(db.brandItemObj, {
  foreignKey: "brand_id",
  as: "item_brands",
});
db.itemUnitsObj.belongsTo(db.unitObj, { foreignKey: "unit_id", as: "unit" });
// db.leadsObj.belongsTo(db.userObj, { foreignKey: "customerId", as: "customer" });
// db.userObj.hasMany(db.leadsObj, { foreignKey: "customerId", as: "leads" });
db.leadsObj.hasMany(db.projectImagesObj, {
  foreignKey: "lead_id",
  as: "projectImages",
});

db.leadsObj.belongsTo(db.userObj, {
  foreignKey: "sale_person_id",
  as: "salesPersons",
});

db.itemUnitsObj.belongsTo(db.unitObj, { foreignKey: "unit_id", as: "base" });

// db.leadsObj.hasMany(db.generatedContractorsObj, {
//   foreignKey: "contractor_id",
//   as: "leadContractors"
// });

// company relation
db.saleMaterialQuotesObj.belongsTo(db.userObj, {
  foreignKey: "customer_id",
  as: "customer",
});

db.userObj.hasMany(db.saleMaterialQuotesObj, {
  foreignKey: "customer_id",
  as: "quotes",
});

// headerTabs relation
db.saleMaterialQuotesObj.hasMany(db.SaleMaterialQuoteHeaderTabsObj, {
  as: "headerTabs",
  foreignKey: "material_quote_id",
});

// additionalQuotes relation
db.saleMaterialQuotesObj.hasMany(db.saleAdditionalQuotesObj, {
  as: "additionalQuotes",
  foreignKey: "material_quote_id",
});

// additionalQuoteItems relation
db.saleAdditionalQuotesObj.hasMany(db.saleAdditionalQuotesitemObj, {
  as: "additionalQuoteItems",
  foreignKey: "material_quote_id",
});

// // item relation
db.saleMaterialQuotesObj.hasMany(db.saleAdditionalQuotesitemObj, {
  as: "item",
  foreignKey: "material_quote_id",
});

db.saleAdditionalQuotesitemObj.belongsTo(db.unitObj, {
  foreignKey: "uom",
  as: "unitData",
});
db.unitObj.hasMany(db.saleAdditionalQuotesitemObj, {
  foreignKey: "uom",
  as: "unitDatas",
});

// company relation (if needed separately for companyId)
db.saleMaterialQuotesObj.belongsTo(db.companyObj, {
  as: "company",
  foreignKey: "customer_id",
});

// db.leadsObj.hasMany(db.saleMaterialQuotesObj, {
//   foreignKey: "lead_project_id",
//   as: "quotes"
// });

// db.saleMaterialQuotesObj.belongsTo(db.leadsObj, {
//   foreignKey: "lead_project_id",
//   as: "lead"
// });

// Lead → Quotes (One-to-Many)
db.leadsObj.hasMany(db.saleMaterialQuotesObj, {
  foreignKey: "lead_project_id",
  as: "quotes",
});
db.saleMaterialQuotesObj.belongsTo(db.leadsObj, {
  foreignKey: "lead_project_id",
  as: "lead",
});

// Contractor → Quotes (One-to-Many)
db.contractObj.hasMany(db.saleMaterialQuotesObj, {
  foreignKey: "contractor_id",
  as: "quotes",
});
db.saleMaterialQuotesObj.belongsTo(db.contractObj, {
  foreignKey: "contractor_id",
  targetKey: "id",
  as: "contractor",
});

db.saleMaterialQuotesObj.hasMany(db.saleAdditionalQuotesitemObj, {
  as: "items",
  foreignKey: "material_quote_id",
});
db.saleAdditionalQuotesitemObj.belongsTo(db.saleMaterialQuotesObj, {
  as: "saleMaterialQuote",
  foreignKey: "material_quote_id",
});

// 2. Each additional quote item belongs to an item
db.saleAdditionalQuotesitemObj.belongsTo(db.itemObj, {
  as: "itemDetails",
  foreignKey: "item",
});
db.itemObj.hasMany(db.saleAdditionalQuotesitemObj, {
  as: "additionalQuoteItems",
  foreignKey: "item",
});

// 3. Each item can have multiple units
db.itemObj.hasMany(db.itemUnitsObj, {
  as: "units",
  foreignKey: "item_id",
});
db.itemUnitsObj.belongsTo(db.itemObj, {
  as: "item",
  foreignKey: "item_id",
});

db.generatedContractorsObj.belongsTo(db.leadsObj, {
  foreignKey: "lead_id",
  as: "lead",
});
db.leadsObj.hasMany(db.generatedContractorsObj, {
  foreignKey: "lead_id",
  as: "leadContractors",
});

db.generatedContractorsObj.belongsTo(db.saleMaterialQuotesObj, {
  foreignKey: "sale_material_quotes_id",
  as: "saleMaterialQuote",
});
db.generatedContractorsObj.belongsTo(db.contractObj, {
  foreignKey: "contractor_id",
  as: "contractor",
});

db.leadsObj.hasMany(db.generatedContractorsObj, {
  foreignKey: "lead_id",
  as: "generatedContractors",
});

db.generatedContractorsObj.belongsTo(db.leadsObj, {
  foreignKey: "lead_id",
  as: "leadDetails",
});

db.serviceTypeitemsObj.belongsTo(db.unitObj, {
  foreignKey: "uom",
  as: "unit",
});

db.unitObj.hasMany(db.serviceTypeitemsObj, {
  foreignKey: "uom",
  as: "service_items",
});

db.serviceTypeitemsObj.belongsTo(db.itemObj, {
  foreignKey: "inventory_id",
  as: "inventory",
});

db.itemObj.hasMany(db.serviceTypeitemsObj, {
  foreignKey: "inventory_id",
  as: "serviceItems",
});

db.generatedContractorsObj.hasMany(db.notesObj, {
  foreignKey: "moduleId",
  as: "notess",
});

db.notesObj.belongsTo(db.generatedContractorsObj, {
  foreignKey: "moduleId",
  as: "contract",
});

db.itemObj.belongsTo(db.brandObj, {
  foreignKey: "brand_id",
  as: "brand",
});

db.brandObj.hasMany(db.itemObj, {
  foreignKey: "brand_id",
  as: "serviceItems",
});

db.serviceTypeitemsObj.belongsTo(db.contractObj, {
  foreignKey: "contractor",
  as: "contract",
});

db.contractObj.hasMany(db.serviceTypeitemsObj, {
  foreignKey: "contractor",
  as: "serviceItems",
});

db.userObj.belongsTo(db.departmentObj, {
  foreignKey: "department_id",
  as: "department",
});

db.departmentObj.hasMany(db.userObj, {
  foreignKey: "department_id",
  as: "users",
});

db.userObj.belongsTo(db.rolesObj, {
  foreignKey: "role",
  as: "roles",
});

db.rolesObj.hasMany(db.userObj, {
  foreignKey: "role",
  as: "usersData",
});

db.leadTagsObj.belongsTo(db.leadsObj, { foreignKey: "lead_id", as: "lead" });
db.leadsObj.hasMany(db.leadTagsObj, { foreignKey: "lead_id", as: "lead_tags" });

db.leadTagsObj.belongsTo(db.tagsObj, { foreignKey: "tag_id", as: "tag" });
db.tagsObj.hasMany(db.leadTagsObj, { foreignKey: "tag_id", as: "lead_tags" });

db.ticketsObj.belongsTo(db.leadsObj, { foreignKey: "lead_id", as: "lead" });

db.leadTeamsMemberObj.belongsTo(db.leadsObj, {
  foreignKey: "lead_id",
  as: "leads",
});

db.leadsObj.hasMany(db.leadTeamsMemberObj, {
  foreignKey: "lead_id",
  as: "leadTeamMembers",
});
db.leadTeamsMemberObj.belongsTo(db.userObj, {
  as: "userData",
  foreignKey: "user_id",
});

db.leadsObj.belongsTo(db.userObj, {
  as: "defaultAssignTeams",
  foreignKey: "defaultAssignTeam",
});

db.leadsObj.belongsTo(db.salesPipelinesObj, {
  as: "salesPipelines",
  foreignKey: "pipeline_type",
});

db.salesPipelinesObj.hasMany(db.leadsObj, {
  foreignKey: "pipeline_type",
  as: "salesPipelinesData",
});

db.leadsObj.belongsTo(db.salesPipelinesStatusesObj, {
  as: "salesPipelinesStatus",
  foreignKey: "pipeline_status",
});

db.salesPipelinesStatusesObj.hasMany(db.leadsObj, {
  foreignKey: "pipeline_status",
  as: "salesPipelinesStatusData",
});

// A user can be in many lead teams
db.userObj.hasMany(db.leadTeamsMemberObj, {
  as: "leadTeams",
  foreignKey: "user_id",
});

db.ticketsObj.belongsToMany(db.tagsObj, {
  through: "ticket_tags",
  as: "tags",
  foreignKey: "ticket_id",
});
db.tagsObj.belongsToMany(db.ticketsObj, {
  through: "ticket_tags",
  as: "tickets",
  foreignKey: "tag_id",
});

db.contactsObj.belongsTo(db.companyObj, {
  foreignKey: "company_id",
  as: "company",
});
db.companyObj.hasMany(db.contactsObj, {
  foreignKey: "company_id",
  as: "contacts",
});

// Project belongs to Company in multiple roles
db.projectObj.belongsTo(db.companyObj, {
  foreignKey: "engineer_id",
  as: "engineer",
});
db.projectObj.belongsTo(db.companyObj, {
  foreignKey: "architecture",
  as: "architect",
});
db.projectObj.belongsTo(db.companyObj, {
  foreignKey: "developer_id",
  as: "developer",
});
db.projectObj.belongsTo(db.companyObj, {
  foreignKey: "general_contractor_id",
  as: "general_contractor",
});
db.projectObj.belongsTo(db.userObj, {
  foreignKey: "plan_reviewed_by",
  as: "planReviewer",
});
db.projectplanSetsObj.belongsTo(db.userObj, {
  foreignKey: "plan_reviewed_by",
  as: "planReviewerUers",
});

// Optional: Company has many projects in each role
db.companyObj.hasMany(db.projectObj, {
  foreignKey: "engineer_id",
  as: "engineered_projects",
});
db.companyObj.hasMany(db.projectObj, {
  foreignKey: "architecture",
  as: "architected_projects",
});
db.companyObj.hasMany(db.projectObj, {
  foreignKey: "developer_id",
  as: "developed_projects",
});
db.companyObj.hasMany(db.projectObj, {
  foreignKey: "general_contractor_id",
  as: "contracted_projects",
});
db.userObj.hasMany(db.projectObj, {
  foreignKey: "plan_reviewed_by",
  as: "reviewedProjects",
});

db.leadsObj.belongsTo(db.companyObj, {
  as: "company",
  foreignKey: "company_id",
});
db.companyObj.hasMany(db.leadsObj, {
  foreignKey: "company_id",
  as: "company_leads",
});

db.leadsObj.belongsTo(db.contactsObj, {
  as: "contact",
  foreignKey: "contact_id",
});
db.contactsObj.hasMany(db.leadsObj, {
  foreignKey: "contact_id",
  as: "contact_leads",
});

db.leadsObj.belongsTo(db.userObj, {
  as: "salePerson",
  foreignKey: "sale_person_id",
}); // singular
db.userObj.hasMany(db.leadsObj, {
  foreignKey: "sale_person_id",
  as: "sales_person_leads",
});

db.leadsObj.belongsTo(db.userObj, {
  as: "engineer",
  foreignKey: "engineer_id",
});
db.userObj.hasMany(db.leadsObj, {
  foreignKey: "engineer_id",
  as: "engineer_leads",
});

db.leadsObj.belongsTo(db.leadTeamsObj, {
  as: "leadTeam",
  foreignKey: "leadTeamId",
});
db.leadTeamsObj.hasMany(db.leadsObj, {
  foreignKey: "leadTeamId",
  as: "team_leads",
});

db.leadsObj.belongsTo(db.leadStatusesObj, {
  as: "leadStatus",
  foreignKey: "lead_status_id",
});
db.leadStatusesObj.hasMany(db.leadsObj, {
  foreignKey: "lead_status_id",
  as: "status_leads",
});

db.leadsObj.belongsTo(db.projectObj, {
  as: "project",
  foreignKey: "project_id",
});
db.projectObj.hasMany(db.leadsObj, {
  foreignKey: "project_id",
  as: "project_leads",
});
db.leadsObj.hasMany(db.leadScopeMappingsObj, {
  foreignKey: "lead_id",
  as: "projectleadScopeMappings",
});

db.projectObj.hasMany(db.projectplanSetsObj, {
  foreignKey: "project_id",
  as: "planSets",
});

db.projectplanSetsObj.belongsTo(db.projectObj, {
  foreignKey: "project_id",
  as: "project",
});
db.budgetScopeObj.hasMany(db.scopeCategoryObj, {
  as: "categories",
  foreignKey: "scope_id",
});
db.scopeCategoryObj.belongsTo(db.budgetScopeObj, { foreignKey: "scope_id" });

db.scopeCategoryObj.hasMany(db.scopeGroupObj, {
  as: "groups",
  foreignKey: "scope_category_id",
});
db.scopeGroupObj.belongsTo(db.scopeCategoryObj, {
  foreignKey: "scope_category_id",
});

db.scopeGroupObj.hasMany(db.scopeSegmentObj, {
  as: "segments",
  foreignKey: "scope_group_id",
});
db.scopeSegmentObj.belongsTo(db.scopeGroupObj, {
  foreignKey: "scope_group_id",
});

db.projectplanSetsObj.belongsTo(db.userObj, {
  foreignKey: "plan_reviewed_by",
  as: "reviewedByUser",
});

db.leadsObj.belongsTo(db.companyObj, {
  foreignKey: "engineer_id",
  as: "lead_engineer",
});
db.leadsObj.belongsTo(db.contactsObj, {
  foreignKey: "contact_id",
  as: "lead_contact",
});
db.leadsObj.belongsTo(db.companyObj, {
  foreignKey: "company_id",
  as: "lead_company",
});
db.leadsObj.belongsTo(db.userObj, {
  foreignKey: "sale_person_id",
  as: "lead_sales_person",
});

db.projectNotesObj.belongsTo(db.userObj, { foreignKey: "user_id", as: "user" });

db.projectObj.belongsTo(db.leadTeamsObj, {
  foreignKey: "take_off_team_id",
  as: "takeoff_team",
});

db.leadTeamsObj.hasMany(db.projectObj, {
  foreignKey: "take_off_team_id",
  as: "projects",
});

db.projectObj.belongsTo(db.stateObj, {
  foreignKey: "state",
  as: "states",
});

db.projectObj.belongsTo(db.projectPhasesObj, {
  foreignKey: "project_phase",
  as: "projectPhase",
});
db.projectObj.belongsTo(db.projectTagsObj, {
  foreignKey: "project_tags",
  as: "projectTag",
});

db.projectObj.hasMany(db.projectTagMappingsObj, {
  foreignKey: "project_id",
  as: "projectTagsMapping",
});

db.projectTagMappingsObj.belongsTo(db.projectTagsObj, {
  foreignKey: "tag_id",
  as: "tags",
});

db.projectObj.hasMany(db.gDriveAssociationObj, {
  foreignKey: "project_id",
  as: "googleDrive",
});

db.budgetBooksObj.hasMany(db.gDriveAssociationObj, {
  foreignKey: "module_id",
  as: "budget_files",
});

db.budgetBooksObj.hasMany(db.budgetBookDocumentsObj, {
  foreignKey: "budget_book_id",
  as: "budgetBookDocuments",
});

db.leadsObj.hasMany(db.budgetBooksObj, {
  foreignKey: "lead_id",
  as: "lead_budget",
});

db.projectObj.hasMany(db.projectTypeMappingsObj, {
  foreignKey: "project_id",
  as: "projectTypeMapping",
});
db.projectTypeMappingsObj.belongsTo(db.projectTypesObj, {
  foreignKey: "project_type_id",
  as: "projectType",
});

db.companyObj.belongsTo(db.companyTypeObj, {
  foreignKey: "company_type",
  as: "companyType",
});

db.budgetHistoryObj.belongsTo(db.projectObj, {
  foreignKey: "project_id",
  as: "budgetProject",
});

db.leadNotesObj.belongsTo(db.userObj, {
  foreignKey: "user_id",
  as: "userName",
});
db.userObj.hasMany(db.leadNotesObj, {
  foreignKey: "user_id",
  as: "leadNotes",
});

module.exports = db;
