const express = require('express');
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const app = express();
const systemRoute = require("./routes/system");
const userRoute = require("./routes/user");
const packageRoute = require("./routes/package")
const transportRoute = require("./routes/transport");
require('dotenv').config()

const swaggerDocument = YAML.load('./swagger.yaml');
const cors = require("cors");
const req = require('express/lib/request');


const PORT = 3013;
app.use(bodyParser.json());
app.use(cors());

app.use("/system", systemRoute);
app.use("/user", userRoute);
app.use("/package", packageRoute);
app.use("/transport", transportRoute);





//For parse errors.
app.use(function(error, req, res, next) {
    if (error instanceof SyntaxError) {

        res.sendStatus(500);
        console.log(error)
    }
});

app.get("/", (req, res) => {

    console.log("Main Page Request");
    res.redirect(`/api-docs/`);
})

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}`));