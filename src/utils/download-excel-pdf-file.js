const downloadExcelPdfFile = (data, tableName, fileType) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const downloadUrl = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", `${tableName}_${currentDate}.${fileType}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default downloadExcelPdfFile;
