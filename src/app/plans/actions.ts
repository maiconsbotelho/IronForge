"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Complex creation with nested data is best done via API or careful multi-step inserts.
// For Form Actions, we usually get a flat FormData.
// We will assume the `new/page.tsx` uses a client component wrapper to manage the complex state (Days > Exercises)
// and submits a JSON blob or specific fields.
// Actually, for simplicity with Server Actions, we can just receive the JSON stringified data if we use a client hook,
// OR simpler: create the plan first, then redirect to an "edit/builder" page.
// Let's try to do it all in one go if possible, or use the "Builder" pattern.
// "Builder" pattern: Create Plan -> Redirect to /plans/[id]/edit -> Add Days/Exercises via AJAX/Server Actions.
// This is much better for UX than a massive form.
// But the user showed a spreadsheet-like view.
// Let's implement a `createPlan` that just makes the container, then we go to the view where we can "Add Day".

export async function createPlan(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data: plan, error } = await supabase
    .from("training_plans")
    .insert({
      user_id: user.id,
      name,
      description,
      is_active: true, // Default to active for now
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating plan:", error);
    return redirect("/plans?error=creation_failed");
  }

  revalidatePath("/plans");
  redirect(`/plans/${plan.id}`); // Redirect to the plan detail to add days
}

export async function createDay(formData: FormData) {
  const supabase = await createClient();
  const plan_id = formData.get("plan_id") as string;
  const name = formData.get("name") as string; // "Treino A"

  await supabase.from("training_days").insert({
    plan_id,
    name,
  });

  revalidatePath(`/plans/${plan_id}`);
}

export async function addExerciseToDay(formData: FormData) {
  const supabase = await createClient();
  const training_day_id = formData.get("training_day_id") as string;
  const exercise_id = formData.get("exercise_id") as string;
  const section = formData.get("section") as string;
  const sets = formData.get("sets") as string;
  const reps = formData.get("reps") as string;

  // Optional: Fetch plan_id for revalidation optimization

  await supabase.from("training_items").insert({
    training_day_id,
    exercise_id: exercise_id || null, // Handle custom if needed later
    section,
    sets,
    reps,
  });

  // We need to know the plan_id to revalidate correctly, or just revalidate path
  // Since this is likely called from the plan detail page, we can rely on client-side refresh or pass plan_id
  // Let's assume we pass plan_id in the form too for revalidation
  const plan_id = formData.get("plan_id") as string;
  if (plan_id) {
    revalidatePath(`/plans/${plan_id}`);
  }
}

export async function deletePlan(formData: FormData) {
  const supabase = await createClient();
  const plan_id = formData.get("plan_id") as string;

  await supabase.from("training_plans").delete().eq("id", plan_id);

  revalidatePath("/plans");
  redirect("/plans");
}
