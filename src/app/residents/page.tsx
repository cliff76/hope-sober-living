import {Metadata} from "next";
import {db} from "@/drizzle/client";
import {ResidentsTable, UsersTable} from "@/drizzle/schema/users";
import {eq} from "drizzle-orm";
import React from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

export const metadata: Metadata = {
  title: "Residents",
  description: "List of registered residents",
};

type ResidentRow = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  sobrietyDate: string | Date;
  sponsor: string | null;
  step: string; // numeric in db often maps to string with drizzle
};

async function getResidents(): Promise<ResidentRow[]> {
    return db
      .select({
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email,
          phoneNumber: UsersTable.phoneNumber,
          sobrietyDate: ResidentsTable.sobrietyDate,
          sponsor: ResidentsTable.sponsor,
          step: ResidentsTable.step,
      })
      .from(ResidentsTable)
      .innerJoin(UsersTable, eq(ResidentsTable.userId, UsersTable.id));
}

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  // Fallback if invalid date
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ResidentsPage() {
  let residents: ResidentRow[] = [];
  try {
    residents = await getResidents();
  } catch (e) {
    console.error("Failed to load residents:", e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-8 overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-gradient-to-r from-blue-900 via-primary to-gray-800 px-6 py-8 text-white">
          <h1 className="text-3xl font-semibold tracking-tight">Residents</h1>
          <p className="mt-1 text-white/90">
            All registered residents in the system.
          </p>
        </div>
      </section>

      {residents.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No residents found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50/70">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                <th className="px-3 py-3 w-10">
                  <span className="sr-only">Edit</span>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Sobriety Date</th>
                <th className="px-4 py-3">Sponsor</th>
                <th className="px-4 py-3">Step</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {residents.map((r) => (
                <tr key={r.id} className="text-sm hover:bg-primary/5 transition-colors">
                  <td className="px-3 py-3 w-10">
                    <Link
                      href={`/residents/${r.id}/edit`}
                      className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-1.5 text-primary hover:bg-primary/15 transition"
                      aria-label={`Edit ${r.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/residents/${r.id}`}
                      className="text-primary hover:underline"
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      className="text-primary hover:underline"
                      href={`mailto:${r.email}`}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      className="text-primary hover:underline"
                      href={`tel:${r.phoneNumber}`}
                    >
                      {r.phoneNumber}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(r.sobrietyDate)}
                  </td>
                  <td className="px-4 py-3">{r.sponsor ?? "—"}</td>
                  <td className="px-4 py-3">{String(r.step)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
