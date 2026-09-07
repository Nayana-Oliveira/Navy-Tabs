import { issueSignedToken } from "@vercel/blob";

import { handleUploadPresigned } from "@vercel/blob/client";

async function validateSession(request) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new Error("Usuário não autenticado.");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const apiUrl = process.env.RIFFLY_API_URL;

  if (!apiUrl) {
    throw new Error("RIFFLY_API_URL não configurada.");
  }

  const validationResponse = await fetch(apiUrl, {
    method: "POST",

    body: JSON.stringify({
      action: "validateSession",

      token,
    }),
  });

  if (!validationResponse.ok) {
    throw new Error("Não foi possível validar a sessão.");
  }

  const result = await validationResponse.json();

  if (!result.success) {
    throw new Error(result.error || "Sessão inválida ou expirada.");
  }

  return result.data;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const body = request.body || {};

    if (body.type === "blob.generate-presigned-url") {
      await validateSession(request);
    }

    const result = await handleUploadPresigned({
      request,
      body,

      getSignedToken: async (pathname) => {
        if (!pathname.startsWith("tablatures/")) {
          throw new Error("Caminho de upload inválido.");
        }

        const validUntil = Date.now() + 15 * 60 * 1000;

        const token = await issueSignedToken({
          pathname,

          operations: ["put"],

          allowedContentTypes: ["application/pdf"],

          maximumSizeInBytes: 50 * 1024 * 1024,

          validUntil,
        });

        return {
          token,

          urlOptions: {
            allowedContentTypes: ["application/pdf"],

            maximumSizeInBytes: 50 * 1024 * 1024,

            validUntil,
          },
        };
      },
    });

    return response.status(200).json(result);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return response.status(401).json({
      error: error.message || "Upload não autorizado.",
    });
  }
}
