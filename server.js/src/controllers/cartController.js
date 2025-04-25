const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

  exports.addToCart = async (req, res) => {
    try {
      
      if (!req.user || !req.user._id) {
        return res.status(401).json({ msg: "User not authenticated" });
      }

      const { productId, quantity } = req.body;
      const userId = req.user._id;
  
      console.log("Add to cart request:", { userId, productId, quantity });
  
      if (!productId || quantity < 1) {
        console.warn("Invalid product or quantity");
        return res.status(400).json({ error: "Invalid product or quantity" });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        console.warn("Product not found:", productId);
        return res.status(404).json({ error: "Product not found" });
      }
  
      let cart = await Cart.findOne({ userId });
      console.log("Existing cart:", cart);
  
      if (!cart) {
        console.log("No cart found, creating a new one");
        cart = new Cart({ userId, items: [], totalPrice: 0 });
      }
  
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
  
      if (existingItem) {
        existingItem.quantity += quantity;
        console.log("Updated quantity of existing item:", existingItem);
      } else {
        console.log("Product price being added:", product.price); 

        const newItem = {
          productId,
          quantity,
          price: product.price,
        };
        cart.items.push(newItem);
        console.log("Added new item to cart:", newItem);
      }
  
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
  
      console.log("💰 Total Price Updated:", cart.totalPrice);
  
      try {
        await cart.save();
        console.log("Cart saved:", cart);
        res.status(201).json({ msg: "Item added to cart", cart });
      } catch (saveError) {
        console.error("Error saving cart:", saveError.message);
        return res.status(500).json({
          msg: "Error saving cart",
          error: saveError.message,
        });
      }
      
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ msg: "Failed to add to cart", details: error.message });
    }
  };
  


exports.getCart = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name price vendor images",
        populate: { path: "vendor", select: "_id storeName" }, 
      });
  
      if (!cart) {
        return res.status(404).json({ msg: "Cart not found" });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error(" Failed to fetch cart:", error);
      res.status(500).json({ msg: "Failed to fetch cart" });
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
      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        return res.status(404).json({ msg: "Cart not found for this user" });
      }
  
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
  
      res.status(200).json({ msg: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error in clearCart:", error);
      res.status(500).json({ msg: "Failed to clear cart", details: error.message });
    }
  };
  