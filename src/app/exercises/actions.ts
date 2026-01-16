"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createExercise(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  // Handling patterns (multi-select usually, but here checking checkboxes)
  // Since FormData handling of multiple checked checkboxes with same name can be tricky in some environments without iterate,
  // we'll assume the form sends them nicely or update if needed.
  const patterns = formData.getAll("patterns") as string[];

  // 1. Create Exercise
  const { data: exercise, error: exError } = await supabase
    .from("exercises")
    .insert({
      name,
      category,
      description,
      equipment: [], // Default empty for now
    })
    .select()
    .single();

  if (exError) {
    console.error("Error creating exercise:", exError);
    return redirect("/exercises/new?error=creation_failed");
  }

  // 2. Link Patterns
  if (patterns.length > 0) {
    const patternInserts = patterns.map((code) => ({
      exercise_id: exercise.id,
      pattern_code: code,
    }));

    const { error: patError } = await supabase
      .from("exercise_patterns")
      .insert(patternInserts);

    if (patError) {
      console.error("Error linking patterns:", patError);
      // Continue anyway as exercise was created
    }
  }

  // 3. Revalidate and Redirect
  revalidatePath("/exercises");
  redirect("/exercises");
}
