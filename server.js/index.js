const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require('./src/config/db');
connectDB();

console.log("STRIPE_SECRET_KEY =", process.env.STRIPE_SECRET_KEY);
  
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

app.use("/api/auth", require("./src/routes/authRoutes"));
//app.use('/api/admin', require("./src/routes/adminRoutes"));
//app.use("/api/vendors", require("./src/routes/vendorRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/payment", require("./src/routes/paymentRoutes"));
app.use("/api/reviews", require("./src/routes/reviewRoutes"));
app.use("/api/shipment", require("./src/routes/shipmentRoutes"));
app.use("/api/banners", require("./src/routes/bannerRoutes"));
app.use("/api/contacts", require("./src/routes/contactRoutes"));



app.use((req, res) => {
    res.status(404).json({ error: "API Endpoint Not Found" });
});  



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});  
