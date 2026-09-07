import { upload } from "@vercel/blob/client";

export async function uploadPdf(file, onProgress) {
  if (!file) {
    throw new Error("Selecione um arquivo PDF.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("O arquivo precisa ser um PDF.");
  }

  const maxSize = 20 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("O PDF deve ter no máximo 20 MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

  const blob = await upload(`tablaturas/${safeName}`, file, {
    access: "public",

    handleUploadUrl: "/api/upload",

    onUploadProgress(event) {
      if (onProgress) {
        onProgress(event.percentage);
      }
    },
  });

  return blob;
}
