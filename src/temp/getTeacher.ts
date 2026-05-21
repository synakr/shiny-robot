import { supabase } from "@/lib/supabase";

async function getTeacher() {
  const response = await supabase.from("teachers").select("*");

  console.log("TEACHERS:");
  console.log(response);
}

getTeacher();
