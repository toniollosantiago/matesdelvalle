export function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

export function sanitizeImagePath(img: string): string {
  if (!img || typeof img !== "string") return "/images/Mate Camionero criollo de Calabaza.png";
  const trimmed = img.trim();

  // If it's an old google hosted image or contains /fondo/, map to clean image
  if (trimmed.includes("googleusercontent.com") || trimmed.includes("/fondo/")) {
    if (trimmed.toLowerCase().includes("algarrobo")) {
      return "/images/Mate Camionero de Algarrobo Virola de Acero.png";
    }
    if (trimmed.toLowerCase().includes("cincelada")) {
      return "/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png";
    }
    if (trimmed.toLowerCase().includes("chico")) {
      return "/images/Mate Camionero chico Calabaza Liso con Virola de Acero.png";
    }
    if (trimmed.toLowerCase().includes("bombilla")) {
      return "/images/Bombillas.png";
    }
    return "/images/Mate Camionero criollo de Calabaza.png";
  }

  if (trimmed.startsWith("/")) return trimmed;
  return `/images/${trimmed}`;
}

export function parseImages(raw: unknown): string[] {
  if (!raw) return ["/images/Mate Camionero criollo de Calabaza.png"];

  if (Array.isArray(raw)) {
    const valid = raw
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map(sanitizeImagePath);
    return valid.length > 0 ? valid : ["/images/Mate Camionero criollo de Calabaza.png"];
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return ["/images/Mate Camionero criollo de Calabaza.png"];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const valid = parsed
          .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
          .map(sanitizeImagePath);
        return valid.length > 0 ? valid : ["/images/Mate Camionero criollo de Calabaza.png"];
      }
      if (typeof parsed === "string" && parsed.trim().length > 0) {
        return [sanitizeImagePath(parsed.trim())];
      }
    } catch {
      return [sanitizeImagePath(trimmed)];
    }
  }

  return ["/images/Mate Camionero criollo de Calabaza.png"];
}
