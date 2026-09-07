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

  const uniqueName = `${Date.now()}-${safeName}`;

  const pathname = `tablatures/${uniqueName}`;

  const tokenResponse = await fetch("/api/upload", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      pathname,
      contentType: file.type,
      size: file.size,
    }),
  });

  const tokenResult = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(tokenResult.error || "Não foi possível preparar o upload.");
  }

  const blobResponse = await uploadWithProgress(
    tokenResult.presignedUrl,
    file,
    onProgress,
  );

  if (!blobResponse.ok) {
    const message = await blobResponse.text();

    throw new Error(message || "Não foi possível enviar o PDF.");
  }

  const url = tokenResult.presignedUrl.split("?")[0];

  return {
    url,
    pathname,
  };
}

function uploadWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url);

    xhr.setRequestHeader("Content-Type", "application/pdf");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percentage = Math.round((event.loaded / event.total) * 100);

      onProgress?.(percentage);
    };

    xhr.onload = () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,

        status: xhr.status,

        text: async () => xhr.responseText,
      });
    };

    xhr.onerror = () => {
      reject(new Error("Erro de rede durante o upload."));
    };

    xhr.send(file);
  });
}
