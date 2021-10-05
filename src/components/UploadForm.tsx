import { FormEventHandler, useRef } from "react";
import processOriginal from "../excel/processOriginal";

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
    <form noValidate onSubmit={onSubmit}>
      <label htmlFor="original-xl">Original Excel Document</label>
      <br />
      <input id="original-xl" type="file" ref={fileRef} accept=".xlsx" />
      <hr />
      <button type="submit">Process Document</button>
    </form>
  );
}
