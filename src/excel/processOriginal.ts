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
const tuesdayCol = 2;
const choreCol = 3;
const thursdayCol = 4;

export default function processOriginal(
  file: File,
  {
    tuesdayHoliday,
    thursdayHoliday,
  }: { tuesdayHoliday: boolean; thursdayHoliday: boolean }
) {
  return new Promise<Workbook>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      if (!reader.result || typeof reader.result === "string") {
        reject("Failed to load file");
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
        reject(
          "Failed to read Excel doc. Check uploaded document and try again."
        );
        return;
      }

      if (!rotation) {
        reject("Couldn't find worksheet named 'Rotation'");
        return;
      }

      // Remove previous week
      rotation.spliceRows(2, 7);

      // Copy down last week to new week
      rotation.getRows(lastWeekStartRow, 6)?.forEach((row, index) => {
        if (!rotation) {
          reject("Couldn't find worksheet named 'Rotation'");
          return;
        }
        const copyRow = rotation.getRow(index + thisWeekStartRow);
        copyRow.height = row.height;

        for (const col of [tuesdayCol, choreCol, thursdayCol]) {
          const cell = rotation.getCell(index + lastWeekStartRow, col);
          const copy = rotation.getCell(index + thisWeekStartRow, col);
          copy.style = cell.style;

          if ([tuesdayCol, thursdayCol].includes(col)) {
            if (index === 0) {
              const [day, rawDate] = cell.value?.toString().split(" ") ?? [];
              const date = new Date(rawDate);
              date.setDate(date.getDate() + 7);
              copy.value = `${day} ${date.toLocaleDateString()}`;
            } else if (
              (col === tuesdayCol && tuesdayHoliday) ||
              (col === thursdayCol && thursdayHoliday)
            ) {
              copy.value = index === 3 ? "No School" : "";
            } else if (index === 1) {
              let i = 0;
              while (cell.value && !copy.value && i < 5) {
                const shifted = rotation.getCell(lastWeekEndRow - i, col);
                copy.value = shifted.value;
                i += 1;
              }
            } else if (cell.value) {
              const shifted = rotation.getCell(
                index + lastWeekStartRow - 1,
                col
              );
              copy.value = shifted.value;
            }
            continue;
          }

          copy.value = cell.value;
        }
      });
      const start = parseDateFromHeaderCell(rotation.getCell(3, tuesdayCol));
      const end = parseDateFromHeaderCell(
        rotation.getCell(thisWeekStartRow, thursdayCol)
      );
      workbook.title = createFileName(file.name, start, end);
      resolve(workbook);
    };
  });
}

export async function downloadWorkbook(workbook: Workbook) {
  const data = await workbook.xlsx.writeBuffer();
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = workbook.title;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
