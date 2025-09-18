import React from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { db } from "@/drizzle/client";
import { ResidentsTable, UsersTable } from "@/drizzle/schema/users";
import { eq } from "drizzle-orm";

type ResidentDetail = {
  id: string;
  externalId: string;
  name: string;
  birthdate: string | Date;
  email: string;
  phoneNumber: string;
  roles: string[];
  sobrietyDate: string | Date;
  sponsor: string | null;
  step: string;
  userCreatedAt: string | Date;
  userUpdatedAt: string | Date;
  residentCreatedAt: string | Date;
  residentUpdatedAt: string | Date;
};

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function getResident(id: string): Promise<ResidentDetail | null> {
  const rows = await db
    .select({
      id: UsersTable.id,
      externalId: UsersTable.externalId,
      name: UsersTable.name,
      birthdate: UsersTable.birthdate,
      email: UsersTable.email,
      phoneNumber: UsersTable.phoneNumber,
      roles: UsersTable.roles,
      sobrietyDate: ResidentsTable.sobrietyDate,
      sponsor: ResidentsTable.sponsor,
      step: ResidentsTable.step,
      userCreatedAt: UsersTable.createdAt,
      userUpdatedAt: UsersTable.updatedAt,
      residentCreatedAt: ResidentsTable.createdAt,
      residentUpdatedAt: ResidentsTable.updatedAt,
    })
    .from(ResidentsTable)
    .innerJoin(UsersTable, eq(ResidentsTable.userId, UsersTable.id))
    .where(eq(UsersTable.id, id));

  return rows[0] ?? null;
}

export default async function ResidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const resident = await getResident(params.id);

  if (!resident) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border p-10 text-center">
          <h1 className="text-2xl font-semibold">Resident not found</h1>
          <p className="text-muted-foreground mt-2">
            The resident you are looking for does not exist.
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-900 via-primary to-gray-800 px-6 py-10 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {resident.name}
              </h1>
              <p className="text-indigo-100 mt-1">
                Resident ID: <span className="font-mono">{resident.id}</span>
              </p>
            </div>
            <Link
              href={`/residents/${resident.id}/edit`}
              className="inline-flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/30 transition"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-lg border p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd>
                    <a className="text-indigo-700 hover:underline" href={`mailto:${resident.email}`}>
                      {resident.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Phone</dt>
                  <dd>
                    <a className="text-indigo-700 hover:underline" href={`tel:${resident.phoneNumber}`}>
                      {resident.phoneNumber}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Birthdate</dt>
                  <dd>{formatDate(resident.birthdate)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Program
              </h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Sobriety Date</dt>
                  <dd>{formatDate(resident.sobrietyDate)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Sponsor</dt>
                  <dd>{resident.sponsor ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Step</dt>
                  <dd>{String(resident.step)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border p-5 md:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Account
              </h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">External ID</dt>
                  <dd className="mt-1 font-mono text-sm">{resident.externalId}</dd>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">Roles</dt>
                  <dd className="mt-1 text-sm">
                    {resident.roles?.length ? resident.roles.join(", ") : "—"}
                  </dd>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">User Created</dt>
                  <dd className="mt-1 text-sm">{formatDate(resident.userCreatedAt)}</dd>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">User Updated</dt>
                  <dd className="mt-1 text-sm">{formatDate(resident.userUpdatedAt)}</dd>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">Resident Created</dt>
                  <dd className="mt-1 text-sm">{formatDate(resident.residentCreatedAt)}</dd>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <dt className="text-xs uppercase text-gray-500">Resident Updated</dt>
                  <dd className="mt-1 text-sm">{formatDate(resident.residentUpdatedAt)}</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/residents"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Back to Residents
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
