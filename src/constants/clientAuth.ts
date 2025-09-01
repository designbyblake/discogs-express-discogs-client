import user from "@lionralfs/discogs-client/types/user";
import dotenv from "dotenv";
import { Auth } from "@lionralfs/discogs-client";
dotenv.config({ path: "./.env.local" });

export const CLIENT_AUTH: Partial<{
  userAgent: string;
  auth: Partial<Auth>;
}> = {
  userAgent: "DiscogsClient/1.0",
  auth: {
    method: "discogs",
    consumerKey: process.env.DISCOGS_CONSUMER_KEY || "",
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET || "",
  },
};
