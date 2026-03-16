import { createHealthSnapshot, createMemoryThreadStore } from "@streamcanvas/server";

const store = createMemoryThreadStore();

export async function GET() {
  return Response.json(createHealthSnapshot(store));
}
