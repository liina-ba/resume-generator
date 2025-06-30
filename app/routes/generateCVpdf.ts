import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Answer } from '../routes/types';

export function generateCVPdf(answers: Answer[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setTextColor('#003366');
  doc.text('Curriculum Vitae', 105, 20, { align: 'center' });

  let y = 30;

  // Group answers by category
  const grouped: { [category: string]: { question: string; response: string }[] } = {};

  answers.forEach(({ question, answer }) => {
    const category = question.category || 'General';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ question: question.question, response: answer });
  });

  // Section-wise tables
  Object.entries(grouped).forEach(([category, items]) => {
    doc.setFontSize(16);
    doc.setTextColor('#1a1a1a');
    doc.text(category, 14, y);
    y += 4;

    autoTable(doc, {
      head: [['Question', 'Response']],
      body: items.map((item) => [item.question, item.response]),
      startY: y + 2,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'left' },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110 },
      },
      margin: { left: 14, right: 14 },
      theme: 'striped',
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('cv.pdf');
}
