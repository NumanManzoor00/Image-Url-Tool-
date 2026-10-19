import { getStore } from "@netlify/blobs";

const MAX = 5 * 1024 * 1024; // 5 MB (Netlify Functions request limit is ~6 MB)

// Detect real image type from magic bytes (never trust the client MIME type)
function sniff(buf) {
  const h = [...new Uint8Array(buf.slice(0, 12))].map((x) => x.toString(16).padStart(2, "0")).join("");
  if (h.startsWith("ffd8ff")) return "image/jpeg";
  if (h.startsWith("89504e47")) return "image/png";
  if (h.startsWith("47494638")) return "image/gif";
  if (h.startsWith("52494646") && h.slice(16, 24) === "57454250") return "image/webp";
  return null;
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const buf = await req.arrayBuffer();
  if (!buf.byteLength || buf.byteLength > MAX) return Response.json({ error: "size" }, { status: 413 });
  const type = sniff(buf);
  if (!type) return Response.json({ error: "type" }, { status: 415 });

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  const token = crypto.randomUUID();
  let name = "image";
  try { name = decodeURIComponent(req.headers.get("x-filename") || "image").slice(0, 120); } catch {}

  await getStore("images").set(id, buf, { metadata: { type, token, name, ts: Date.now() } });
  return Response.json({ id, token, url: `${new URL(req.url).origin}/f/${id}` });
};

export const config = { path: "/api/upload" };
