import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const oidcToken = request.headers["x-vercel-oidc-token"];

    if (!oidcToken) {
      throw new Error("OIDC token não encontrado.");
    }

    const result = await handleUpload({
      request,
      body: request.body,

      token: oidcToken,

      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["application/pdf"],

          maximumSizeInBytes: 50 * 1024 * 1024,

          addRandomSuffix: true,
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("PDF enviado:", blob.url);
      },
    });

    return response.status(200).json(result);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return response.status(400).json({
      error: error.message || "Erro no upload.",
    });
  }
}
