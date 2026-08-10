export type Extracted = {
  name: string;
  /** Text pulled out of the file in the browser, when possible. */
  text: string;
  /** Set only when the file still needs to go to the model as a file/image. */
  file?: { name: string; mimeType: string; dataUrl: string };
  note: string;
};

const TEXT_EXT = /\.(txt|md|markdown|csv|rtf|eml|json|log)$/i;

function extFrom(name: string) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1]!.toLowerCase() : "";
}

/** Browsers often report an empty or generic type — derive it from the extension. */
export function resolveMimeType(file: File): string {
  const byExt: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    md: "text/markdown",
    csv: "text/csv",
    rtf: "application/rtf",
    eml: "message/rfc822",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    heic: "image/heic",
  };
  const ext = extFrom(file.name);
  const fromExt = byExt[ext];
  if (fromExt) return fromExt;
  if (file.type) return file.type;
  return "application/octet-stream";
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function cleanText(raw: string) {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages: string[] = [];
  const limit = Math.min(doc.numPages, 30);
  for (let i = 1; i <= limit; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    const lines: string[] = [];
    for (const item of content.items as Array<{ str?: string; hasEOL?: boolean }>) {
      if (typeof item.str !== "string") continue;
      line += item.str;
      if (item.hasEOL) {
        lines.push(line);
        line = "";
      }
    }
    if (line) lines.push(line);
    pages.push(lines.join("\n"));
  }
  doc.cleanup();
  return cleanText(pages.join("\n\n"));
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = (await import("mammoth/mammoth.browser" as string)) as unknown;
  const buffer = await file.arrayBuffer();
  const result = await (mammoth as unknown as {
    extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  }).extractRawText({ arrayBuffer: buffer });
  return cleanText(result.value ?? "");
}

/**
 * Pulls readable text out of a file in the browser so the analysis works on
 * accurate content. Falls back to sending the raw file to the model when the
 * file is an image or a scanned PDF with no embedded text.
 */
export async function extractFile(file: File): Promise<Extracted> {
  const mimeType = resolveMimeType(file);
  const ext = extFrom(file.name);

  if (mimeType.startsWith("image/")) {
    if (ext === "heic" || mimeType === "image/heic") {
      throw new Error("HEIC images aren't readable — save it as JPG or PNG first.");
    }
    return {
      name: file.name,
      text: "",
      file: { name: file.name, mimeType, dataUrl: await readAsDataUrl(file) },
      note: "Image attached — Shanthi will read it directly.",
    };
  }

  if (TEXT_EXT.test(file.name) || mimeType.startsWith("text/")) {
    const text = cleanText(await file.text());
    if (!text) throw new Error(`${file.name} looks empty — paste the text instead.`);
    return { name: file.name, text, note: `Read ${text.length.toLocaleString()} characters.` };
  }

  if (mimeType === "application/pdf") {
    let text = "";
    try {
      text = await extractPdf(file);
    } catch {
      text = "";
    }
    if (text.length > 120) {
      return { name: file.name, text, note: `Read ${text.length.toLocaleString()} characters from the PDF.` };
    }
    return {
      name: file.name,
      text: "",
      file: { name: file.name, mimeType, dataUrl: await readAsDataUrl(file) },
      note: "Scanned PDF — Shanthi will read the pages directly.",
    };
  }

  if (ext === "docx") {
    const text = await extractDocx(file);
    if (!text) throw new Error(`Couldn't find any text in ${file.name} — paste it instead.`);
    return { name: file.name, text, note: `Read ${text.length.toLocaleString()} characters from the document.` };
  }

  if (ext === "doc") {
    throw new Error("Old .doc files can't be read — save it as PDF or DOCX, or paste the text.");
  }

  throw new Error(`${file.name} isn't a supported file. Use PDF, DOCX, TXT or an image.`);
}
