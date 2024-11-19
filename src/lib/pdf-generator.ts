import { jsPDF } from "jspdf";
import { WorkOrder } from "@/types/workOrder";

export const generateInvoicePDF = async (data: any): Promise<Blob> => {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.text('Invoice', 20, yPos);
  yPos += 20;

  doc.setFontSize(12);
  doc.text(`Invoice ID: ${data.billing.invoiceId}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  // Parts
  doc.setFontSize(16);
  doc.text('Parts', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  data.service.selectedParts.forEach((part: any) => {
    doc.text(`${part.name} x${part.quantity}`, 20, yPos);
    doc.text(`$${(part.price * part.quantity).toFixed(2)}`, 160, yPos);
    yPos += 10;
  });

  yPos += 10;

  // Labor
  doc.setFontSize(16);
  doc.text('Labor', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(
    `${data.service.laborTime.toFixed(2)} hours @ $${data.service.laborRate}/hour`,
    20,
    yPos
  );
  doc.text(`$${data.laborTotal.toFixed(2)}`, 160, yPos);
  yPos += 20;

  // Total
  doc.setFontSize(16);
  doc.text('Total:', 20, yPos);
  doc.text(`$${data.total.toFixed(2)}`, 160, yPos);

  return doc.output('blob');
};

export const generateWorkOrderPDF = async (data: WorkOrder & { totalTime: number; partsTotal: number; laborTotal: number; total: number }): Promise<Blob> => {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.text('Work Order Report', 20, yPos);
  yPos += 20;

  doc.setFontSize(12);
  doc.text(`Work Order ID: ${data.id}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  // Customer Information
  doc.setFontSize(16);
  doc.text('Customer Information', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(`Name: ${data.customer.name}`, 20, yPos);
  yPos += 10;
  doc.text(`Phone: ${data.customer.phone}`, 20, yPos);
  yPos += 10;
  doc.text(`Email: ${data.customer.email}`, 20, yPos);
  yPos += 20;

  // Rainbow Information
  doc.setFontSize(16);
  doc.text('Rainbow Information', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(`Model: ${data.machine.model}`, 20, yPos);
  yPos += 10;
  doc.text(`Serial Number: ${data.machine.serialNumber}`, 20, yPos);
  yPos += 10;
  doc.text(`Condition: ${data.machine.condition}`, 20, yPos);
  yPos += 20;

  // Service Details
  doc.setFontSize(16);
  doc.text('Service Details', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  const reportedIssueLines = doc.splitTextToSize(`Reported Issue: ${data.service.reportedIssue}`, 170);
  doc.text(reportedIssueLines, 20, yPos);
  yPos += reportedIssueLines.length * 10;

  const resolutionLines = doc.splitTextToSize(`Resolution: ${data.service.technicianNotes}`, 170);
  doc.text(resolutionLines, 20, yPos);
  yPos += resolutionLines.length * 10 + 10;

  doc.text(`Time in Possession: ${data.totalTime} days`, 20, yPos);
  yPos += 20;

  // Totals
  doc.setFontSize(16);
  doc.text('Totals', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(`Parts Total: $${data.partsTotal.toFixed(2)}`, 20, yPos);
  yPos += 10;
  doc.text(`Labor Total: $${data.laborTotal.toFixed(2)}`, 20, yPos);
  yPos += 10;
  doc.text(`Final Total: $${data.total.toFixed(2)}`, 20, yPos);

  return doc.output('blob');
};