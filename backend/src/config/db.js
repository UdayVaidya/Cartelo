import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/snitch`);
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
        // Try to drop the broken index that causes Google OAuth failures
        try {
            await mongoose.connection.collection('usermodels').dropIndex('contact_1');
            console.log('Dropped old contact_1 index to fix OAuth bug');
        } catch(e) {
            // Ignore if index doesn't exist
        }
    } catch (error) {
        console.error("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;   