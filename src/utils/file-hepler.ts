import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/vue"; // Import isPlatform utility
import pako from "pako";
import { showMessage } from "./common";
import { Backup } from "@/models/backup";

export async function backupFile(data: Backup) {
  const fileName = "backup-app-x.gz";

  try {
    // 1. Convert JSON object to a string
    const jsonString = JSON.stringify(data);

    // 2. Compress the string using pako's Deflate algorithm
    const compressedData = pako.deflate(jsonString);

    // 3. Check if the app is running on a web platform
    if (isPlatform("desktop") || isPlatform("pwa") || isPlatform("mobileweb")) {
      // Logic for web download
      const blob = new Blob([compressedData], { type: "application/gzip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // The file name the user will see
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object

      console.log("Web download initiated.");
      showMessage("Your file is being downloaded!");
    } else {
      // Logic for native platforms (iOS/Android)
      // Convert the compressed data (Uint8Array) to a Base64 string for saving
      const compressedBase64 = btoa(String.fromCharCode(...compressedData));

      await Filesystem.writeFile({
        path: fileName,
        data: compressedBase64,
        directory: Directory.Documents,
        recursive: true,
        encoding: Encoding.UTF8,
      });

      console.log("Native file saved successfully!");
      showMessage(`File "${fileName}" saved to your Downloads folder!`);
    }
  } catch (e) {
    console.error("Unable to export file", e);
    showMessage("Error exporting file!");
  }
}

export async function importFile(): Promise<Backup> {
  let fileContent = "";

  try {
    if (isPlatform("desktop") || isPlatform("pwa") || isPlatform("mobileweb")) {
      // --- Web Import Logic ---
      const filePromise = new Promise<string>((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".gz";
        input.style.display = "none";

        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (!file) {
            reject(new Error("No file selected."));
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const data = reader.result as ArrayBuffer;
            const decompressedData = pako.inflate(new Uint8Array(data), {
              to: "string",
            });
            resolve(decompressedData);
          };
          reader.onerror = () => reject(new Error("Failed to read file."));
          reader.readAsArrayBuffer(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
      });

      fileContent = await filePromise;
    } else {
      // --- Native Import Logic ---
      const fileName = "backup-app-x.gz";
      const file = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      const compressedBase64 = file.data as string;
      const binaryString = atob(compressedBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileContent = pako.inflate(bytes, { to: "string" });
    }

    // --- Common Logic for both platforms ---
    const importedJsonObject = JSON.parse(fileContent);

    // Validate the parsed object's structure against the Backup interface
    if (isBackup(importedJsonObject)) {
      return importedJsonObject;
    } else {
      throw new Error("Invalid backup file format.");
    }
  } catch (e) {
    console.error("Import failed:", e);
    // Rethrow the error to be handled by the caller
    throw e;
  }
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
