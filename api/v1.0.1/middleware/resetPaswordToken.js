const jwt = require("jsonwebtoken");
const config = require("../../../config/db.config");

verifyResetToken = (req, res, next) => {
  let token = req.headers["x-reset-token"];

  if (!token) {
    return res.status(200).send({
      status: false,
      message: "Reset token missing",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(200).send({
        status: false,
        message: "Reset token expired or invalid",
      });
    }

    if (decoded.type !== "RESET_PASSWORD") {
      return res.status(200).send({
        status: false,
        message: "Invalid reset token",
      });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyResetToken };
