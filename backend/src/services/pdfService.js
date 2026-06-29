import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateInvoicePDF(invoice, client) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  let y = height - 60;

  page.drawText('INVOICE', { x: 50, y, font: fontBold, size: 28, color: rgb(0.1,0.1,0.1) });
  page.drawText(invoice.invoiceNumber, { x: 50, y: y-24, font, size: 12, color: rgb(0.5,0.5,0.5) });

  y -= 80;
  page.drawText('Bill To:', { x: 50, y, font: fontBold, size: 11 });
  page.drawText(client.name, { x: 50, y: y-16, font, size: 11 });
  if (client.company) page.drawText(client.company, { x: 50, y: y-30, font, size: 10, color: rgb(0.5,0.5,0.5) });
  page.drawText(client.email, { x: 50, y: y-44, font, size: 10, color: rgb(0.5,0.5,0.5) });
  page.drawText(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, { x: width-180, y, font: fontBold, size: 11 });

  y -= 100;
  page.drawRectangle({ x: 50, y: y-4, width: width-100, height: 22, color: rgb(0.95,0.95,0.95) });
  ['Description','Qty','Rate','Total'].forEach((h, i) => {
    page.drawText(h, { x: [55,340,400,470][i], y, font: fontBold, size: 10 });
  });

  for (const item of invoice.lineItems) {
    y -= 24;
    page.drawText(item.description, { x: 55, y, font, size: 10 });
    page.drawText(String(item.quantity), { x: 340, y, font, size: 10 });
    page.drawText(`$${item.rate.toFixed(2)}`, { x: 400, y, font, size: 10 });
    page.drawText(`$${item.total.toFixed(2)}`, { x: 470, y, font, size: 10 });
  }

  y -= 40;
  page.drawLine({ start:{x:400,y:y+16}, end:{x:width-50,y:y+16}, thickness:0.5, color:rgb(0.8,0.8,0.8) });
  page.drawText('Total:', { x: 400, y, font: fontBold, size: 12 });
  page.drawText(`$${invoice.total.toFixed(2)}`, { x: 470, y, font: fontBold, size: 12 });

  return Buffer.from(await pdfDoc.save());
}