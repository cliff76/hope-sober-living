import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/drizzle/client";
import { ResidentsTable, UsersTable } from "@/drizzle/schema/users";
import { eq } from "drizzle-orm";
import {updateResidentAction} from "@/app/residents/[id]/actions";

type ResidentEdit = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthdate: string | Date;
  sobrietyDate: string | Date;
  sponsor: string | null;
  step: string;
};

function toInputDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

async function getResident(id: string): Promise<ResidentEdit | null> {
  const rows = await db
    .select({
      id: UsersTable.id,
      name: UsersTable.name,
      email: UsersTable.email,
      phoneNumber: UsersTable.phoneNumber,
      birthdate: UsersTable.birthdate,
      sobrietyDate: ResidentsTable.sobrietyDate,
      sponsor: ResidentsTable.sponsor,
      step: ResidentsTable.step,
    })
    .from(ResidentsTable)
    .innerJoin(UsersTable, eq(ResidentsTable.userId, UsersTable.id))
    .where(eq(UsersTable.id, id));

  return rows[0] ?? null;
}

export default async function EditResidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resident = await getResident(id);

  if (!resident) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border p-10 text-center">
          <h1 className="text-2xl font-semibold">Resident not found</h1>
          <p className="text-muted-foreground mt-2">
            The resident you are trying to edit does not exist.
          </p>
          <div className="mt-6">
            <Link
              href="/residents"
              className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black/80"
            >
              Back to Residents
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const action = updateResidentAction.bind(null, resident.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-900 via-primary to-gray-800 px-6 py-8 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Resident
              </h1>
              <p className="text-indigo-100 mt-1">{resident.name}</p>
            </div>
            <Link
              href="/residents"
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 transition"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <form action={action} className="space-y-6 px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={resident.name}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={resident.email}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                defaultValue={resident.phoneNumber}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                defaultValue={toInputDate(resident.birthdate)}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sobriety Date
              </label>
              <input
                type="date"
                name="sobrietyDate"
                defaultValue={toInputDate(resident.sobrietyDate)}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sponsor
              </label>
              <input
                type="text"
                name="sponsor"
                defaultValue={resident.sponsor ?? ""}
                placeholder="Optional"
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Step
              </label>
              <input
                type="number"
                min={1}
                max={12}
                step={1}
                name="step"
                defaultValue={String(resident.step)}
                required
                className="block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href={`/residents/${resident.id}`}
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
