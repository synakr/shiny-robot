import { supabase } from "@/lib/supabase";

async function createTeacher() {
  console.log("RUNNING SCRIPT");

  const response = await supabase.from("teachers").insert([
    {
      auth_id: null,

      teacher_name: "Test Teacher",

      institute_name: "Test Institute",

      email: "teacher@test.com",

      primary_color: "#6C63FF",
    },
  ]);

  console.log(response);
}

createTeacher();
