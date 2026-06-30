import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import helmet from "helmet";
// import pg from 'pg';
import connectPgSimple from "connect-pg-simple";
import csrf from "csurf";

//OTHER IMPORTS
import {
  CLIENT_URL,
  NODE_ENV,
  SESSION_SECRET,
  DATABASE_URL,
} from "./config/env.js";
import sequelize from "./database/db.js";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import contactRouter from "./routes/contact.route.js";
import homeRouter from "./routes/home.route.js";
import passwordResetRouter from "./routes/passwordReset.route.js";
import { protects } from "./middlewares/auth.middleware.js";
import { csrfProtection } from "./middlewares/csrf.Middleware.js";
import { detectDevice } from "./middlewares/device.middleware.js";
import { limiter } from "./middlewares/rateLimiter.middleware.js";
import credentials from "./middlewares/credentials.middleware.js";
import corsOptions from "./config/corsOptions.js";

const app = express();
const port = PORT || 4000;
// const pgPool = new pg.Pool({
//   user: "",
//   host: "",
//   database: "",
//   password: "",
//   port: 5432,
// });

const pgSession = connectPgSimple(session);
const store = new pgSession({
  // pool: pgPool,
  conString: DATABASE_URL,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");

  next();
});

// app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join("views"));
// Enable HTTP
app.set("trust proxy", 1);
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  session({
    store: store,
    secret:
      SESSION_SECRET || "hendleStupidityInthecodeBaseThathAsSoManYErroZ107xc/.",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  }),
);

// app.use(csrfProtection());
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
  csrfProtection;
  res.locals.csrfProtection = req.csrfToken();

  next();
});

app.use(detectDevice);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(flash());
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  }),
);

app.get("/", (req, res) => {
  res.sendFile(path.join("public", "home.ejs"));
});

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  return next();
});

app.use(limiter); // It applies to all routes
app.use((req, res, next) => {
  res.locals.rateLimit = {
    remaining: limiter.resetTime - Date.now(),
    limit: limiter.max,
  };
  next();
});

// While below ones applies to some specific routes:
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", limiter, adminRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/homes", homeRouter);
app.use("/api/v1/passwords", limiter, passwordResetRouter);

// TO PROTECT
// app.get("/home", protects, (req, res) => {
//   res.render("home", {
//     user: req.user,
//   });
// });

sequelize
  .sync()
  .then(() => {
    console.log("Database is syncing!");
    app.listen(port, () => {
      console.log(`Server is listening on port localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Server is not responding: ${err}`);
    process.exit(1);
  });

export default app;
