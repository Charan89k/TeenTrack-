import { unlockVault } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function POST() {
  try {
    return ok(await unlockVault());
  } catch (error) {
    return fail(error);
  }
}
