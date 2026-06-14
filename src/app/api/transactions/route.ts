import { addTransaction } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    return ok(await addTransaction(await request.json()));
  } catch (error) {
    return fail(error);
  }
}
