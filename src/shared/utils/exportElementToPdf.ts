interface ExportElementToPdfOptions {
  fileName: string;
  margin?: number;
}

export const exportElementToPdf = async (
  element: HTMLElement,
  options: ExportElementToPdfOptions
) => {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: Math.min(window.devicePixelRatio || 1, 2),
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = options.margin ?? 24;
  const renderWidth = pageWidth - margin * 2;
  const renderHeight = (canvas.height * renderWidth) / canvas.width;

  let remainingHeight = renderHeight;
  let imageOffsetY = margin;

  pdf.addImage(imageData, "PNG", margin, imageOffsetY, renderWidth, renderHeight);
  remainingHeight -= pageHeight - margin * 2;

  while (remainingHeight > 0) {
    imageOffsetY -= pageHeight - margin * 2;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", margin, imageOffsetY, renderWidth, renderHeight);
    remainingHeight -= pageHeight - margin * 2;
  }

  pdf.save(options.fileName);
};
