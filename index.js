import express from 'express';
import mongoDB from "./db.js";
import CreateUser from "./routes/CreateUser.js";
import foodData from "./routes/DisplayFoodData.js";
import orderData from "./routes/OrderData.js";
import myorderData from "./routes/OrderData.js";

mongoDB(); // connect to MongoDB

const app = express();
const port = 5000;

// Manual CORS middleware
app.use((req, res, next) => {
  // Allow requests from frontend
  res.setHeader("Access-Control-Allow-Origin", "https://fastfoodbysam.netlify.app");

  // Allow these HTTP methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Allow these headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, auth-token" // <- add your custom header here
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware to parse JSON
app.use(express.json());

// Use the routers
app.use("/api", CreateUser);
app.use("/api", foodData);
app.use("/api", orderData);
app.use("/api", myorderData);
// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
