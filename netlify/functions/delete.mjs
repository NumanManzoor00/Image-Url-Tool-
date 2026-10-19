import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "DELETE") return new Response("Method not allowed", { status: 405 });
  const u = new URL(req.url);
  const id = u.searchParams.get("id") || "";
  const token = u.searchParams.get("token") || "";
  if (!/^[a-f0-9]{10}$/.test(id)) return new Response("Not found", { status: 404 });
  const store = getStore("images");
  const meta = await store.getMetadata(id);
  if (!meta) return new Response("Not found", { status: 404 });
  if (meta.metadata.token !== token) return new Response("Forbidden", { status: 403 });
  await store.delete(id);
  return Response.json({ ok: true });
};

export const config = { path: "/api/delete" };
