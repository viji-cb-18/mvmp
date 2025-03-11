const Order = require("../models/Order");

//Create Order
exports.createOrder = async (req, res) =>{
    try {
        const { customerId, vendorId, products, totalAmount } = req.body;

        const order = new Order({ customerId, vendorId, products, totalAmount });
        await order.save();

        res.status(201).json({ message: "Order created", order });

    }catch (error) {
        res.status(500).json({ error: "Failed to create order"});
    }
};

//Get All Orders
exports.getOrder = async (req, res) =>{
    try {
        const orders = await Order.find().populate("customerId", "name email").populate("vendorId", "storeName");

        res.json(orders);

    }catch (error) {
        res.status(500).json({ error: "Failed to fetch order"});
    }
};

//Get Order by ID
exports.getOrderById = async (req, res) =>{
    try {
        const order = await Order.findById(req.params.orderId).populate("customerId vendorId products.productId");
        if(!order) {
            return res.status(404).json({ error: "Order not found"});
        }
        res.json(order);

    }catch (error) {
        res.status(500).json({ error: "Failed to fetch order"});
    }
};

//Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
       const { orderId } = req.params;
       const { orderStatus } = req.body;

       const order = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
       if( !order){ 
        return res.status(404).json({ error: "Order not found "});
       }
       res.json({ message: "Order status updated", order });
   }catch (error) {
    res.status(500).json({ error: "Failed to update order status"});
   }
};   

/*exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found"});
        }

        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: "Order deleted sucessfully" });

    } catch (error) {
        console.error(" Error in deleteOrder:", error);
        res.status(200).json({ error: "Failed to delete ordeer", details: error.message });
    }
};*/

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Delete order
        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        res.status(500).json({ error: "Failed to delete order", details: error.message });
    }
};