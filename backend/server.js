import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`⚙️  Server is running at port : ${PORT}`);
        });
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}

startServer();
