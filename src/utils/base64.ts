export async function blobToBase64(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();

  const uint8Array = new Uint8Array(arrayBuffer);

  let base64String = "";
  for (let i = 0; i < uint8Array.length; i++) {
    base64String += String.fromCharCode(uint8Array[i]);
  }
  // Convert ArrayBuffer to Buffer
  return Buffer.from(base64String, "binary").toString("base64");
}
