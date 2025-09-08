import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import moment from "moment";
import * as database from "./config/database";

import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// PUG
app.set("views", "./views");
app.set("view engine", "pug");

// Tiny MCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Cookie
app.use(cookieParser("JKJHKAJSHDADGAS"));
app.use(session({ cookie: { maxAge: 60000 } }));

//Flash
app.use(flash());

// Admin Routes
adminRoutes(app);

// Client Routes
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
