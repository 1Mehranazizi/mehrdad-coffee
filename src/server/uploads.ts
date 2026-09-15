import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_TYPES[file.type]) {
    return { error: "فرمت تصویر باید jpg، png، webp یا gif باشد" };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "حجم تصویر نباید بیشتر از ۵ مگابایت باشد" };
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = ALLOWED_TYPES[file.type];
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  return { url: `/uploads/${filename}` };
}
