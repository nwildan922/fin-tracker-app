// contact-file-helper.ts
import { isPlatform } from "@ionic/vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import {
  exportContactsToVcf,
  importContactsFromVcf,
} from "../utils/contact-vcf-helper";
import { Contact } from "@/models/contact";

/**
 * Export contacts to a .vcf file.
 * - Native (Android/iOS): saves directly to app's Documents/.contacts/<timestamp>.vcf
 * - Web (desktop/PWA): triggers a browser download
 */
export async function exportContactsVcf(contacts: Contact[]): Promise<{
  fileName: string;
  where: "app-documents" | "web-download";
  uriOrPath?: string;
}> {
  const vcf = exportContactsToVcf(contacts);
  const fileName = `contacts-${timeStamp()}.vcf`;

  if (isWebLike()) {
    downloadTextAsFile(vcf, fileName, "text/vcard");
    return { fileName, where: "web-download" };
  }

  // Native: write to app-private Documents/.contacts
  const path = `.backup-app-x/vcf/${fileName}`;
  await Filesystem.writeFile({
    directory: Directory.Documents,
    path,
    data: vcf,
    encoding: Encoding.UTF8,
    recursive: true,
  });

  const { uri } = await Filesystem.getUri({
    directory: Directory.Documents,
    path,
  });

  return { fileName, where: "app-documents", uriOrPath: uri };
}

/**
 * Import contacts from a user-picked .vcf file (cross-platform).
 * - Web: <input type="file"> + FileReader
 * - Native: FilePicker + Filesystem.readFile(UTF8)
 */
export async function importContactsFromPickedVcf(): Promise<Contact[]> {
  if (isWebLike()) {
    const text = await pickTextFileWeb([".vcf", "text/vcard", "text/x-vcard"]);
    return importContactsFromVcf(text);
  }

  // Native
  const res = await FilePicker.pickFiles({
    types: ["text/vcard", "text/x-vcard", ".vcf"],
    limit: 1,
  });

  const picked = res.files?.[0];
  if (!picked) throw new Error("No file selected.");

  // Support both `uri` (newer) and `path` (older) properties
  const pathOrUri = (picked as any).uri ?? (picked as any).path;
  if (!pathOrUri) throw new Error("No file URI returned.");

  const { data: text } = await Filesystem.readFile({
    path: pathOrUri,
    encoding: Encoding.UTF8,
  });
  const strText = text.toString();
  return importContactsFromVcf(strText);
}

/**
 * Import from a file you previously saved in app Documents.
 * Expects a file created by exportContactsVcf on native.
 * Example: "contacts-2025-09-07_12-34.vcf"
 */
export async function importContactsFromAppDocuments(
  fileName: string
): Promise<Contact[]> {
  const path = `.backup-app-x/vcf/${fileName}`;
  const { data: text } = await Filesystem.readFile({
    directory: Directory.Documents,
    path,
    encoding: Encoding.UTF8,
  });
  const strText = text.toString();
  return importContactsFromVcf(strText);
}

// ----------------- helpers -----------------

function isWebLike() {
  return isPlatform("desktop") || isPlatform("pwa") || isPlatform("mobileweb");
}

function timeStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "_" +
    pad(d.getHours()) +
    "-" +
    pad(d.getMinutes())
  );
}

function downloadTextAsFile(
  text: string,
  fileName: string,
  mime = "text/plain"
) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function pickTextFileWeb(accept: string[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept.join(",");
    input.style.display = "none";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("No file selected."));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}
