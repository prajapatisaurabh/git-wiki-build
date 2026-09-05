import express from "express";
import dotenv from "dotenv";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});