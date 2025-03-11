const mongoose = require("mongoose");

const connectDB = async () => {

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected");
    } catch (error) {
        console.log("MongoDB connect failed", error);
        process.exit(1);
    }
}

module.exports = connectDB;