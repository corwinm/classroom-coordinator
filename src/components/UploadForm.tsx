import { FormEventHandler, useRef } from "react";
import processOriginal from "../excel/processOriginal";
import FileInput from "./FileInput";

export default function UploadForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (fileRef.current?.files && fileRef.current.files.length) {
      console.log(`Found ${fileRef.current.files.length} files`);
      const workbook = fileRef.current.files[0];
      processOriginal(workbook);
    }
  };
  return (
    <div className="m-4">
      <form
        onSubmit={onSubmit}
        className="max-w-lg mx-auto bg-white border-gray-200 border-2 rounded-md p-2"
      >
        <legend className="text-xl leading-10">Class Rotation</legend>
        <FileInput
          id="original-xl"
          label="Original Excel Document"
          accept=".xlsx"
          required
          ref={fileRef}
        />
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white p-4 text-center mt-4 mb-2"
          >
            Create Next Sheet
          </button>
        </div>
      </form>
    </div>
  );
}
