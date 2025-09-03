import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import moment from "moment";
import * as database from "./config/database";

import clientRoutes from "./routes/client/index.route";

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

// Cookie
app.use(cookieParser('JKJHKAJSHDADGAS'));
app.use(session({ cookie: { maxAge: 60000 }}));

//Flash
app.use(flash());

// App Locals Variables
app.locals.moment = moment;

// Client Routes
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});