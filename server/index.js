import express from "express";
import cors from "cors";
import parseRoutes from "./routes/parseRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/parse", parseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});