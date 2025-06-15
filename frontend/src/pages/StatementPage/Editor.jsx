import React from "react";
import Editor from "@monaco-editor/react";

export function MultiLanguageEditor(value, setValue) {
  function handleEditorChange(value, event) {
    setValue(value);
  }

  return (
    <Editor
      value={value}
      height="100%"
      defaultLanguage="python"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
}

