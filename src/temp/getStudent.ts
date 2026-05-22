import { supabase } from "@/lib/supabase";

async function getStudents(teacherId: string) {
  console.log("FETCHING FOR TEACHER:");

  console.log(teacherId);

  const response = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", teacherId);

  console.log("RESULT:");

  console.log(response);
}

// PASS TEACHER ID HERE
getStudents("c0d54e9e-d2a4-40b9-98d5-24cb2cd5e6c6");
