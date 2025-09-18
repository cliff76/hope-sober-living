import {Metadata} from "next";
import {db} from "@/drizzle/client";
import {ResidentsTable, UsersTable} from "@/drizzle/schema/users";
import {eq} from "drizzle-orm";
import React from "react";

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
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Residents</h1>
        <p className="text-muted-foreground mt-1">
          All registered residents in the system.
        </p>
      </header>

      {residents.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No residents found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500">
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
                <tr key={r.id} className="text-sm">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">
                    <a
                      className="text-blue-600 hover:underline"
                      href={`mailto:${r.email}`}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      className="text-blue-600 hover:underline"
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
