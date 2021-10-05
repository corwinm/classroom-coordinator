import ExcelJS from "exceljs";

export default function processOriginal(file: File) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async () => {
    if (!reader.result || typeof reader.result === "string") {
      alert("Failed to load file");
      return;
    }
    const wb = new ExcelJS.Workbook();
    const workbook = await wb.xlsx.load(reader.result);
    console.log(
      `Found worksheets: ${workbook.worksheets.map((sheet) => sheet.name)}`
    );
    const roster = workbook.worksheets.find(
      (sheet) => sheet.name.toLowerCase() === "rotation"
    );

    // Remove previous week
    roster?.spliceRows(3, 6);

    // Copy down last week to new week
    roster?.getRows(25, 6)?.forEach((row, index) => {
      for (const col of [2, 3, 4]) {
        const cell = roster.getCell(index + 25, col);
        const copy = roster.getCell(index + 32, col);
        copy.style = cell.style;

        if ([2, 4].includes(col)) {
          if (index === 0) {
            const [day, rawDate] = cell.value?.toString().split(" ") ?? [];
            const date = new Date(rawDate);
            date.setDate(date.getDate() + 7);
            copy.value = `${day} ${date.toLocaleDateString()}`;
          } else if (index === 1) {
            let i = 0;
            while (cell.value && !copy.value && i < 5) {
              const shifted = roster.getCell(30 - i, col);
              copy.value = shifted.value;
              i += 1;
            }
          } else if (cell.value) {
            const shifted = roster.getCell(index + 24, col);
            copy.value = shifted.value;
          }
          continue;
        }

        copy.value = cell.value;
      }
    });

    const data = await workbook.xlsx.writeBuffer();
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "test.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  return null;
}
