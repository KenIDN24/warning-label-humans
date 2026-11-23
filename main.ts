// Warning Label for Humans — one-line safety label, <= 160 chars.
// Writes the label to <OUTPUT_DIR>/entry.txt (default /output).
// Guard: exactly one line, 1-160 Unicode code points, no trailing newline.
import * as fs from "node:fs";
import * as path from "node:path";

const LABEL =
  "WARNING: Contents may suddenly burst into song, cry at commercials, and insist it is fine. Handle with snacks and low expectations.";

function codePoints(s: string): number {
  return [...s].length;
}

function validate(label: string): void {
  const n = codePoints(label);
  if (n < 1 || n > 160) {
    throw new Error(`label must be 1-160 chars, got ${n}`);
  }
  if (label.includes("\n") || label.includes("\r")) {
    throw new Error("label must be a single line");
  }
  if (label.trim().length === 0) {
    throw new Error("label must not be only whitespace");
  }
  // Criterion 1: it must read as a printed safety label, not a plain sentence.
  if (!/^(WARNING|CAUTION|DANGER):/.test(label)) {
    throw new Error("label must start with a warning header (WARNING:/CAUTION:/DANGER:)");
  }
}

function main(): void {
  validate(LABEL);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "entry.txt");
  fs.writeFileSync(out, LABEL, "utf8");
  // Round-trip check: what we wrote is byte-for-byte the label.
  const back = fs.readFileSync(out, "utf8");
  if (back !== LABEL) throw new Error("round-trip mismatch");
  console.log(`wrote ${out} (${codePoints(LABEL)} chars)`);
}

main();
