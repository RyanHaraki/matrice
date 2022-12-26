import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UploadWidget = () => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      maxFiles: 1,
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const renderText = () => {
    if (!acceptedFiles) {
      return (
        <>
          {isDragActive ? (
            <p className="cursor-default">Drop the files here ...</p>
          ) : (
            <p className="cursor-default ">Drag and Drop files here</p>
          )}
        </>
      );
    } else {
      acceptedFiles.map(({ file, errors }) => {
        return <p>`${file.byteLength} bytes`;</p>;
      });
    }
  };

  return (
    <div
      className={`border border-dashed border-gray-400 rounded-md w-full text-center text-sm text-gray-400 py-4 hover:shadow-md hover:shadow-blue-200 transition-all ${
        isDragActive && "shadow-md shadow-blue-200"
      }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <ul>
        {acceptedFileItems.toString().length > 0
          ? acceptedFileItems
          : "Drop the files here"}
      </ul>
    </div>
  );
};

export default UploadWidget;
