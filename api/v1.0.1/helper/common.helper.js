const db = require("../models");
require("dotenv").config();
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const path = require("path");

module.exports = {
  getObjFirstValue(obj) {
    if (typeof obj == "object") {
      return obj[Object.keys(obj)[0]];
    } else {
      return false;
    }
  },
  customizeCatchMsg(errorMsg) {
    return `${errorMsg.name} : ${errorMsg.message} ${errorMsg.stack}`;
  },
  parseErrorRespose(errorMsg) {
    var returnData = {};
    returnData.status = false;
    returnData.message = this.getObjFirstValue(errorMsg);
    returnData.data = { errors: errorMsg };
    return returnData;
  },
  parseSuccessRespose(data = "", successMsg = "") {
    var returnData = {};
    returnData.status = true;
    returnData.message = successMsg;
    if (typeof data == "string") {
      returnData.data = {};
    } else {
      returnData.data = data;
    }
    return returnData;
  },
  removeFalsyKeys(postData) {
    Object.keys(postData).forEach((key) => {
      if (!postData[key]) {
        delete postData[key];
      }
    });
  },
  formatToCustomDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  },
  formatKeyName(key) {
    return key
      .replace(/([A-Z])/g, " $1") // Convert camelCase to words
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  },
  fetchPreviosValue(postData) {
    let contracts = db.contractObj.findOne({
      where: { id: postData },
      raw: true,
    });
    return contracts;
  },
  parseExcelDate(value) {
    if (!value) return null;

    if (typeof value === "number") {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const parsed = new Date(excelEpoch.getTime() + value * 86400000);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsedMoment = moment(value, [
      "YYYY-MM-DD", "YYYY/MM/DD", "DD-MM-YYYY", "DD/MM/YYYY",
      "YYYY-M-D", "D-M-YYYY", "D/M/YYYY", "YYYY/M/D"
    ], true);

    return parsedMoment.isValid() ? parsedMoment.toDate() : null;
  },

  async compareChanges(postData) {
    const changes = [];
    let addingObj = postData.addingObj;
    let moduleName = postData.moduleName;
    if (!postData.id) {
      const formattedModuleName = addingObj
        .replace("Obj", "")
        .replace(/^./, (char) => char.toUpperCase());
      changes.push({
        description: `New ${formattedModuleName} is added`,
      });
      return changes;
    }

    // Fetch previous data from the database
    let previousValue = await db[moduleName].findOne({
      where: { id: postData.id },
      raw: true,
    });

    if (!previousValue) {
      console.log(`No previous record found for ID: ${postData.id}`);
      return [];
    }
    for (const key of Object.keys(postData).filter(
      (k) => k !== "moduleName" && k !== "id"
    )) {
      let oldValue = previousValue[key];
      let newValue = postData[key];
      if (
        oldValue !== newValue ||
        oldValue === undefined ||
        oldValue === null
      ) {
        let description =
          oldValue === undefined || oldValue === null
            ? `${this.formatKeyName(key)} is added`
            : `${this.formatKeyName(
              key
            )} is changed from ${oldValue} to ${newValue}`;
        changes.push({
          oldValue: oldValue,
          newValue: newValue,
          description: description,
        });
      }
    }
    return changes;
  },

  transformChanges(changes, userId, moduleId, moduleName) {
    return changes.map((change) => ({
      userId: userId,
      moduleId: moduleId,
      moduleName: moduleName,
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      description: change.description,
    }));
  },
  async sendEmail(email, kycLink) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Complete Your KYC Process",
      html: `<table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
      <tr>
        <td style="text-align: center;"><a href="#" style="display: block;">
        <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
      </tr>
      <tr>
        <td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Complete Your KYC Process</td>
      </tr>
      
      <tr>
        <td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
          <p style="font-size: 15px; font-weight: 500;color: #231F20;">Please complete your KYC process by clicking the link below</p>
          <p style="margin: 0"><a href=${kycLink} style="word-break: break-all; font-size: 12px; text-decoration: none; color: #4872de;font-weight: 500;">${kycLink}</a></p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 20px 0 10px;">Best Regards</td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 10px;">Fortress Roofing Solutions</td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <p style="text-align: center; font-size: 14px; color: #555;"> <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | <a href="tel:mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a></p>
        </td>
      </tr>
    </table>`,
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Email failed:", error);
    }
  },
  async sendEmailToQualified(email, credentials) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "For Document Approval",
      html: `<table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
      <tr>
        <td style="text-align: center;"><a href="#" style="display: block;">
        <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
      </tr>
      <tr>
        <td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Document Approval</td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 10px;">Hello</td>
      </tr>
      <tr>
        <td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
          <p style="font-size: 15px; font-weight: 500;color: #231F20;">Congratulations! You are now a qualified contractor.<br/> Here are your login details:</p>
          <p style="font-size:14px; color: #231F20; margin: 0 0 5px; font-weight: 500;"><b style="font-weight: 600;">Email:</b> <a href="${credentials.email}"  style="color: #4872de; text-decoration:none;">${credentials.email}</a></p>
          <p style="font-size:14px; color: #231F20; margin: 0; font-weight: 500;"><b style="font-weight: 600;">Password:</b> <span style="color: #555;">${credentials.password}</span></p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 20px 0 10px;">Best Regards</td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 10px;">Fortress Roofing Solutions</td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <p style="text-align: center; font-size: 14px; color: #555;"> <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | <a href="tel:mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a></p>
        </td>
      </tr>
    </table>`,
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Email failed:", error);
    }
  },
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  async sendMail(email, otp) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `<table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
      <tr>
        <td style="text-align: center;"><a href="#" style="display: block;">
        <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
        </tr>
      <tr>
        <td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Password Reset OTP</td>
      </tr>
      
      <tr>
        <td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
          <p style="font-size: 15px; font-weight: 500;color: #231F20;">Your OTP for password reset is valid for 10 minutes.</p>
          <span style="display: inline-block; font-size:24px; font-weight:700; color: #231F20;">${otp} </span>
        </td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 20px 0 10px;">Best Regards</td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <p style="text-align: center; font-size: 14px; color: #555;"> <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | <a href="tel:mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a></p>
        </td>
      </tr>
    </table>`,
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Email failed:", error);
    }
  },
  async sendPdfToCustomer(filePath, email, statusLink) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "MaterialQuote Report",
      text: `Please check the attached materialQuote report.\n\nClick on this link to send Approve or Reject the material quote: ${statusLink}`,
      html: `
    <table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
		<tr>
			<td style="text-align: center;"><a href="#" style="display: block;">
      <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
      </tr>
		<tr>
			<td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Material Quote</td>
		</tr>
		<tr>
			<td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 20px;">For details, please check the materialQuote PDF attached at the bottom of this email.</td>
		</tr>
		<tr>
			<td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
				<p style="font-size: 14px;">To Approve or Reject the material quote.</p>
				<a href=${statusLink} style="background: #FFE003; border: 1px solid #231F20; text-decoration: none; padding: 6px 20px; display: inline-block; border-radius: 4px; color:#231F20; font-size:14px; font-weight:500;">Click here </a>
			</td>
		</tr>
		<tr>
			<td style="padding: 0 30px;">
				<p style="text-align: center; font-size: 14px; color: #555;">  For any questions or clarifications regarding this quote, feel free to contact our support team.<br>  <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | <a href="tel:mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a></p>
			</td>
		</tr>
	</table>
    `,
      attachments: [
        {
          filename: path.basename(filePath),
          path: path.resolve(filePath),
        },
      ],
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Email failed:", error);
    }
  },

  async sendContractMailToCustomer(email, statusLink) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );
    //   let mailOptions = {
    //     from: process.env.EMAIL,
    //     to: email,
    //     subject: "MaterialQuote Report",
    //     text: `Please check the attached materialQuote report.\n\nClick on this link to send Approve or Reject the material quote: ${statusLink}`,
    //   html: `
    //   <table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
    // 	<tr>
    // 		<td style="text-align: center;"><a href="#" style="display: block;">
    //     <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
    //     </tr>
    // 	<tr>
    // 		<td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Material Quote</td>
    // 	</tr>
    // 	<tr>
    // 		<td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 20px;">For details, please check the materialQuote PDF attached at the bottom of this email.</td>
    // 	</tr>
    // 	<tr>
    // 		<td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
    // 			<p style="font-size: 14px;">To Approve or Reject the material quote.</p>
    // 			<a href=${statusLink} style="background: #FFE003; border: 1px solid #231F20; text-decoration: none; padding: 6px 20px; display: inline-block; border-radius: 4px; color:#231F20; font-size:14px; font-weight:500;">Click here </a>
    // 		</td>
    // 	</tr>
    // 	<tr>
    // 		<td style="padding: 0 30px;">
    // 			<p style="text-align: center; font-size: 14px; color: #555;">  For any questions or clarifications regarding this quote, feel free to contact our support team.<br>  <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | <a href="tel:mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a></p>
    // 		</td>
    // 	</tr>
    // </table>
    //   `,
    //     // attachments: [
    //     //     {
    //     //         filename: path.basename(filePath),
    //     //         path: path.resolve(filePath)
    //     //     }
    //     // ]
    // };

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Quote Report",
      text: `Click on this link to Approve or Reject the quote: ${statusLink}`,
      html: `
    <table cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; width: 100%;background: #f9f9f9; padding: 20px;">
      <tr>
        <td style="text-align: center;">
          <a href="#" style="display: block;">
            <img src="https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/fortress-black-logo.png" alt="Logo" style="max-width: 160px; height: auto;" />
          </a>
        </td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 28px; font-weight: 600;padding: 20px 0;color: #231F20;">Quote</td>
      </tr>
      <tr>
        <td style="text-align:center; font-size: 16px; font-weight: 500; color: #231F20; padding: 0 0 20px;">
          Please check the link below, which contains the quote, and kindly review it to either Accept or Reject.
        </td>
      </tr>
      <tr>
        <td style="background:#fff9da; border: 1px solid #e1e1e1; border-radius:6px; padding: 10px 10px 30px; text-align: center;">
          <p style="font-size: 14px;">To Approve or Reject the quote.</p>
          <a href="${statusLink}" style="background: #FFE003; border: 1px solid #231F20; text-decoration: none; padding: 6px 20px; display: inline-block; border-radius: 4px; color:#231F20; font-size:14px; font-weight:500;">Click here</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <p style="text-align: center; font-size: 14px; color: #555;">
            For any questions or clarifications regarding this quote, feel free to contact our support team.<br>  
            <a href="tel:1800-123-456" style="text-decoration: none; color: #555; font-weight:500;">📞 1800-123-456</a> | 
            <a href="mailto:support@fortressroofing.com" style="text-decoration: none; color: #555; font-weight:500;">📧 support@fortressroofing.com</a>
          </p>
        </td>
      </tr>
    </table>
    `,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Email failed:", error);
    }
  },
  async sendPOEmail(email, poNumber) {
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    );

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Purchase Order ${poNumber}`,
      html: `
      <table cellspacing="0" cellpadding="0" border="0"
        style="max-width:600px;margin:0 auto;width:100%;background:#f9f9f9;padding:20px;">
        <tr>
          <td>
            <h3>Purchase Order </h3>
            <p>Dear Vendor,</p>
            <p>Purchase Order <b>${poNumber}</b> has been.</p>
            <p>Please confirm shipment details.</p>
          </td>
        </tr>
      </table>
    `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("PO email sent successfully");
    } catch (error) {
      console.error("PO email failed:", error);
      // ❗ optional: don't throw (PO already SENT)
    }
  }

};
