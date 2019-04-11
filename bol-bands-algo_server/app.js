/**
 * Module dependencies.
 */
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const logger = require("morgan");
const chalk = require("chalk");
const errorHandler = require("errorhandler");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const expressStatusMonitor = require("express-status-monitor");
const cron = require("node-cron");

const cryptoCompareInterface = require("@lib/CryptoCompareInterface");
const priceEvaluationTaskRunner = require("@lib/PriceEvaluationTaskRunner");
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: ".env" });

/**
 * Controllers (route handlers).
 */
// const homeController = require('./controllers/home');
const apiController = require("./controllers/api");

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("error", err => {
    console.error(err);
    console.log(
        "%s MongoDB connection error. Please make sure MongoDB is running.",
        chalk.red("✗")
    );
    process.exit();
});

/**
 * Express configuration.
 */
app.set("host", process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

/**
 * API examples routes.
 */
app.get("/api/test", apiController.test);
app.post("/api/evaluate", apiController.evaluate);
app.post("/api/snapshot", apiController.snapshot);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === "development") {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send("Server Error");
    });
}

// run once a day
cron.schedule("0 0 * * *", async () => {
    cryptoCompareInterface.takeSnapshot();
});

// run once every hour
cron.schedule("* * */1 * *", async () => {
    priceEvaluationTaskRunner.evaluatePrice();
});

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
    console.log(
        "%s App is running at http://localhost:%d in %s mode",
        chalk.green("✓"),
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
