const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Shipment = require("../models/Shipment");

exports.createOrder = async (req, res) => {
    try {
        console.log("Incoming Order Request:", req.body);
        console.log("Authenticated User:", req.user);

        if (req.user.role !== "customer") {
            return res.status(403).json({ msg: "Access denied! Only customers can place orders" });
        }

        const { customerId, vendorId, products, totalAmount } = req.body;

        if (!customerId || !vendorId || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const order = new Order({ customerId, vendorId, products, totalAmount });
        await order.save();

        console.log("Order Created Successfully:", order);

        await Cart.findOneAndDelete({ userId: customerId });

        res.status(201).json({ msg: "Order created", order });

    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ msg: "Failed to create order", error: error.message });
    }
};


exports.getOrder = async (req, res) =>{
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied! Admins only" });
        }

        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", status } = req.query;
        const filter = {};
        
        if (status) filter.orderStatus = status;

        const totalOrders = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate("customerId", "name email")
            .populate("vendorId", "storeName")
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalOrders / limit),
            totalItems: totalOrders,
            orders
        });

    }catch (error) {
        res.status(500).json({ msg: "Failed to fetch order"});
    }
};


exports.getOrderById = async (req, res) =>{
    try {
        const order = await Order.findById(req.params.orderId)
        .populate("customerId", "name email")
        .populate("vendorId", "storeName")
        .populate("products.productId");
        if(!order) {
            return res.status(404).json({ msg: "Order not found"});
        }

        if (req.user.role === "customer" && order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied! You can only view your own orders" });
        }

        if (req.user.role === "vendor" && order.vendorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied! You can only view orders from your store" });
        }

        res.json(order);

    }catch (error) {
        res.status(500).json({ msg: "Failed to fetch order"});
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
            console.error("Order not found");
            return res.status(404).json({ msg: "Order not found" });
        }

        if (status === "Shipped") {
            const shipment = await Shipment.findOne({ orderId });
            if (!shipment) {
                return res.status(400).json({ error: "Cannot mark as Shipped without an active shipment" });
            }
        }

        if (req.user.role === "customer") {
            return res.status(403).json({ error: "Access denied! Customers cannot update order status" });
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
        const { orderId } = req.params;
        const order =await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const shipment = await Shipment.findOne({ orderId });

        if (shipment && shipment.status === "In Transit") {
            return res.status(400).json({ error: "Cannot cancel an order that has already been shipped" });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({ error: "Order has already been cancelled" });
        }


        if (req.user.role === "customer") {
            if (order.customerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "Access denied! You can only cancel your own orders" });
            }

            if (order.orderStatus !== "Pending" && order.orderStatus !== "Processing") {
                return res.status(400).json({ error: "You can only cancel orders before they are shipped" });
            }
        }
            
        order.orderStatus = "Cancelled";
        await order.save();

        res.status(200).json({ msg: "Order cancelled successfully", order });

    } catch (error) {
        console.error("Error in cancelOrder:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};