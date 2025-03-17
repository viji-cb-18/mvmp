const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");


exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity,price} = req.body;

        let cart = await Cart.findOne({ userId });
        if(!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity, price}], totalPrice: quantity * price});
        } else {
            cart.items.push({ productId,quantity, price });
            cart.totalPrice += quantity * price;
        }

        await cart.save();
        res.status(201).json({ msg: "Item added to cart", cart});
    } catch (error) {
        res.status(500).json({ msg: "Failed to add to cart"});
    }
};


exports.getCart = async (req, res) => {
    try{
        const { userId } = req.params;
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
        const { userId } = req.params;  
        const { productId, quantity } = req.body;  

        if (!userId || !productId || quantity === undefined) {
            return res.status(400).json({ msg: "User ID, Product ID, and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ msg: "Product not found in cart" });
        }

        if (quantity <= 0) {
            cart.items.splice(cartItemIndex, 1);
        } else {
            cart.items[cartItemIndex].quantity = quantity;
            cart.items[cartItemIndex].totalPrice = quantity * product.price; 
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();

        res.status(200).json({
            msg: "Cart updated successfully",
            cart
        });
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne(userId);
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        } 

         const itemIndex = cart.items.findIndex(item => item.productId.toString() !== productId);
            if (itemIndex === -1) {
                return res.status(404).json({ msg: "product not found in cart" });
            }

            cart.items.splice(itemIndex, 1);
            cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        

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