const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const swaggerUi = require("swagger-ui-express");
const auths = require("basic-auth");
const swaggerDocumentV_1_0_0 = require("./api/apidocs/apiDoc.v1.0.0.json");
const PORT = process.env.PORT || 8000;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", (req, res) => {
  res.send("Hello with Node.js!");
});
let options = {};

app.use(
  "/apidocs",
  (req, res, next) => {
    let user = auths(req);
    if (
      user === undefined ||
      user["name"] !== "blue-sky" ||
      user["pass"] !== "X7bG9mT2"
    ) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="Node"');
      res.end("Unauthorized");
    } else {
      next();
    }
  },
  swaggerUi.serveFiles(swaggerDocumentV_1_0_0, options),
  swaggerUi.setup(swaggerDocumentV_1_0_0)
)

app.use(
  "/apidocs",
  swaggerUi.serveFiles(swaggerDocumentV_1_0_0, options),
  swaggerUi.setup(swaggerDocumentV_1_0_0)
);

app.use("/api", require("./api"));

// app.use(express.static("files"));
// app.use("/public/files", express.static("public/files"));
app.use("/files", express.static(path.join(__dirname, "public/files")));

app.listen(PORT, () => {
  console.log(`Server Running here :point_right: https://localhost:${PORT}`);
});