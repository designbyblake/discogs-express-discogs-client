
import { DiscogsClient } from '@lionralfs/discogs-client';
import { CLIENT_AUTH } from "../../constants/index.js";

export const getCollection = async (req, res) => {
    const { name, page, per_page, sort, sort_order } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const client = new DiscogsClient(CLIENT_AUTH).setConfig(
            { outputFormat: 'json' }
        ).user().collection();

        const { data } = await client.getReleases(name, 0, {
            page: page || 1,
            per_page: per_page || 500,
            sort: sort || 'added',
            sort_order: sort_order || 'desc'
        });
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Discogs API:", error);
        res.status(500).json({ error: "Failed to fetch data from Discogs API" });
    }
}