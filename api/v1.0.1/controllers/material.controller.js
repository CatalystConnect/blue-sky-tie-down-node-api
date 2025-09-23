require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require("path");
const materialServices = require("../services/material.services")
const authServices = require("../services/auth.services")
const projectServices = require("../services/project.services");
const config = require("../../../config/db.config");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addMaterial*/
    async addMaterial(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const customer = await authServices.getCustomerById(data.customerName);
            if (!customer) throw new Error("Customer not found");
            let postData = {
                customerName: customer.firstName + " " + customer.lastName,
                shipTo: data.shipTo,
                additionalTotal: data.additionalTotal,
                materialTotal: data.materialTotal,
                addtaxable: data.addtaxable,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone
            }
            let addMaterial = await materialServices.addMaterial(postData);
            let materialQuote = (data.materialQuotes || []).map((material, index) => ({
                materialId: addMaterial.id,
                description: material.description,
                quantity: material.quantity,
                price: material.price,
                cost: material.cost,
                total: material.total,
                notes: material.notes,
                lineType: material.lineType,
                item: material.item,
                uom: material.uom,
                taxable: material.taxable,
                margin: material.margin
            }));
            await materialServices.addMaterialQuote(materialQuote);

            let additionalQuote = (data.additionalQuotes || []).map((additional, index) => ({
                materialId: addMaterial.id,
                description: additional.description,
                quantity: additional.quantity,
                price: additional.price,
                cost: additional.cost,
                total: additional.total
            }));
            await materialServices.addAdditionalQuote(additionalQuote);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Material added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Material added failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getMaterialList*/
    async getMaterialList(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let material = await materialServices.getMaterialList(page, length);

            const updatedMaterials = material.map((item) => {
                return {
                    id: item.dataValues.id,
                    customerName: item.dataValues.customerName,
                    shipTo: item.dataValues.shipTo,
                    additionalTotal: item.dataValues.additionalTotal,
                    materialTotal: item.dataValues.materialTotal,
                    status: item.dataValues.status,
                    grandTotal: Number(item.dataValues.additionalTotal) + Number(item.dataValues.materialTotal), // Placed immediately after materialTotal
                    createdAt: item.dataValues.createdAt,
                    updatedAt: item.dataValues.updatedAt,
                    materialQuotes: item.dataValues.materialQuotes,
                    additionalQuotes: item.dataValues.additionalQuotes
                };
            });
            let totalRecords = await materialServices.totalRecords(page, length);
            let response = {
                material: updatedMaterials,
                totalRecords: totalRecords.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Material displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getMaterialById*/
    async getMaterialById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let materialId = req.query.materialId;
            let material = await materialServices.getMaterialById(materialId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(material, "Material displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateMaterial*/
    async updateMaterial(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let materialId = req.query.materialId;
            let material = await materialServices.getMaterialById(materialId);
            if (!material) throw new Error("Material not found");
            let data = req.body;
            let postData = {
                customerName: data.customerName,
                shipTo: data.shipTo,
                additionalTotal: data.additionalTotal,
                materialTotal: data.materialTotal,
                addtaxable: data.addtaxable,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone
            }
            commonHelper.removeFalsyKeys(postData);
            await materialServices.updateMaterial(postData, materialId);

            // Update MaterialQuotes
            let recordsWithUndefinedMaterialId;
            let recordsWithMaterialId;
            if (data.materialQuotes) {
                let materialQuote = (data.materialQuotes || []).map((materialQuote, index) => ({
                    id: materialQuote.id,
                    description: materialQuote.description,
                    quantity: materialQuote.quantity,
                    price: materialQuote.price,
                    cost: materialQuote.cost,
                    total: materialQuote.total,
                    notes: materialQuote.notes,
                    isDeleted: materialQuote.isDeleted,
                    lineType: materialQuote.lineType,
                    item: materialQuote.item,
                    uom: materialQuote.uom,
                    taxable: materialQuote.taxable,
                    margin: materialQuote.margin
                }));
                recordsWithMaterialId = materialQuote.filter(quote => quote.id !== undefined);
                recordsWithUndefinedMaterialId = materialQuote.filter(quote => quote.id === undefined);
                recordsWithUndefinedMaterialId.forEach(record => {
                    if (record.materialId === undefined) {
                        record.materialId = materialId;
                    }
                });
            }
            if (recordsWithUndefinedMaterialId.length != 0) {
                await materialServices.addMaterialQuote(recordsWithUndefinedMaterialId);
            }

            let existingMaterialQuotes = await materialServices.getMaterialQuotesByMaterialId(materialId);
            const materialMatchingRecords = recordsWithMaterialId.filter(record =>
                existingMaterialQuotes.some(quote => quote.id === record.id)
            );
            const cleanedMaterialRecords = materialMatchingRecords.map(record => {
                const cleanedRecord = {};
                Object.keys(record).forEach(key => {
                    if (record[key] !== undefined) {
                        cleanedRecord[key] = record[key];
                    }
                });
                return cleanedRecord;
            });
            await materialServices.updateMaterialQuote(cleanedMaterialRecords);

            //Update AdditionalQuotes
            let additionalRecordsWithUndefinedMaterialId;
            let additionalRecordsWithMaterialId;
            if (data.additionalQuotes) {
                let additionalQuotes = (data.additionalQuotes || []).map((additionalQuotes, index) => ({
                    id: additionalQuotes.id,
                    description: additionalQuotes.description,
                    quantity: additionalQuotes.quantity,
                    price: additionalQuotes.price,
                    cost: additionalQuotes.cost,
                    total: additionalQuotes.total
                }));
                if (additionalQuotes) {
                    additionalRecordsWithMaterialId = additionalQuotes.filter(quote => quote.id !== undefined);

                    additionalRecordsWithUndefinedMaterialId = additionalQuotes.filter(quote => quote.id === undefined);
                    additionalRecordsWithUndefinedMaterialId.forEach(record => {
                        if (record.materialId === undefined) {
                            record.materialId = materialId;
                        }
                    });
                }
                if (additionalRecordsWithUndefinedMaterialId) {
                    await materialServices.addAdditionalQuote(additionalRecordsWithUndefinedMaterialId);
                }

                let existingQuotes = await materialServices.getAdditionalQuotesByMaterialId(materialId);
                const matchingRecords = additionalRecordsWithMaterialId.filter(record =>
                    existingQuotes.some(quote => quote.id === record.id)
                );
                const cleanedRecords = matchingRecords.map(record => {
                    const cleanedRecord = {};
                    Object.keys(record).forEach(key => {
                        if (record[key] !== undefined) {
                            cleanedRecord[key] = record[key];
                        }
                    });
                    return cleanedRecord;
                });
                await materialServices.updateAdditionalQuote(cleanedRecords);
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Material updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteMaterial*/
    async deleteMaterial(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let materialId = req.query.materialId;
            let material = await materialServices.getMaterialById(materialId);
            if (!material) throw new Error("Material not found");
            let deleteMaterial = await materialServices.deleteMaterial(materialId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteMaterial, "Material deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*sendMaterialQuotePdf*/
    async sendMaterialQuotePdf(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let materialId = req.query.materialId;
            let material = await materialServices.getMaterialById(materialId);
            if (!material) throw new Error("Material not found");
            let email = material.customerEmail;
            const transformedData = [
                {
                    personalDetail: {
                        customerName: material.customerName,
                        customerAddress: material.shipTo,
                        grandTotal: material.materialTotal,
                        customerPhone: material.customerPhone
                    },
                    billDetails: {
                        items: material.materialQuotes.map(quote => ({
                            itemName: quote.item || "",
                            price: quote.price || "",
                            quantity: quote.quantity || "",
                            itemtotal: quote.total || ""
                        })),
                    }
                }
            ];

            async function generatePDF(data, outputPath) {
                return new Promise((resolve, reject) => {
                    const doc = new PDFDocument({ margin: 50 });
                    const stream = fs.createWriteStream(outputPath);
                    doc.pipe(stream);

                    // ===  Add the logo ===
                    const logoPath = path.join(__dirname, '../../../logo/fortress-black-logo.png');
                    if (fs.existsSync(logoPath)) {
                        doc.image(logoPath, 50, 50, { width: 120 }); // Position and size of the logo
                    } else {
                        console.warn("Logo not found at:", logoPath);
                    }

                    // Move cursor down so title doesn't overlap logo
                    doc.moveDown(4);

                    // === Title ===
                    doc.fontSize(18).text("Material Quote", { align: "center" }).moveDown(2);

                    // === Customer Details ===
                    const personalDetail = data[0]?.personalDetail || {};
                    doc.fontSize(12).text(`Customer Name: ${personalDetail.customerName || ''}`);
                    doc.text(`Customer Address: ${personalDetail.customerAddress || ''}`);
                    doc.text(`Customer Phone: ${personalDetail.customerPhone || ''}`).moveDown(1);

                    // === Bill Details Header ===
                    doc.fontSize(14).text("Bill Details", { underline: true }).moveDown(0.5);

                    const startX = 50;
                    let startY = doc.y;

                    // === Table Header ===
                    doc.fontSize(12)
                        .text("Item Name", startX, startY)
                        .text("Price", startX + 200, startY, { width: 50, align: "right" })
                        .text("Quantity", startX + 300, startY, { width: 50, align: "right" })
                        .text("Item Total", startX + 400, startY, { width: 70, align: "right" });

                    doc.moveDown(0.5);
                    doc.moveTo(startX, doc.y).lineTo(550, doc.y).stroke();
                    doc.moveDown(0.5);

                    // === Bill Items ===
                    const items = data[0]?.billDetails?.items || [];
                    items.forEach((item) => {
                        let rowY = doc.y;
                        doc.fontSize(12)
                            .text(item.itemName, startX, rowY)
                            .text(item.price?.toString() || '', startX + 200, rowY, { width: 50, align: "right" })
                            .text(item.quantity?.toString() || '', startX + 300, rowY, { width: 50, align: "right" })
                            .text(item.itemtotal?.toString() || '', startX + 400, rowY, { width: 70, align: "right" });
                        doc.moveDown(0.5);
                    });

                    // === Grand Total ===
                    doc.moveTo(startX, doc.y).lineTo(550, doc.y).stroke();
                    doc.moveDown(0.5);
                    doc.fontSize(12).text("Grand Total:", startX + 300, doc.y, { width: 100, align: "right" });
                    doc.text(personalDetail.grandTotal?.toString() || '', startX + 400, doc.y, { width: 70, align: "right" });
                    doc.moveDown(1);

                    // === Finalize PDF ===
                    doc.end();

                    stream.on("finish", function () {
                        console.log(" PDF created successfully!");
                        resolve(outputPath);
                    });

                    stream.on("error", function (err) {
                        reject(err);
                    });
                });
            }

            // Call the function
            await generatePDF(transformedData, "materialQuote.pdf")
                .then((filePath) => {
                    console.log("PDF generated at:", filePath);
                    const payload = {
                        materialId: materialId,
                    };
                    const generateToken = () => {
                        const secretKey = config.secret;
                        const token = jwt.sign(
                            payload,
                            secretKey,
                            { expiresIn: "1d" }
                        );
                        return token;
                    };
                    const token = generateToken();
                    let statusLink = "https://crm-rooftop.vercel.app/materialVerification" + "?" + "token=" + token
                    commonHelper.sendPdfToCustomer(filePath, email, statusLink);
                })
                .catch((error) => console.error("Error generating PDF:", error));

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "MaterialQuote pdf send to customer successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*materialQuoteStatusUpdate*/
    async materialQuoteStatusUpdate(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const token = req.query.token;
            if (!token) throw new Error("Token is required");

            let checkTokenExist = await materialServices.checkTokenExist(token);
            if (checkTokenExist) throw new Error("This link has expired");

            const secretKey = config.secret;
            const decoded = jwt.verify(token, secretKey);

            let materialId = decoded.materialId;
            let status = req.body.status;
            let material = await materialServices.getMaterialById(materialId);
            if (!material) throw new Error("Material not found");
            let postData = {
                status: status
            }
            let materialUpdate = await materialServices.updateMaterial(postData, materialId);
            let tokenData = {
                token: token
            }
            await materialServices.addToken(tokenData)
            let customerEmail = material.customerEmail;
            let getLeadBycustomerEmail = await materialServices.getLeadBycustomerEmail(customerEmail);
            let data = material.materialQuotes.map(item => {
                return { price: item.price, description: item.description }
            })
            let projectData = {
                projectName: getLeadBycustomerEmail.firstName,
                latitude: getLeadBycustomerEmail.lattitude,
                longitude: getLeadBycustomerEmail.longitude,
                address: getLeadBycustomerEmail.customerAddress,
                city: getLeadBycustomerEmail.customerCity,
                scope: getLeadBycustomerEmail.scope,
                state: getLeadBycustomerEmail.customerState,
                zip: getLeadBycustomerEmail.zip,
                price: data[0].price,
                description: data[0].description,
                location: getLeadBycustomerEmail.leadLocation
            }
            await projectServices.addProject(projectData)
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(materialUpdate, "Material updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating material failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getMaterialDetailById*/
    async getMaterialDetailById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let materialId = req.query.materialId;
            let material = await materialServices.getMaterialById(materialId);
            if (!material) throw new Error("Material not found");
            const transformedData = [
                {
                    personalDetail: {
                        customerName: material.customerName,
                        customerAddress: material.shipTo,
                        grandTotal: material.materialTotal,
                        customerPhone: material.customerPhone
                    },
                    billDetails: {
                        items: material.materialQuotes.map(quote => ({
                            itemName: quote.item || "",
                            price: quote.price || "",
                            quantity: quote.quantity || "",
                            itemtotal: quote.total || ""
                        })),
                    }
                }
            ];
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(transformedData, "Material Detail displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching material failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addMaterial": {
                return [
                    check("customerName").not().isEmpty().withMessage("Customer Name is Required"),
                ];
            }
            case "getMaterialById": {
                return [
                    check("materialId").not().isEmpty().withMessage("Material Id is Required"),
                ];
            }
            case "materialQuoteStatusUpdate": {
                return [
                    check("status").not().isEmpty().withMessage("Material Id is Required").isIn(["pending", "approved", "reject"])
                        .withMessage("Invalid status! Please send these status only pending, approved, reject")
                ];
            }
        }
    }
};
