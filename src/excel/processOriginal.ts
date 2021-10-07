import { Workbook, Worksheet } from "exceljs";

export default function processOriginal(file: File) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async () => {
    if (!reader.result || typeof reader.result === "string") {
      alert("Failed to load file");
      return;
    }
    let workbook: Workbook;
    let rotation: Worksheet | undefined;
    try {
      const wb = new Workbook();
      workbook = await wb.xlsx.load(reader.result);
      console.log(
        `Found worksheets: ${workbook.worksheets.map((sheet) => sheet.name)}`
      );
      rotation = workbook.worksheets.find(
        (sheet) => sheet.name.toLowerCase() === "rotation"
      );
    } catch (error) {
      alert("Failed to read Excel doc. Check uploaded document and try again.");
      return;
    }

    if (!rotation) {
      alert("Couldn't find worksheet named 'Rotation'");
      return;
    }

    // Remove previous week
    rotation.spliceRows(2, 7);

    // Copy down last week to new week
    rotation.getRows(24, 6)?.forEach((row, index) => {
      if (!rotation) {
        alert("Couldn't find worksheet named 'Rotation'");
        return;
      }
      const copyRow = rotation.getRow(index + 32);
      copyRow.height = row.height;

      for (const col of [2, 3, 4]) {
        const cell = rotation.getCell(index + 24, col);
        const copy = rotation.getCell(index + 31, col);
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
              const shifted = rotation.getCell(30 - i, col);
              copy.value = shifted.value;
              i += 1;
            }
          } else if (cell.value) {
            const shifted = rotation.getCell(index + 24, col);
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
    anchor.download = file.name;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  return null;
}
