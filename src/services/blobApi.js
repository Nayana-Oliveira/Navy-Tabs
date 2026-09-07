import { uploadPresigned } from "@vercel/blob/client";

export async function uploadPdf(file, onProgress) {
  if (!file) {
    throw new Error("Selecione um PDF.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Selecione um arquivo PDF.");
  }

  const maxSize = 50 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("O PDF deve ter no máximo 50 MB.");
  }

  const safeName = file.name.trim().replace(/[^a-zA-Z0-9._-]/g, "-");

  const pathname = `tablatures/${Date.now()}-${safeName}`;

  const blob = await uploadPresigned(pathname, file, {
    access: "public",

    handleUploadUrl: "/api/upload",

    contentType: "application/pdf",

    multipart: true,

    onUploadProgress(progress) {
      onProgress?.(Math.round(progress.percentage));
    },
  });

  return {
    url: blob.url,

    pathname: blob.pathname,
  };
}
