import { Cell, Workbook, Worksheet } from "exceljs";

function parseDateFromHeaderCell(header: Cell) {
  return (
    header.value?.toString().split(" ")[1].split("/").slice(0, 2).join("-") ||
    "N/A"
  );
}

function createFileName(previous: string, start: string, end: string) {
  const parsedName = previous.substring(0, previous.indexOf("rotation") + 8);
  return `${parsedName} ${start} to ${end}`;
}

const lastWeekStartRow = 24;
const lastWeekEndRow = 29;
const thisWeekStartRow = 31;

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
    rotation.getRows(lastWeekStartRow, 6)?.forEach((row, index) => {
      if (!rotation) {
        alert("Couldn't find worksheet named 'Rotation'");
        return;
      }
      const copyRow = rotation.getRow(index + thisWeekStartRow);
      copyRow.height = row.height;

      for (const col of [2, 3, 4]) {
        const cell = rotation.getCell(index + lastWeekStartRow, col);
        const copy = rotation.getCell(index + thisWeekStartRow, col);
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
              const shifted = rotation.getCell(lastWeekEndRow - i, col);
              copy.value = shifted.value;
              i += 1;
            }
          } else if (cell.value) {
            const shifted = rotation.getCell(index + lastWeekStartRow - 1, col);
            copy.value = shifted.value;
          }
          continue;
        }

        copy.value = cell.value;
      }
    });
    const start = parseDateFromHeaderCell(rotation.getCell(3, 2));
    const end = parseDateFromHeaderCell(rotation.getCell(thisWeekStartRow, 4));

    const data = await workbook.xlsx.writeBuffer();
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createFileName(file.name, start, end);
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  return null;
}
