"use server";

import { db } from "@/drizzle/client";
import { ResidentsTable, UsersTable } from "@/drizzle/schema/users";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function toYMD(input: FormDataEntryValue | null): string | null {
  if (!input) return null;
  const value = input.toString();
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export async function updateResidentAction(id: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phoneNumber = formData.get("phoneNumber")?.toString().trim() ?? "";
  const birthdate = toYMD(formData.get("birthdate"));
  const sobrietyDate = toYMD(formData.get("sobrietyDate"));
  const sponsor = formData.get("sponsor")?.toString().trim() || null;
  const stepRaw = formData.get("step")?.toString().trim() ?? "1";
  const step = String(parseInt(stepRaw || "1", 10));

  // Basic guard
  if (!id || !name || !email || !phoneNumber || !birthdate || !sobrietyDate) {
    // In a production app, you'd return a typed action state with errors.
    redirect(`/residents/${id}/edit`);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(UsersTable)
      .set({
        name,
        email,
        phoneNumber,
        birthdate, // stored as 'YYYY-MM-DD'
      })
      .where(eq(UsersTable.id, id));

    await tx
      .update(ResidentsTable)
      .set({
        sobrietyDate, // stored as 'YYYY-MM-DD'
        sponsor,
        step,
      })
      .where(eq(ResidentsTable.userId, id));
  });

  revalidatePath("/residents");
  revalidatePath(`/residents/${id}`);
  redirect(`/residents/${id}`);
}
