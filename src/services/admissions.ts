import { supabase } from "@/lib/supabase";

export async function createAdmissionRequest({
  teacherId,
  studentName,
  email,
  phone,
  parentPhone,
  className,
  schoolName,
  year,
  batchId,
  batchName,
  batchCategory,
  batchNumber,
}: {
  teacherId: string;

  studentName: string;

  email?: string;

  phone?: string;

  parentPhone?: string;

  className?: string;

  schoolName?: string;

  year?: string;

  batchId?: string;

  batchName?: string;

  batchCategory?: string;

  batchNumber?: string;
}) {
  const response = await supabase.from("admissions").insert({
    teacher_id: teacherId,

    student_name: studentName,

    email: email || null,

    phone: phone || null,

    parent_phone: parentPhone || null,

    class_name: className || null,

    school_name: schoolName || null,

    year: year || null,

    batch_id: batchId || null,

    batch_name: batchName || null,

    batch_category: batchCategory || null,

    batch_number: batchNumber || null,
  });

  return {
    success: !response.error,

    error: response.error,
  };
}

export async function getAdmissionsByTeacher(teacherId: string) {
  const response = await supabase
    .from("admissions")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", {
      ascending: false,
    });

  console.log(response);

  return {
    success: !response.error,

    data: response.data,

    error: response.error,
  };
}

export async function approveAdmission({ admission }: { admission: any }) {
  try {
    // GENERATE ENROLLMENT ID
    const enrollmentId = `${admission.batch_id}-${Math.floor(
      100 + Math.random() * 900,
    )}`;

    // INSERT INTO STUDENTS
    const studentInsert = await supabase.from("students").insert({
      teacher_id: admission.teacher_id,

      student_name: admission.student_name,

      email: admission.email,

      phone: admission.phone,

      parent_phone: admission.parent_phone,

      class_name: admission.class_name,

      batch_id: admission.batch_id,

      batch_name: admission.batch_name,

      batch_category: admission.batch_category,

      year: admission.year,

      enrollment_id: enrollmentId,
    });

    if (studentInsert.error) {
      return {
        success: false,

        error: studentInsert.error,
      };
    }

    // UPDATE ADMISSION STATUS
    const admissionUpdate = await supabase
      .from("admissions")
      .update({
        status: "approved",

        approved_at: new Date().toISOString(),

        reviewed_at: new Date().toISOString(),
      })
      .eq("id", admission.id);

    if (admissionUpdate.error) {
      return {
        success: false,

        error: admissionUpdate.error,
      };
    }

    // GET CURRENT BATCH COUNT
    const batchResponse = await supabase
      .from("batches")
      .select("total_students")
      .eq("batch_id", admission.batch_id)
      .single();

    const currentTotal = batchResponse.data?.total_students || 0;

    // UPDATE BATCH STUDENT COUNT
    const batchUpdate = await supabase
      .from("batches")
      .update({
        total_students: currentTotal + 1,
      })
      .eq("batch_id", admission.batch_id);

    if (batchUpdate.error) {
      return {
        success: false,

        error: batchUpdate.error,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,

      error,
    };
  }
}

export async function rejectAdmission({
  admissionId,
  reason,
}: {
  admissionId: string;

  reason?: string;
}) {
  const response = await supabase
    .from("admissions")
    .update({
      status: "rejected",

      rejection_reason: reason || null,

      reviewed_at: new Date().toISOString(),
    })
    .eq("id", admissionId);

  return {
    success: !response.error,

    error: response.error,
  };
}
