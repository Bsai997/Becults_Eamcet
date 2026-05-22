import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { config } from "../config.js";

if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
  throw new Error("Missing Supabase configuration in environment variables.");
}

export const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  realtime: {
    transport: ws,
  },
});
