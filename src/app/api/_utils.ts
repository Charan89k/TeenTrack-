import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data: unknown) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function fail(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid request", details: error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 400 },
  );
}
