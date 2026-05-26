import { pdf } from '@react-pdf/renderer';
import { PaperPDFDoc } from '@/components/PaperPDF';

export async function downloadPaper(paper: any) {
  const { createElement } = await import('react');
  const blob = await pdf(createElement(PaperPDFDoc, { paper }) as any).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${paper.title?.replace(/\s+/g, '_') ?? 'paper'}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}