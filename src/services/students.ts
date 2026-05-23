import { supabase } from "@/lib/supabase";

export async function getStudentsByTeacher(teacherId: string) {
  const response = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", {
      ascending: false,
    });

  return {
    success: !response.error,

    data: response.data || [],

    error: response.error,
  };
}

export async function createStudent({
  teacherId,

  studentName,

  email,

  phone,

  parentPhone,

  className,

  batchName,

  batchId,

  batchCategory,

  year,

  enrollmentId,

  paymentStatus,
}: {
  teacherId: string;

  studentName: string;

  email?: string;

  phone?: string;

  parentPhone?: string;

  className?: string;

  batchName?: string;

  batchId?: string;

  batchCategory?: string;

  year?: string;

  enrollmentId?: string;

  paymentStatus?: string;
}) {
  const response = await supabase.from("students").insert({
    teacher_id: teacherId,

    student_name: studentName,

    email,

    phone,

    parent_phone: parentPhone,

    class_name: className,

    batch_name: batchName,

    batch_id: batchId,

    batch_category: batchCategory,

    year,

    enrollment_id: enrollmentId,

    payment_status: paymentStatus || "Pending",

    attendance: 0,

    tasks_completed: 0,

    performance_score: 0,

    rank: null,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}
