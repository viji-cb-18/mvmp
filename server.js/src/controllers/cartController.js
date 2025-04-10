const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");


exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        const userId = req.user._id;  
        
        if (!productId || quantity < 1) {
            return res.status(400).json({ error: "Invalid product or quantity" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: product.price });
        }

     
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        await cart.save();
        res.status(201).json({ msg: "Item added to cart", cart });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ msg: "Failed to add to cart", details: error.message });
    }
};


exports.getCart = async (req, res) => {
    try{
        const userId  = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.productId", "name price");

        if(!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }
            res.status(200).json(cart);
    }catch (error) {
        res.status(500).json({ msg: "Failed to fetch cart"});
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;  
        const { productId, quantity } = req.body;  

        if (!productId || quantity < 1) {
            return res.status(400).json({ error: "Invalid product or quantity" });
        }

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ msg: "Product not found in cart" });
        }

        cartItem.quantity = quantity;
        await cart.save();

        res.status(200).json({ msg: "Cart updated successfully",cart });
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;  
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found for this user" });
        }

      
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex === -1) {
            return res.status(404).json({ msg: "Product not found in cart" });
        }

       
        cart.items.splice(existingItemIndex, 1);

       
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        await cart.save();
        return res.status(200).json({ msg: "Item removed from cart", cart });

    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({ msg: "Failed to remove item from cart", details: error.message });
    }
};



exports.clearCart = async (req, res) => {
    try {
        
        const cart = await Cart.findById(req.params.cartId );
        if (!Cart) {
            return res.status(404).json({ msg: "Cart not found for this user" });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ msg: "Cart cleared successfully" });      
        
    } catch (error) {
        res.status(500).json({ msg: "Failed to clear cart"});
    }
};