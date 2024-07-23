import juice from "juice";

export default function processHTML(html) {
  const modifiedHtml = html
    .replace('<body>', `<body style="margin: 0; padding: 0; width: 100%;">`)
    .replace(/<p/g, `<p style="margin-top: 5pt; margin-bottom: 5pt; padding: 0;"`)
    .replace(/<li/g, `<li style="margin-top: 1pt; margin-bottom: 0pt; padding-top: 0; padding-bottom: 0;"`);

  const wrappedHtml = `
      <div style="width: 210mm; height: 297mm; margin: 0 auto; padding: 10mm 15mm;">
        ${modifiedHtml}
      </div>
    `;

  const inlinedHtml = juice(wrappedHtml);
  return inlinedHtml;
}