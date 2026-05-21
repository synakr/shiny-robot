import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xpjssevosnpdtfxoefst.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwanNzZXZvc25wZHRmeG9lZnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzgyMjIsImV4cCI6MjA5NDkxNDIyMn0.gOGGl70pehC8_L7w-AEhALbpoaJy0h9CWEHbbTnLFAY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
