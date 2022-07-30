import express, { Express, Request, Response, RequestHandler } from "express";
const app: Express = express();

var boolParser = require("express-query-boolean");

import userAgent from "express-useragent";

import { lookup } from "geoip-lite";

import getClientIp from "@supercharge/request-ip";

import cookieParser from "cookie-parser";

import csrf from "csurf";
const csrfProtection = csrf({ cookie: true });

import helmet from "helmet";

import cors from "cors";

import path from "path";

import nocache from "nocache";

require("dotenv").config();

import { databaseConnection } from "./model/dbConnection";

import customErrorMiddleware from "./middleware/errorHandling/customErrorMiddleware";

import authRoutes from "./routes/authRoutes";
import viewRoutes from "./routes/viewRoutes";
import { projectDbSeeder, phaseDbSeeder, taskDbSeeder } from "./model/dbSeeder";

// no need to set the code below if the views folder is already named views
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "/public"));

app.disable("x-powered-by");

app.set("trust proxy", true);

// url encoded is needed with form data
app.use(express.urlencoded({ extended: true }));
// express.json is needed when parsing json data i.e. rest
app.use(express.json());

app.use(cookieParser(process.env.WALKERS_SHORTBREAD));

app.use(boolParser());

app.use(helmet());

app.use(nocache());

app.set("etag", false);

app.set("trust proxy", 1);

app.use(
  cors({
    // origin: "*",
    origin: process.env.FRONTEND_PORT,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// databaseConnection();
// projectDbSeeder();
// phaseDbSeeder();
// taskDbSeeder();

// app.use(csrfProtection);

app.set("view engine", "ejs");

app.use(function (req, res, next) {
  // res.header("Content-Type", "application/json;charset=UTF-8");
  // res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Allow-Credentials", process.env.FRONTEND_PORT);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.render("pages", { name: "philip" });
  // res.send("authentication server server");
});

app.use("/auth", authRoutes);
app.use("/forms", viewRoutes);

app.get("*", (req, res) => {
  res.send("Page does not exist");
});

app.use(customErrorMiddleware);

app.listen(process.env.PORT || 4000, () => {
  console.log(`App listening on port ${process.env.PORT || 4000}!`);
});

// Authentication - check is user from cookies exist

// Authorization - Check if user is free ser or premium.
