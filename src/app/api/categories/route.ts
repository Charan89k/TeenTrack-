import { addCategory } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return ok(await addCategory(body));
  } catch (error) {
    return fail(error);
  }
}
