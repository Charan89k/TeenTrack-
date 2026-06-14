import { updateGoals } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    return ok(await updateGoals(await request.json()));
  } catch (error) {
    return fail(error);
  }
}
