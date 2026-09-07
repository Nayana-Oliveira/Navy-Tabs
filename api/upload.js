import { issueSignedToken, presignUrl } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { pathname, contentType, size } = request.body || {};

    if (!pathname) {
      throw new Error("Nome do arquivo não informado.");
    }

    if (contentType !== "application/pdf") {
      throw new Error("Apenas arquivos PDF são permitidos.");
    }

    const maximumSizeInBytes = 50 * 1024 * 1024;

    if (!size || size > maximumSizeInBytes) {
      throw new Error("O PDF deve ter no máximo 50 MB.");
    }

    const validUntil = Date.now() + 15 * 60 * 1000;

    const token = await issueSignedToken({
      pathname,

      operations: ["put"],

      allowedContentTypes: ["application/pdf"],

      maximumSizeInBytes,

      validUntil,
    });

    const { presignedUrl } = await presignUrl(token, {
      pathname,

      operation: "put",

      validUntil,
    });

    return response.status(200).json({
      presignedUrl,
    });
  } catch (error) {
    console.error("SIGNED URL ERROR:", error);

    return response.status(400).json({
      error: error.message || "Erro ao gerar URL de upload.",
    });
  }
}
