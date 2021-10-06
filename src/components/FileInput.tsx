import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  useState,
} from "react";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FileInput: ForwardRefRenderFunction<HTMLInputElement, FileInputProps> = (
  { id, label, accept, ...rest },
  ref
) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <>
      <label htmlFor={id} className="leading-8">
        {label}
      </label>
      <div
        className={`relative px-4 py-8 border-dashed border-gray-500 border-4 text-center hover:bg-gray-200 ${
          dragging && "bg-blue-200"
        }`}
      >
        {fileName === null ? (
          <div>
            Drag file here or{" "}
            <span className="text-blue-600 underline">select file</span>
          </div>
        ) : (
          fileName
        )}
        <input
          type="file"
          ref={ref}
          id={id}
          accept={accept}
          {...rest}
          style={{ textIndent: "-999em" }}
          onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
          onDragEnter={(e) => setDragging(true)}
          onDragLeave={(e) => setDragging(false)}
          onDragEnd={(e) => setDragging(false)}
          onDrop={(e) => setDragging(false)}
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
        />
      </div>
    </>
  );
};

export default forwardRef(FileInput);
