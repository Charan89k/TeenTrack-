import { deleteCategory, updateCategory } from "@/lib/backend/store";
import { fail, ok } from "@/app/api/_utils";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ index: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { index } = await context.params;
    return ok(await updateCategory(Number(index), await request.json()));
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { index } = await context.params;
    return ok(await deleteCategory(Number(index)));
  } catch (error) {
    return fail(error);
  }
}
