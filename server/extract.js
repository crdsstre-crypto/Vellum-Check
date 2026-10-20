// อ่านข้อความจากไฟล์ PDF และ Word (.docx) ฝั่งเซิร์ฟเวอร์
// รูปภาพไม่อยู่ที่นี่ เพราะต้องใช้ AI อ่าน (ดู transcribeImage ใน ai.js)
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export async function extractPdfText(buffer) {
  const result = await pdfParse(buffer);
  return result.text || '';
}

export async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}
