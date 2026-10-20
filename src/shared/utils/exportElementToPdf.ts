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
    windowWidth: Math.max(document.documentElement.clientWidth, element.scrollWidth),
    windowHeight: Math.max(document.documentElement.clientHeight, element.scrollHeight),
    onclone: (_document, clonedElement) => {
      clonedElement.querySelectorAll<HTMLDetailsElement>("details[data-pdf-expand]").forEach((details) => {
        details.open = true;
      });
      // 스크롤 영역 안의 피드백도 화면 너비를 유지한 채 끝까지 내보낸다.
      let parent = clonedElement.parentElement;
      while (parent) {
        parent.style.overflow = "visible";
        parent = parent.parentElement;
      }
    },
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
