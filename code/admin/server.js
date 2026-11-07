const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

// Set up static files directory for Tailwind CSS and client JS
app.use(express.static(path.join(__dirname, "public")));

// Set up EJS Templating Engine and Layouts
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Extract scripts and styles from sub-views into the main layout automatically
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Set the global default layout file location
app.set("layout", "layouts/main");

// Mock Data Source for Dashboard UI
const mockTransactions = [
  {
    customer: "Olivia Martin",
    status: "Paid",
    date: "2026-10-05",
    amount: "+\$1,999.00",
  },
  {
    customer: "Jackson Lee",
    status: "Paid",
    date: "2026-10-04",
    amount: "+\$39.00",
  },
  {
    customer: "Isabella Nguyen",
    status: "Pending",
    date: "2026-10-04",
    amount: "+\$299.00",
  },
  {
    customer: "William Kim",
    status: "Paid",
    date: "2026-10-03",
    amount: "+\$99.00",
  },
  {
    customer: "Sofia Davis",
    status: "Pending",
    date: "2026-10-01",
    amount: "+\$2,499.00",
  },
];

// Example modification if using helmet middleware in server.js
const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://jsdelivr.net"],
      },
    },
  }),
);

// App Routes
app.get("/", (req, res) => {
  // Mock analytics data fetched from a database
  const monthlyRevenueData = revenueData;
  const trafficSources = trafficData; // Direct, Organic, Referral
  res.render("index", {
    title: "Overview - Admin Dashboard",
    currentRoute: "/",
    transactions: mockTransactions,
    // Pass arrays directly to EJS
    revenueData: monthlyRevenueData,
    trafficData: trafficSources,
  });
});

app.get("/analytics", (req, res) => {
  res.render("analytics", {
    title: "Analytics - Admin Dashboard",
    currentRoute: "/analytics",
  });
});

// Start Production Server
app.listen(PORT, () => {
  console.log(`🚀 Production dashboard live at http://localhost:${PORT}`);
});
