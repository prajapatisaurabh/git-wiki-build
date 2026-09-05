import "dotenv/config";
import express from "express";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import routes from "./routes/index.routes.js";

const app = express();
app.use(express.json());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/index", routes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});