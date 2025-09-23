require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const catalogServices = require("../services/catalog.services")
const productAttributeServices = require("../services/productAttribute.services")
const productCategoryServices = require("../services/productCategory.services");
const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addCatalog*/
    async addCatalog(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let catalogId;
            let catalog;
            if (!data.category) {
                throw new Error("Catagory id is required");
            }
            if (data.CatalogId) {
                catalogId = data.CatalogId
                let getCatalogById = await catalogServices.getCatalogById(catalogId);
                if (!getCatalogById) {
                    throw new Error("Catalog not found");
                }
                let keySpecifications;
                if (data.keySpecifications) {
                    keySpecifications = JSON.parse(data.keySpecifications)
                }
                let attribute;
                if (data.attribute) {
                    attribute = JSON.parse(data.attribute)
                }

                let postData = {
                    productName: data.productName,
                    grade: data.grade,
                    type: data.type,
                    waranty: data.waranty,
                    features: data.features,
                    price: data.price,
                    topFeatures: data.topFeatures,
                    installationPackage: data.installationPackage,
                    additionalCosts: data.additionalCosts,
                    specificationsDescription: data.specificationsDescription,
                    keySpecifications: keySpecifications,
                    description: data.description,
                    manufacturer: data.manufacturer
                }
                commonHelper.removeFalsyKeys(postData);

                await catalogServices.updateCatalogById(postData, catalogId)

                if (data.category) {
                    let category = JSON.parse(data.category)
                    await catalogServices.deleteAssociayion(catalogId);
                    for (const categoryId of category) {
                        const numericCategoryId = Number(categoryId);
                        let postData = {
                            productId: catalogId,
                            categoryId: numericCategoryId
                        };
                        await catalogServices.addAssociayion(postData);
                    }
                }

                if (data.attribute) {
                    let postData = {
                        attributeData: attribute
                    }
                    await catalogServices.updateAttribute(postData, catalogId);
                }
                let recordsWithUndefinedVariationId;
                let recordsWithVariationId;
                if (data.variations) {
                    let variations = JSON.parse(data.variations?.trim() || "[]");
                    let newVariations = variations.map((variation, index) => ({
                        id: variation.variationId || null,
                        data: JSON.stringify(variation.data),
                        image: req.files.featureImage ? "/" + req.files.featureImage[index]?.path : null,
                        thumbnail: req.files.thumbnail ? "/" + req.files.thumbnail[index]?.path : null
                    }));

                    recordsWithVariationId = newVariations.filter(variation => variation.variationId !== null);

                    recordsWithUndefinedVariationId = newVariations.filter(variation => variation.variationId === null);
                    recordsWithUndefinedVariationId.forEach(record => {
                        if (record.catalogId === undefined) {
                            record.catalogId = catalogId;
                        }
                    });

                    if (recordsWithUndefinedVariationId.length != 0) {
                        await catalogServices.addVariations(recordsWithUndefinedVariationId);
                    }
                    let existingCatalog = await catalogServices.getCatalog(catalogId);
                    const variationMatchingRecords = recordsWithVariationId.filter(record =>
                        existingCatalog.some(catalog => catalog.id === record.id)
                    );
                    const cleanedVariationRecords = variationMatchingRecords.map(record => {
                        const cleanedRecord = {};
                        Object.keys(record).forEach(key => {
                            if (record[key] !== undefined) {
                                cleanedRecord[key] = record[key];
                            }
                        });
                        return cleanedRecord;
                    });
                    await catalogServices.updateVariation(cleanedVariationRecords);
                }
                let response = {
                    id: catalogId
                }
                return res
                    .status(200)
                    .send(commonHelper.parseSuccessRespose(response, "Catalog add successfully"));
            } else {
                let keySpecifications;
                if (data.keySpecifications) {
                    keySpecifications = JSON.parse(data.keySpecifications)
                }
                let attribute;
                if (data.attribute) {
                    attribute = JSON.parse(data.attribute)
                }
                let catagoryId = data.category;

                let categoryById = await productCategoryServices.categoryById(catagoryId);
                if (!categoryById) {
                    throw new Error("Catalog not found");
                }
                let postData = {
                    productName: data.productName,
                    grade: data.grade,
                    type: data.type,
                    waranty: data.waranty,
                    features: data.features,
                    price: data.price,
                    topFeatures: data.topFeatures,
                    installationPackage: data.installationPackage,
                    specificationsDescription: data.specificationsDescription,
                    keySpecifications: keySpecifications,
                    description: data.description,
                    manufacturer: data.manufacturer
                }
                catalog = await catalogServices.addCatalog(postData);

                if (data.category) {
                    let postData = {
                        productId: catalog.id,
                        categoryId: data.category
                    };
                    postData.categoryId = Number(postData.categoryId);  // Converts categoryId to a number
                    let category = await productCategoryServices.categoryById(postData.categoryId);

                    if (!category) {
                        throw new Error(`ProductCategory with ID ${postData.categoryId} not found`);
                    }
                    await catalogServices.addAssociayion(postData);
                }
                if (data.attribute) {
                    let postData = {
                        catalogId: catalog.id,
                        attributeData: attribute
                    }
                    await catalogServices.addAttribute(postData);
                }
                if (data.productAttribute) {
                    let productAttribute = data.productAttribute;
                    productAttribute = JSON.parse(productAttribute);
                    for (const item of productAttribute) {
                        let value;
                        if (item.value) {
                            value = JSON.stringify(item.value);
                        }
                        let postData = {
                            productId: catalog.id,
                            name: item.name,
                            value: value
                        };
                        await productAttributeServices.addProductAttribute(postData);
                    }
                }
                if (data.variations) {

                    const variations = JSON.parse(data.variations || "[]");

                    for (let index = 0; index < variations.length; index++) {
                        const variation = variations[index];
                        const formattedVariation = {
                            image: req.files.featureImage ? "/" + req.files.featureImage[index]?.path : null,
                            thumbnail: req.files.thumbnail ? "/" + req.files.thumbnail[index]?.path : null,
                            variation: variation,
                            data: JSON.stringify(variation),
                            catalogId: catalog.id,
                        };
                        await catalogServices.addVariations([formattedVariation]);
                    }
                }

                let response = {
                    id: catalog.id
                }
                return res
                    .status(200)
                    .send(commonHelper.parseSuccessRespose(response, "Catalog add successfully"));
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding Catalog failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllCatalog*/
    async getAllCatalog(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0) {
                throw new Error("Page number must be greater than 0");
            }
            if (length <= 0) {
                throw new Error("Length number must be greater than 0");
            }

            let getAllCatalog = await catalogServices.getAllCatalog(page, length,);
            getAllCatalog.forEach(catalog => {
                if (catalog.variations && catalog.variations.length > 0) {
                    catalog.variations = catalog.variations.map(variationInstance => {
                        const variation = variationInstance.get({ plain: true });
                    
                        if (variation.image) {
                            variation.image = `${process.env.BASE_URL}${variation.image}`;
                        }
                        if (variation.thumbnail) {
                            variation.thumbnail = `${process.env.BASE_URL}${variation.thumbnail}`;
                        }
                    
                        let parsedData = {};
                        if (variation.data) {
                            parsedData = JSON.parse(variation.data);
                        }
                    
                        variation.data = parsedData;
                        return variation;
                    });
                    
                }
            })
            let totalCatalog = await catalogServices.totalCatalog();
            let response = {
                catalog: getAllCatalog,
                totalRecords: totalCatalog.length
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
    /*getCatalogById*/
    async getCatalogById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let catalogId = req.query.catalogId
            let getCatalogById = await catalogServices.getCatalogById(catalogId);
            if (!getCatalogById) {
                throw new Error("Catalog not found");
            }
            if (getCatalogById.variations && getCatalogById.variations.length > 0) {
                // Sort variations by variationId in ascending order
                getCatalogById.variations.sort((a, b) => {
                    const variationIdA = a.dataValues.id;
                    const variationIdB = b.dataValues.id;
                    return variationIdA - variationIdB; // Ascending order
                });
            
                getCatalogById.variations.forEach(variation => {
                    let variationData = variation.dataValues;
            
                    // Add full URLs for image and thumbnail
                    if (variationData.image) {
                        variationData.image = `${process.env.BASE_URL}${variationData.image}`;
                    }
                    if (variationData.thumbnail) {
                        variationData.thumbnail = `${process.env.BASE_URL}${variationData.thumbnail}`;
                    }
            
                    // Parse variation.data safely
                    if (variationData.data) {
                        try {
                            variationData.data = JSON.parse(variationData.data);
                        } catch (e) {
                            variationData.data = {}; // fallback to empty object
                        }
                    } else {
                        variationData.data = {};
                    }
            
                    // Assign additional fields into data object
                    variationData.data.variationId = variationData.id;
                    variationData.data.measure = variationData.measure;
                    variationData.data.measureUnitsSquare = variationData.measureUnitsSquare;
                    variationData.data.coverageAreaSoftUnit = variationData.coverageAreaSoftUnit;
                    variationData.data.unitsLinearFootLf = variationData.unitsLinearFootLf;
                    variationData.data.rollLengthFt = variationData.rollLengthFt;
                    variationData.data.rollWidthIn = variationData.rollWidthIn;
            
                    // Merge old _previousDataValues.data if available, keeping new fields
                    if (variation._previousDataValues?.data) {
                        try {
                            const previousData = JSON.parse(variation._previousDataValues.data);
                            variationData.data = {
                                ...previousData,
                                ...variationData.data, // new values overwrite old ones
                            };
                        } catch (e) {
                            // ignore if error parsing old data
                        }
                    }
            
                    // Clean up top-level values
                    delete variationData.id;
                    delete variationData.measure;
                    delete variationData.measureUnitsSquare;
                    delete variationData.coverageAreaSoftUnit;
                    delete variationData.unitsLinearFootLf;
                    delete variationData.rollLengthFt;
                    delete variationData.rollWidthIn;
                    delete variationData.variationId;
                });
            }
            
            // console.log("catalogId:",catalogId);

            let getCategory = await catalogServices.getCategory(catalogId);
            // let getCategoryValues = await catalogServices.getCategoryValues(getCategory);
            const catalogWithCategories = {
                ...getCatalogById.dataValues,
                category: getCategory?.categoryId
            };
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(catalogWithCategories, "Catalog displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Catalog failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateCatalogById*/
    async updateCatalogById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let catalogId = req.query.catalogId;
            let getCatalogById = await catalogServices.getCatalogById(catalogId);
            if (!getCatalogById) {
                throw new Error("Catalog not found");
            }

            let data = req.body;
            let keySpecifications;
            if (data.keySpecifications) {
                keySpecifications = JSON.parse(data.keySpecifications);
            }
            let attribute;
            if (data.attribute) {
                attribute = JSON.parse(data.attribute)
            }


            let postData = {
                productName: data.productName,
                grade: data.grade,
                type: data.type,
                waranty: data.waranty,
                features: data.features,
                price: data.price,
                topFeatures: data.topFeatures,
                installationPackage: data.installationPackage,
                additionalCosts: data.additionalCosts,
                specificationsDescription: data.specificationsDescription,
                keySpecifications: keySpecifications,
                description: data.description,
                manufacturer: data.manufacturer
            };
            commonHelper.removeFalsyKeys(postData);

            if (data.attribute) {
                let postData = {
                    attributeData: attribute
                }
                await catalogServices.updateAttribute(postData, catalogId);
            }

            // UPDATE CATALOG DETAILS
            let updateCatalogById = await catalogServices.updateCatalogById(postData, catalogId);

            // update or insert variation
            let recordsWithUndefinedVariationId;
            let recordsWithVariationId;
            if (data.variations) {
                let variations = JSON.parse(data.variations?.trim() || "[]");
                let newVariations = variations.map((variation, index) => {
                    variation;
                    return {
                        id: variation.variationId || null,
                        data: JSON.stringify(variation),
                        image: req.files.featureImage ? "/" + req.files.featureImage[index]?.path : null,
                        thumbnail: req.files.thumbnail ? "/" + req.files.thumbnail[index]?.path : null
                    };
                });
                recordsWithVariationId = newVariations.filter(variation => variation.variationId !== null);
                recordsWithUndefinedVariationId = newVariations.filter(variation => variation.id == null);
                recordsWithUndefinedVariationId.forEach(record => {
                    if (record.catalogId === undefined) {
                        record.catalogId = catalogId;
                    }
                });

                // delete variations
                if(recordsWithVariationId){
                    let getCatalogById = await catalogServices.getCatalogInVariation(catalogId);

                    let variationIdFromDb = getCatalogById.map(items => {
                        return items.id;
                    })
                    let variationIdComes = recordsWithVariationId.map(items => {
                        return items.id;
                    })

                    const unmatchedIds = variationIdFromDb.filter(id => !variationIdComes.includes(id));
                    for (const variationId of unmatchedIds) {
                        await catalogServices.deleteVariation(variationId);
                    }
                    

                }
                // add variations
                if (recordsWithUndefinedVariationId.length !== 0) {
                    await catalogServices.addVariations(recordsWithUndefinedVariationId);
                }
                let existingCatalog = await catalogServices.getCatalog(catalogId);
                const variationMatchingRecords = recordsWithVariationId.filter(record =>
                    existingCatalog.some(catalog => catalog.id === record.id)
                );
                const cleanedVariationRecords = variationMatchingRecords.map(record => {
                    const cleanedRecord = {};
                    Object.keys(record).forEach(key => {
                        if (record[key] !== undefined) {
                            cleanedRecord[key] = record[key];
                        }
                    });
                    return cleanedRecord;
                });
                await catalogServices.updateVariation(cleanedVariationRecords);
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateCatalogById, "Catalog updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating catalog failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteCatalogById*/
    async deleteCatalogById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let catalogId = req.query.catalogId;

            let getCatalogById = await catalogServices.getCatalogById(catalogId);
            if (!getCatalogById) {
                throw new Error("Catalog not found");
            }
            await catalogServices.deleteAssociationByCatalogId(catalogId);
            let deleteCatalogById = await catalogServices.deleteCatalogById(catalogId);
            let deleteProductFromBetter = await catalogServices.deleteProductFromBetter(catalogId);
            let data = deleteProductFromBetter;
            for (const item of data) {
            await catalogServices.updateProductCategoryById(item, catalogId);
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteCatalogById, "Catalog deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting Catalog failed",
                data: error.response?.data || {}
            });
        }
    },

    validate(method) {
        switch (method) {
            case "addCatalog": {
                return [
                    check("type")
                        .optional()
                        .isIn(["Asphalt Shingle", "Wood", "Tile", "Metal", "Synthetic"])
                        .withMessage("Invalid type. Accepted values: Asphalt Shingle, Wood, Tile, Metal, Synthetic"),
                    ];
            }
            case "getCatalogById": {
                return [
                    check("catalogId").not().isEmpty().withMessage("Catalog Id is Required"),
                ];
            }
        }
    }
}


