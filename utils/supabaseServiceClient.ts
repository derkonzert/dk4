import { createClient } from "@supabase/supabase-js";
import { Nullable } from "typescript-nullable";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabaseServiceClient = createClient(
  Nullable.withDefault("", supabaseUrl),
  Nullable.withDefault("", supabaseServiceKey)
);
