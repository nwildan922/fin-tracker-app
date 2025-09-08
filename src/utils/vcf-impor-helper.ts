import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/vue";

// Public API
export async function importFile(): Promise<string> {
  const content = isWebLike()
    ? await importFileWeb()
    : await importFileNative();
  return normalizeLineEndings(content);
}

async function importFileWeb(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".vcf,text/vcard,text/x-vcard";
      input.style.display = "none";
      input.onchange = (e: any) => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) return reject(new Error("No file selected."));
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsText(file, "utf-8"); // vCard is text, not binary
      };
      document.body.appendChild(input);
      input.click();
      // remove after the click to avoid blocking user interaction
      setTimeout(() => document.body.removeChild(input), 0);
    } catch (e) {
      reject(e);
    }
  });
}

async function importFileNative(): Promise<string> {
  const res = await FilePicker.pickFiles({
    types: ["text/vcard", "text/x-vcard", ".vcf"],
    limit: 1,
  });

  const picked = res.files?.[0];
  if (!picked) throw new Error("No file selected.");

  if ((picked as any).blob) {
    const blob: Blob = (picked as any).blob;
    return await blob.text(); // native text read
  }

  const path = picked.path;
  if (!path) throw new Error("File path/uri not available.");

  const { data: base64 } = await Filesystem.readFile({ path });
  const base64str = base64.toString();
  return base64ToUtf8(base64str);
}

function isWebLike() {
  return isPlatform("desktop") || isPlatform("pwa") || isPlatform("mobileweb");
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function normalizeLineEndings(s: string): string {
  const lf = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return lf.replace(/\n/g, "\r\n");
}
