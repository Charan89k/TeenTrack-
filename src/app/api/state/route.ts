import { getAppState } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return ok(await getAppState());
  } catch (error) {
    return fail(error);
  }
}
