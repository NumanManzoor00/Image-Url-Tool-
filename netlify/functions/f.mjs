import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const id = context.params.id;
  if (!/^[a-f0-9]{10}$/.test(id)) return new Response("Not found", { status: 404 });
  const r = await getStore("images").getWithMetadata(id, { type: "arrayBuffer" });
  if (!r) return new Response("Not found", { status: 404 });
  return new Response(r.data, {
    headers: {
      "content-type": r.metadata.type,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-disposition": "inline",
    },
  });
};

export const config = { path: "/f/:id" };
