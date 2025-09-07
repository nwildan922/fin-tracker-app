import { Contact } from "@/models/contact";
import { v4 as uuidv4 } from "uuid";

export function exportContactsToVcf(contacts: Contact[]): string {
  return contacts
    .map((c) => {
      const lines: string[] = [];
      lines.push("BEGIN:VCARD");
      lines.push("VERSION:3.0");
      lines.push(`FN:${escapeVcfText(c.name)}`);
      lines.push(`TEL;TYPE=CELL:${escapeVcfText(c.phone1)}`);
      if (c.phone2) lines.push(`TEL;TYPE=HOME:${escapeVcfText(c.phone2)}`);
      if (c.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcfText(c.email)}`);
      if (c.note) lines.push(`NOTE:${escapeVcfText(c.note)}`);
      lines.push(`UID:${escapeVcfText(c.id)}`);
      lines.push(`REV:${escapeVcfText(c.created_at)}`);
      lines.push("END:VCARD");
      return lines.join("\r\n");
    })
    .join("\r\n");
}

/**
 * Import a VCF string into a list of Contact objects.
 * Very basic parser for common single-line fields.
 */
export function importContactsFromVcf(vcfText: string): Contact[] {
  const contacts: Contact[] = [];

  // Split by cards
  const cards = vcfText
    .split(/BEGIN:VCARD/i)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  for (const card of cards) {
    const lines = card.split(/\r?\n/);
    let name = "";
    let phone1 = "";
    let phone2: string | undefined;
    let email: string | undefined;
    let note: string | undefined;
    let uid: string | undefined;
    let rev: string | undefined;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("FN:")) {
        name = unescapeVcfText(line.substring(3).trim());
      } else if (line.startsWith("TEL")) {
        const value = line.split(":")[1]?.trim() || "";
        const tel = unescapeVcfText(value);
        if (!phone1) phone1 = tel;
        else if (!phone2) phone2 = tel;
      } else if (line.startsWith("EMAIL")) {
        const value = line.split(":")[1]?.trim() || "";
        email = unescapeVcfText(value);
      } else if (line.startsWith("NOTE:")) {
        note = unescapeVcfText(line.substring(5).trim());
      } else if (line.startsWith("UID:")) {
        uid = unescapeVcfText(line.substring(4).trim());
      } else if (line.startsWith("REV:")) {
        rev = unescapeVcfText(line.substring(4).trim());
      }
    }

    if (name && phone1) {
      contacts.push({
        id: uid || uuidv4(),
        name,
        phone1,
        phone2,
        email,
        note,
        created_at: rev || new Date().toISOString(),
      });
    }
  }

  return contacts;
}

/** Minimal escaping for commas/semicolons/backslashes/newlines. */
function escapeVcfText(s: string): string {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
function unescapeVcfText(s: string): string {
  return String(s)
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
