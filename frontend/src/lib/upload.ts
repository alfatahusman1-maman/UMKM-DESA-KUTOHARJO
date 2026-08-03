import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Saves a base64 encoded image to the public/uploads directory.
 * @param base64String The base64 string (e.g., "data:image/png;base64,iVBORw0KGgo...")
 * @param subfolder The subfolder inside public/uploads (e.g., "profiles" or "settings")
 * @returns The public URL path to the saved file (e.g., "/uploads/profiles/12345.png")
 */
export async function saveBase64Image(base64String: string, subfolder: string): Promise<string> {
  // If it's already a URL (e.g., external URL or already uploaded), return it as is
  if (base64String.startsWith("http") || base64String.startsWith("/uploads")) {
    return base64String;
  }

  // Extract the actual base64 data and the extension
  const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error("Format base64 tidak valid.");
  }

  const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, "base64");

  // Create random filename
  const fileName = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
  
  // Resolve path to public/uploads/subfolder
  const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);

  // Write file
  await fs.promises.writeFile(filePath, new Uint8Array(buffer));

  // Return public URL path
  return `/uploads/${subfolder}/${fileName}`;
}
