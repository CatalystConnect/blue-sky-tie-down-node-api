require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const productCategoryServices = require("../services/productCategory.services");
const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProductCategory*/
    async addProductCategory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            if (data.parentCategory && data.parentCategory !== "none") {
                let categoryExist = await productCategoryServices.categoryExist(data.parentCategory);
                if (!categoryExist) throw new Error("Parent category not found")
            }
            const baseUrl = "/public/files/";
           
            let image = req.file ?`${baseUrl}${req.file.filename}`: null;
            let postData = {
                name: data.name,
                slug: data.slug,
                parentCategory: data.parentCategory,
                description: data.description,
                image: image
            };
            await productCategoryServices.addProductCategory(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "ProductCategory add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding category failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllProductCategory*/
    async getAllProductCategory(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            
            let category = await productCategoryServices.getAllProductCategory(page, length);
            category.forEach(element => {
                if (element.image) {
                    element.image = `${process.env.BASE_URL}${element.image}`
                }
            });
            let totalCategory = await productCategoryServices.getTotalProductcategory();
            let response = {
                productCategory: category,
                totalRecords: totalCategory.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "ProductCategory displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching ProductCategory failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getProductCategoryById*/
    async getProductCategoryById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoryId = req.query.productCategoryId;
            let category = await productCategoryServices.categoryById(productCategoryId);
            if (category.image) {
                category.image = `${process.env.BASE_URL}${category.image}`
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(category, "ProductCategory displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching category failed",
                data: error.response?.data || {}
            });
        }

    },
    /*updateProductCategoryById*/
    async updateProductCategoryById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoryId = req.query.productCategoryId;
            let category = await productCategoryServices.getProductCategoryById(productCategoryId);
            if (!category) throw new Error("ProductCategory not found");

            let data = req.body;

            if (data.parentCategory && data.parentCategory !== "none") {
                let categoryExist = await productCategoryServices.categoryExist(data.parentCategory);
                if (!categoryExist) throw new Error("Parent category not found")
            }
            const baseUrl = "/public/files/";
            let image = req.file ?`${baseUrl}${req.file.filename}`: null;

            let productId;
            const { goodProduct, betterProduct, bestProduct } = data;
            if (goodProduct) {
                if (goodProduct == betterProduct || goodProduct == bestProduct) {
                    throw new Error("Don't same type select on multiple products");
                }
                productId = goodProduct;
                let productExist = await productCategoryServices.productExist(productId);
                if (!productExist) {
                    throw new Error("Product not found")
                }
            }
            if (betterProduct) {
                if (goodProduct == betterProduct || betterProduct == bestProduct) throw new Error("Don't same type select on multiple products");
                productId = betterProduct;
                let productExist = await productCategoryServices.productExist(productId);
                if (!productExist) throw new Error(`Product not found with id: ${productId}`)
            }
            if (bestProduct) {
                if (bestProduct == betterProduct || goodProduct == bestProduct) {
                    throw new Error("Don't same type select on multiple products");
                }
                productId = bestProduct;
                let productExist = await productCategoryServices.productExist(productId);
                if (!productExist) {
                    throw new Error(`Product not found with id: ${productId}`)
                }
            }

            let postData = {
                name: data.name,
                slug: data.slug,
                parentCategory: data.parentCategory,
                description: data.description,
                image: image,
                goodProduct: goodProduct,
                betterProduct: betterProduct,
                bestProduct: bestProduct
            };
            commonHelper.removeFalsyKeys(postData);
            if (goodProduct == "") {
                postData.goodProduct = null
            }
            if (betterProduct == "") {
                postData.betterProduct = null
            }
            if (bestProduct == "") {
                postData.bestProduct = null
            }

            let updateAttribute = await productCategoryServices.updateProductCategoryById(postData, productCategoryId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateAttribute, "ProductCategory updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating category failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteProductCategoryById*/
    async deleteProductCategoryById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoryId = req.query.productCategoryId;
            let category = await productCategoryServices.getProductCategoryById(productCategoryId);
            if (!category) throw new Error("ProductCategory not found");
            let deleteCategory = await productCategoryServices.deleteProductCategoryById(productCategoryId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteCategory, "ProductCategory deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting category failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllCategoryWithProduct*/
    async getAllCategoryWithProduct(req, res) {
        try {
            let category = await productCategoryServices.getAllCategoryWithProduct();
            const cleanCategory = category.map(cat => {
                const flattenedProducts = [];
              
                const catData = cat.dataValues;
              
                catData.product.forEach(product => {
                  const productDetails = product.dataValues.productDetails;
              
                  if (!productDetails) return;
              
                  const productId = productDetails.id;
                  const productName = productDetails.productName;
                  const type = productDetails.type;
              
                  productDetails.variation.forEach(variation => {
                    let variationData = variation.dataValues.data;
              
                    if (typeof variationData === 'string') {
                      try {
                        variationData = JSON.parse(variationData);
                      } catch (e) {
                        variationData = {};
                      }
                    }
              
                    const finalData = {
                      featureImage: variationData?.featureImage || "",
                      thumbnail: variationData?.thumbnail || "",
                      name: variationData?.name || "",
                      cost: variationData?.cost || "",
                      price: variationData?.price || "",
                      sku: variationData?.sku || "",
                      margin: "1",
                      uom: variationData?.uom || "",
                      quantity: variationData?.quantity || "", 
                      measure: variationData?.measure || "",
                      measureUnitsSquare: variationData?.measureUnitsSquare || "",
                      coverageAreaSoftUnit: variationData?.coverageAreaSqft || "",
                      unitsLinearFootLf: variationData?.unitsLinearFootLf || "",
                      rollLengthFt: variationData?.rollLengthFt || "",
                      rollWidthIn: variationData?.rollWidthIn || "",
                      lf: variationData?.lf || "",
                      eaPerUnit: variationData?.eaPerUnit|| "",
                      bundlesPerLf: variationData?.bundlesPerLf || "",
                      rollSqft: variationData?.rollSqft || "",
                      unitsPerSq: variationData?.unitsPerSq || ""
                    };
              
                    flattenedProducts.push({
                      productId,
                      productName,
                      type,
                      variationId: variation.id,
                      image: variation.image,
                      thumbnail: variation.thumbnail,
                      data: finalData
                    });
                  });
                });
              
                return {
                    id: catData.id,
                    name: catData.name,
                    goodProduct: catData.goodProduct,
                    betterProduct: catData.betterProduct,
                    bestProduct: catData.bestProduct,
                    default_product: catData.default_product ?? flattenedProducts[0]?.productId ?? null,
                    products: flattenedProducts
                  };
                  
              });
            
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(cleanCategory, "ProductCategoryWithProduct displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching ProductCategoryWithProduct failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getProductByCategoryId*/
    async getProductByCategoryId(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let categoryId = req.query.categoryId;
            let category = await productCategoryServices.getProductCategoryById(categoryId);
            let getProduct = []
            for (const categories of category) {
                let productId = categories.productId;
                let product = await productCategoryServices.getProduct(productId);
                if (product && Array.isArray(product) && product.length > 0) {
                    getProduct.push(product);
                }
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getProduct, "Products  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Products failed",
                data: error.response?.data || {}
            });
        }

    },
     /*getVariationByCategoryId*/
     async getVariationByCategoryId(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let categoryId = req.query.categoryId;
            let categoryById = await productCategoryServices.categoryById(categoryId);

            let category = await productCategoryServices.getProductCategoryById(categoryId);
            let allVariations = []
            for (const categories of category) {
                let productId = categories.productId;
                let variations = await productCategoryServices.getVariations(productId);
                const simplifiedVariations = variations.map((item) => ({
                    productName: item.productName,
                    id: item['variations.id'],
                    catalogId: item['variations.catalogId'],
                    image: item['variations.image'],
                    thumbnail: item['variations.thumbnail'],
                    data: JSON.parse(item['variations.data']),
                  }));
                                    
                 records = simplifiedVariations.flat();
                 allVariations.push(...records)
            }
            let allCategory = await productCategoryServices.allCategory();
            let response = {
                category: categoryById,
                variations: allVariations,
                allCategories: allCategory
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "All Variations  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Products failed",
                data: error.response?.data || {}
            });
        }

    },

    validate(method) {
        switch (method) {
            case "addProductCategory": {
                return [
                    check("name").not().isEmpty().withMessage("Name is Required"),
                    check("parentCategory").not().isEmpty().withMessage("Parent Category is Required"),
                    check("description").not().isEmpty().withMessage("Description is Required"),
                ];
            }
            case "getProductCategoryById": {
                return [
                    check("productCategoryId").not().isEmpty().withMessage("ProductCategory is Required"),
                ];
            }
            case "getProductByCategoryId": {
                return [
                    check("categoryId").not().isEmpty().withMessage("Category Id is Required"),
                ];
            }
        }
    }
};
