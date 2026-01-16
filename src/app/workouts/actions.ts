"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createWorkout(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const wod_id = formData.get("wod_id") as string;
  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const score = formData.get("score") as string;
  const notes = formData.get("notes") as string;

  // 1. Create Workout Log
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      wod_id: wod_id || null, // Ensure null if empty string
      name: name || "Treino Sem Nome", // Fallback name
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      notes: notes,
      status: "completed",
    })
    .select()
    .single();

  if (workoutError) {
    console.error("Error creating workout:", workoutError);
    // In a real app we'd return an error to the form,
    // but for now we'll just redirect to an error page or back
    return redirect("/workouts/new?error=creation_failed");
  }

  // 2. Log Score as Note (or separate item if we had a specific table for score)
  // Since our schema has workout_items and score logic is vague in the prompt,
  // We will append the score to the notes for now, or update the workout if we add a 'score' column later.
  // Wait, the schema has `notes`. The prompt shows a "Score" input.
  // Let's just append "Score: X" to notes if it's not empty, to preserve it.
  if (score) {
    await supabase
      .from("workouts")
      .update({
        notes: `${notes ? notes + "\n\n" : ""}Pontuação/Resultado: ${score}`,
      })
      .eq("id", workout.id);
  }

  // 3. Revalidate and Redirect
  revalidatePath("/workouts");
  revalidatePath("/stats");
  redirect("/stats");
}
