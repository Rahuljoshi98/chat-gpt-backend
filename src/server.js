import { app } from "./app.js";
import { connectDB } from "./config/index.js";

const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
