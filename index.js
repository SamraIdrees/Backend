import dotenv from "dotenv";
import dbConnection from "./databaseConnection/dbconnection.js";
import { app } from "./app.js";

import chatRoutes from "./routes/chatRoutes.js";
app.use("/api/chat", chatRoutes);


// Load environment variables from the .env file
dotenv.config();

dbConnection() // Calling the function
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
})
