// src/lib/backup-io.ts
import { isPlatform } from "@ionic/vue";
import pako from "pako";
import { showMessage } from "./common";
import { Backup } from "@/models/backup";

// Native helpers
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Directory, Filesystem } from "@capacitor/filesystem";

// ---------- Public wrappers (choose platform) ----------
export async function backupFile(data: Backup) {
  if (isWebLike()) return backupFileWeb(data);
  return backupFileNative(data);
}

export async function importFile(): Promise<Backup> {
  const content = isWebLike()
    ? await importFileWeb()
    : await importFileNative();
  const obj = JSON.parse(content);
  if (!isBackup(obj)) {
    showMessage("Invalid backup file format.");
    throw new Error("Invalid backup file format.");
  }
  return obj;
}

// ---------- WEB IMPLEMENTATION ----------
async function backupFileWeb(data: Backup) {
  try {
    const fileName = "backup-app-x.gz";
    const json = JSON.stringify(data);
    const gzBytes = pako.gzip(json); // correct for .gz
    const blob = new Blob([gzBytes], { type: "application/gzip" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("Your file is being downloaded!");
  } catch (e) {
    console.error("Unable to export file (web)", e);
    showMessage("Error exporting file!");
    throw e;
  }
}

async function importFileWeb(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".gz,application/gzip,application/x-gzip";
      input.style.display = "none";
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return reject(new Error("No file selected."));
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const ab = reader.result as ArrayBuffer;
            const json = pako.ungzip(new Uint8Array(ab), { to: "string" }); // ungzip
            resolve(json);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsArrayBuffer(file);
      };
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (e) {
      reject(e);
    }
  });
}

// ---------- NATIVE IMPLEMENTATION (Android/iOS) ----------
async function backupFileNative(data: Backup) {
  try {
    const fileName = "backup-app-x.gz";
    const json = JSON.stringify(data);
    const gzBytes = pako.gzip(json);
    const blob = new Blob([gzBytes], { type: "application/gzip" });
    const base64 = await blobToBase64(blob);
    await Filesystem.writeFile({
      path: `.backup-app-x/${fileName}`,
      data: base64, // must be base64 string
      directory: Directory.Documents, // app-private Documents dir
      recursive: true,
    });
    showMessage(`Saved "${fileName}".`);
  } catch (e: any) {
    console.error("Unable to export file (native)", e);
    showMessage(toDebug(e));
    showMessage(e.toString());
    throw e;
  }
}

async function importFileNative(): Promise<string> {
  const res = await FilePicker.pickFiles({
    types: ["application/gzip", ".gz"],
    limit: 1,
  });

  const picked = res.files?.[0];
  if (!picked?.path) throw new Error("No file selected.");

  // Read Base64 string from SAF URI
  const { data: base64 } = await Filesystem.readFile({ path: picked.path });

  const dataFile: string = base64.toString();
  // Convert to Uint8Array
  const bytes = base64ToUint8Array(dataFile);

  // Decompress
  return pako.ungzip(bytes, { to: "string" });
}

// ---------- Utils ----------
function isWebLike() {
  return isPlatform("desktop") || isPlatform("pwa") || isPlatform("mobileweb");
}

function base64ToUint8Array(b64: string) {
  const bin = atob(b64);
  const len = bin.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

// Simple type guard to validate the object structure
function isBackup(obj: any): obj is Backup {
  return (
    obj &&
    typeof obj === "object" &&
    Array.isArray(obj.assets) &&
    Array.isArray(obj.categories) &&
    Array.isArray(obj.transactions) &&
    Array.isArray(obj.notes) &&
    Array.isArray(obj.contacts) &&
    Array.isArray(obj.passwords)
  );
}

function toDebug(e: unknown) {
  // Best-effort stringify for errors coming from native bridges
  const any = e as any;
  return JSON.stringify(
    {
      message: any?.message ?? String(e),
      code: any?.code,
      stack: any?.stack,
      name: any?.name,
      ...("original" in any ? { original: any.original } : {}),
    },
    null,
    2
  );
}

async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  let binary = "";
  const chunkSize = 0x8000; // process in chunks to avoid stack overflow
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary); // convert binary string → base64
}
