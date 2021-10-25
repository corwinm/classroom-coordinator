import {
  ChangeEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import processOriginal, { downloadWorkbook } from "../excel/processOriginal";
import FileInput from "./FileInput";
import { Workbook } from "exceljs";

type FormState = {
  workbook: Workbook | null;
  originalXl: File | null;
  tuesdayHoliday: boolean;
  thursdayHoliday: boolean;
};

const useForm = () => {
  const [formState, setFormState] = useState<FormState>({
    workbook: null,
    originalXl: null,
    tuesdayHoliday: false,
    thursdayHoliday: false,
  });
  const { tuesdayHoliday, thursdayHoliday, workbook, originalXl } = formState;

  useEffect(() => {
    (async () => {
      if (originalXl) {
        try {
          const processed = await processOriginal(originalXl, {
            tuesdayHoliday,
            thursdayHoliday,
          });
          setFormState({
            ...formState,
            workbook: processed,
          });
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        }
      }
    })();
  }, [originalXl, tuesdayHoliday, thursdayHoliday]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (workbook) {
      downloadWorkbook(workbook);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name || e.target.id;
    let value;
    switch (e.target.type) {
      case "file": {
        value = e.target?.files?.item(0);
        break;
      }
      case "checkbox":
        value = e.target.checked;
        break;
      default:
        break;
    }
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  return {
    formState,
    onSubmit,
    onChange,
  };
};

export default function UploadForm() {
  const {
    formState: { workbook, tuesdayHoliday, thursdayHoliday },
    onChange,
    onSubmit,
  } = useForm();

  return (
    <div className="m-4">
      <form
        onSubmit={onSubmit}
        className="max-w-lg mx-auto bg-white border-gray-200 border-2 rounded-md p-2"
      >
        <legend className="text-xl leading-10">Class Rotation</legend>
        <FileInput
          id="originalXl"
          label="Original Excel Document"
          accept=".xlsx"
          onChange={onChange}
          required
        />
        <fieldset className="my-2">
          <legend className="text-xl leading-10">Holiday?</legend>
          <div>
            <input
              type="checkbox"
              id="tuesdayHoliday"
              checked={tuesdayHoliday}
              onChange={onChange}
            />
            <label htmlFor="tuesdayHoliday" className="mx-1">
              Tuesday
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="thursdayHoliday"
              checked={thursdayHoliday}
              onChange={onChange}
            />
            <label htmlFor="thursdayHoliday" className="mx-1">
              Thursday
            </label>
          </div>
        </fieldset>
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white p-4 text-center mt-4 mb-2"
          >
            Download {workbook?.title}
          </button>
        </div>
      </form>
    </div>
  );
}
