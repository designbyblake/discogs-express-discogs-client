import dotenv from "dotenv";
dotenv.config({ path: './.env.local' });


export const CLIENT_AUTH = {
    auth: {
        method: 'discogs',
        consumerKey: process.env.DISCOGS_CONSUMER_KEY,
        consumerSecret: process.env.DISCOGS_CONSUMER_SECRET
    }
};