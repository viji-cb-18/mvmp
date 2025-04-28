const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Shipment = require("../models/Shipment");
const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinaryconfig");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming Order Request:", req.body);
    console.log("Authenticated User:", req.user);

    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({ msg: "Access denied! Only customers can place orders" });
    }

    const customerId = req.user._id;
    const { vendorId, products, totalAmount, paymentMethod = "cod" } = req.body;

    const customer = await User.findById(customerId).lean();
      if (!customer) return res.status(404).json({ msg: "Customer not found" });

      const shippingAddress = customer.address || {
        street: "",
        city: "",
        postalCode: "",
        country: "",
      };
      
    console.log("📥 vendorId:", vendorId);
    console.log("📥 products:", products);
    console.log("📥 totalAmount:", totalAmount, "| Type:", typeof totalAmount);

    if (
      !vendorId ||
      !Array.isArray(products) ||
      products.length === 0 ||
      typeof totalAmount !== "number"
    ) {
      return res.status(400).json({ msg: "Missing or invalid required fields" });
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ msg: "Invalid payment method" });
    }

    const order = new Order({
      customerId,
      vendorId,
      products,
      totalAmount,
      paymentMethod,
      orderStatus: "Pending",
      shippingAddress, 
    });
    
    await order.save();

    console.log("Order saved to DB with ID:", order._id);
    console.log("Connected DB name:", require("mongoose").connection.name);

    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } }, 
        { new: true }
      );
    }

    await Cart.findOneAndDelete({ userId: customerId });

    return res.status(201).json({
      msg: "Order created successfully",
      order,
    });

  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      msg: "Server error while creating order",
      error: error.message,
    });
  }
};


exports.getAllOrder = async (req, res) => {
    try {
      console.log("🔐 getAllOrder called by:", req.user?.email || "unknown");
  
      if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied! Admins only" });
      }
  
      const {
        page = 1,
        limit = 1000,
        sortBy = "createdAt",
        order = "desc",
        status,
      } = req.query;
  
      const filter = {};
      if (status) filter.status = status;
  
      const totalOrders = await Order.countDocuments(filter);
  
      const orders = await Order.find(filter)
        .populate("customerId", "name email")
        .populate({
          path: "vendorId",              
          model: "User",                 
          select: "storeName"
        })
        .populate("products.productId", "name price images")
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(); 
  
      console.log(`${orders.length} orders fetched`);
  
      return res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalOrders / limit),
        totalItems: totalOrders,
        orders,
      });
  
    } catch (error) {
      console.error("Error in getAllOrder:", error.message || error);
      return res.status(500).json({
        msg: "Failed to fetch orders",
        error: error.message || String(error) || "Unknown error",
      });
    }
  };
  
  

  exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("customerId", "name email")
        .populate("vendorId", "storeName")
        .populate("products.productId", "name price images");
  
      if (!order) {
        return res.status(404).json({ msg: "Order not found" });
      }
  
      const loggedInUserId = req.user._id.toString();
      const customerId = order.customerId?._id?.toString() || order.customerId.toString();
      const vendorId = order.vendorId?._id?.toString() || order.vendorId.toString();
  
      if (req.user.role === "customer" && customerId !== loggedInUserId) {
        return res.status(403).json({ error: "Access denied! You can only view your own orders" });
      }
  
      if (req.user.role === "vendor" && vendorId !== loggedInUserId) {
        return res.status(403).json({ error: "Access denied! You can only view orders from your store" });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Error in getOrderById:", error.message);
      res.status(500).json({ msg: "Failed to fetch order", error: error.message });
    }
  };
  

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Order status is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (req.user.role === "customer") {
      return res.status(403).json({ error: "Access denied! Customers cannot update order status" });
    }

    if (status === "Shipped") {
      let shipment = await Shipment.findOne({ orderId });
      if (!shipment) {
        shipment = new Shipment({
          orderId,
          trackingNumber: `TRK-${Date.now()}`,
          carrier: "Manual", 
          status: "In Transit"
        });
        await shipment.save();
      }
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ msg: "Failed to update order status", error: error.message });
  }
};


exports.deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied! Admins only" });
        }

        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ msg: "Order deleted successfully" });
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        res.status(500).json({ msg: "Failed to delete order", details: error.message });
    }
};

            

  exports.cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      
      if (order.orderStatus === "Cancelled") {
        return res.status(400).json({ error: "Order is already cancelled" });
      }
  
      order.orderStatus = "Cancelled";

      await order.save();
  
      res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
      console.error("Cancel error:", error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  };
  
  
  exports.requestReturn = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { productId, reason } = req.body;
      const file = req.file;
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ msg: "Order not found" });
  
      const item = order.products.find(
        (p) => p.productId.toString() === productId
      );
      if (!item) return res.status(404).json({ msg: "Product not found in order" });
  
      if (order.orderStatus !== "Delivered")
        return res.status(400).json({ msg: "Only delivered orders can be returned" });
  
      if (item.returnRequested)
        return res.status(400).json({ msg: "Return already requested for this product" });
  
      let imageUrl = null;
      if (file) {
        const result = await new Promise((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder: "returns" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          upload.end(file.buffer);
        });
        imageUrl = result.secure_url;
      }
  
      item.returnRequested = true;
      item.returnReason = reason;
      item.returnImage = imageUrl || null;
  
      await order.save();
      res.status(200).json({ msg: "Return requested", order });
    } catch (err) {
      console.error("Return error:", err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };

  
  
  exports.approveReturnRequest = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { productId } = req.body;
  
      const order = await Order.findById(orderId).populate("products.productId");
      if (!order) return res.status(404).json({ msg: "Order not found" });
  
      const item = order.products.find((p) => {
        const pid = p.productId._id || p.productId;
        return pid.toString() === productId;
      });
  
      if (!item) return res.status(404).json({ msg: "Product not found in order" });
  
      if (!item.returnRequested)
        return res.status(400).json({ msg: "Return not requested for this product" });
  
      if (item.returnApproved === true)
        return res.status(400).json({ msg: "Already approved" });
  
      const refundAmount = item.price * item.quantity * 100;
  
      if (order.paymentMethod === "Card" && order.paymentIntentId) {
        await stripe.refunds.create({
          payment_intent: order.paymentIntentId,
          amount: refundAmount,
          reason: "requested_by_customer",
        });
      }
  
      if (order.paymentMethod === "COD") {
        item.manualRefundRequired = true;
      }
      
      item.returnRequested = false;
      item.returnApproved = true;
      
      const allProductsReturned = order.products.every(
        (p) => p.returnApproved
      );
      
      if (allProductsReturned) {
        order.orderStatus = "Refunded";
      }
      

      await order.save();
  
      res.status(200).json({
        msg:
          order.paymentMethod === "Card"
            ? "Return approved and refund processed"
            : "Return approved. Manual refund required (COD).",
        order,
      });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  

  exports.rejectReturnRequest = async (req, res) => {
    try {
      const { orderId, productId } = req.params;
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ msg: "Order not found" });
  
      const item = order.products.find((p) =>
        p.productId.toString() === productId.toString()
      );
  
      if (!item) return res.status(404).json({ msg: "Product not found in order" });
  
      if (!item.returnRequested) {
        return res.status(400).json({ msg: "No return requested for this product" });
      }
  
      item.returnRequested = false;
      item.returnReason = "";
      item.returnImage = "";
      item.returnRejected = true;
      item.returnReviewedAt = new Date();
  
      await order.save();
  
      res.status(200).json({ msg: "Return rejected", order });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  
  

  exports.getMyOrders = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
  
      const ordersWithShipment = await Promise.all(
        orders.map(async (order) => {
          const shipment = await Shipment.findOne({ orderId: order._id });
          return {
            ...order.toObject(),
            shipmentStatus: shipment?.status || null,
          };
        })
      );
  
      res.status(200).json({ success: true, data: ordersWithShipment });
  
    } catch (err) {
      res.status(500).json({
        error: "Failed to fetch customer orders",
        details: err.message,
      });
    }
  };
  
/*     
exports.getVendorOrders = async (req, res) => {
    try {
      const vendorId = req.user._id;
  
      const orders = await Order.find({ vendorId })
        .populate('customerId', 'name email')
        .populate('products.productId', 'name price image')
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  };
  */
  /*exports.getVendorOrders = async (req, res) => {
    try {
      const vendorId = req.user._id;
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const filter = { vendorId };
  
      const total = await Order.countDocuments(filter);
  
      const orders = await Order.find(filter)
        .populate('customerId', 'name email')
        .populate('products.productId', 'name price image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: orders,
      });
    } catch (error) {
      console.error("Vendor orders fetch failed:", error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  };
  
*/
exports.getVendorOrders = async (req, res) => {
  try {
    console.log("Fetching vendor orders...");

    if (!req.user) {
      console.error("No user found in request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const vendorId = req.user._id;
    console.log("Vendor ID:", vendorId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { vendorId };

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('customerId', 'name email')  // check if customerId exists in Order schema
      .populate('products.productId', 'name price image') // check if products.productId exist properly
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("Fetched orders:", orders.length);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: orders,
    });
  } catch (error) {
    console.error("Vendor orders fetch failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

