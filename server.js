import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import session from "express-session";
import flash from "connect-flash";
import helmet from "helmet";
import connectPgSimple from "connect-pg-simple";

//OTHER IMPORTS
import {
  CLIENT_URL,
  NODE_ENV,
  SESSION_SECRET,
  DATABASE_URL,
} from "./config/env.js";
import passport from "./config/passport.js";
import sequelize from "./database/db.js";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import contactRouter from "./routes/contact.route.js";
import homeRouter from "./routes/home.route.js";
import passwordResetRouter from "./routes/passwordReset.route.js";
import { authorize, protects } from "./middlewares/auth.middleware.js";
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

// const { Strategy } = pkg;

if (Array.isArray()) {
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join("views"));
app.use(credentials);
app.use(cors(corsOptions));

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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Authentication Protection Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/v1/auth/login");
};

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

// app.get("/api/v1/homes/home", (req, res) => {
//   req.session.views = (req.session.views || 0) + 10;
//   res.send(`You have viewed this page ${req.session.views} times`);
// });

app.use(detectDevice);

// While below ones applies to some specific routes:
app.use("/api/v1/auth", authRouter);
app.use(
  "/api/v1/admin",
  limiter,
  protects,
  authorize("admin", "super_admin"),
  adminRouter,
);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/homes", homeRouter); // ensureAuthenticated,
app.use("/api/v1/passwords", limiter, passwordResetRouter);

//
// OAuth Callback Route
app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user: email"],
    failureRedirect: "/api/v1/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/v1/homes/home");
  },
);
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/api/v1/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/v1/homes/home");
  },
);
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
    failureRedirect: "/api/v1/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/v1/homes/home");
  },
);

//
// Secure Logout Context
app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

// DOWNLOAD CV
app.get("/download-cv/", (req, res) => {
  const cvPath = path.join("public", "me-resume.pdf");
  const cvName = "me-resume.pdf";
  res.download(cvPath, cvName, (err) => {
    if (err) {
      console.error(err);
      req.flash("error_msg", "File not found!");
      return res.redirect("/api/v1/homes/home");
    } else {
      req.flash("success_msg", "CV downloaded successfully!");
    }
  });
});

// DB AND SERVER
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
