import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DiscogsClient } from '@lionralfs/discogs-client';
import { getCollection } from "./routes/discogs/collection.js";

dotenv.config({ path: './.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally: clean up resources, but don't exit
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Optionally: clean up resources, but don't exit
});

let clientAuth = {
    auth: {
        method: 'discogs',
        consumerKey: process.env.DISCOGS_CONSUMER_KEY,
        consumerSecret: process.env.DISCOGS_CONSUMER_SECRET
    }
};

app.post("/", (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const testName = name || "No name sent";
    const data = {
        name: name || "Guest",
        message: `Welcome ${testName} to the Discogs Client API!`
    }
    res.json(data)
});
app.post("/discogs/collection", async (req, res) => {
    getCollection(req, res);
});

app.post("/discogs/collection/values", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const client = new DiscogsClient(clientAuth).setConfig({ outputFormat: 'json' }).user().collection();
        const { data } = await client.getValue(name);
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Discogs API:", error);
        res.status(500).json({ error: "Failed to fetch data from Discogs API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});