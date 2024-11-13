const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB connected');
    } catch (error) {
        console.error("MongoDB is not connected:", error.message);
        setTimeout(connectDb, 5000);
    }
};

connectDb();
module.exports = mongoose;
