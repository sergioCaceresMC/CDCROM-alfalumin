import { imageMapSchema } from "./table-engine";

export async function readImageMap(file: File, id: string, x: number, y: number) {
  if (file.size > 2_000_000) throw new Error("La imagen supera 2 MB. Reduce su tamaño antes de cargarla.");
  const supported = ["image/png", "image/jpeg", "image/webp"];
  if (!supported.includes(file.type)) throw new Error("Usa una imagen PNG, JPG o WebP.");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
  const size = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("La imagen está dañada o no se puede abrir."));
    image.src = data;
  });
  const ratio = size.width / size.height;
  if (!Number.isFinite(ratio) || ratio < .1 || ratio > 10 || size.width * size.height > 16_000_000) throw new Error("Usa un mapa de hasta 16 megapíxeles y proporciones entre 1:10 y 10:1.");
  const width = Math.max(140, Math.min(1000, size.width, 3200 * ratio));
  return imageMapSchema.parse({ id, name: file.name.slice(0, 80) || "Mapa cargado", image: data, x, y, width, height: width / ratio });
}
