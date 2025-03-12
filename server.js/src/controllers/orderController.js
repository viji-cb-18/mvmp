const Order = require("../models/Order");
const Cart = require("../models/Cart");


exports.createOrder = async (req, res) =>{
    try {
        const { customerId, vendorId, products, totalAmount } = req.body;

        const order = new Order({ customerId, vendorId, products, totalAmount });
        await order.save();

        await Cart.findOneAndDelete({ userId: customerId });

        res.status(201).json({ msg: "Order created", order });

    }catch (error) {
        res.status(500).json({ msg: "Failed to create order"});
    }
};


exports.getOrder = async (req, res) =>{
    try {
        const orders = await Order.find().populate("customerId", "name email").populate("vendorId", "storeName");

        res.json(orders);

    }catch (error) {
        res.status(500).json({ msg: "Failed to fetch order"});
    }
};


exports.getOrderById = async (req, res) =>{
    try {
        const order = await Order.findById(req.params.orderId).populate("customerId vendorId products.productId");
        if(!order) {
            return res.status(404).json({ msg: "Order not found"});
        }
        res.json(order);

    }catch (error) {
        res.status(500).json({ msg: "Failed to fetch order"});
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
       const { orderId } = req.params;
       const { orderStatus } = req.body;

       const order = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
       if( !order){ 
        return res.status(404).json({ msg: "Order not found "});
       }

       if (trackingNumber && carrier) {
        await Shipment.findOneAndUpdate(
            { orderId },
            { trackingNumber, carrier, status: orderStatus },
            { upsert: true }
        );
       }

       res.json({ message: "Order status updated", order });
   }catch (error) {
    res.status(500).json({ msg: "Failed to update order status"});
   }
};   

exports.deleteOrder = async (req, res) => {
    try {
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