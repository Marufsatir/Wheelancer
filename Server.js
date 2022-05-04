const express = require('express');
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const app = express();
const cors = require("cors");
const randomCoordinates = require('random-coordinates');
const morgan = require('morgan')
require('dotenv').config()

const systemRoute = require("./routes/system");
const userRoute = require("./routes/user");
const packageRoute = require("./routes/package")
const transportRoute = require("./routes/transport");
const adminRoute = require("./routes/admin");


const swaggerDocument = YAML.load('./swagger.yaml');


app.use(morgan(":date[clf] :remote-addr :method [:status] :url - :response-time ms"))

app.use(bodyParser.json());
app.use(cors());



app.use("/system", systemRoute); //For creating inserting, deleting tables, data.
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/package", packageRoute);
app.use("/transport", transportRoute);


app.use("/test", async(req, res) => {


    res.status(200).json({
        result: randomCoordinates()
    })

})



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

app.listen(process.env.PORT, () => console.log(`API is running on http://localhost:${process.env.PORT}`));