import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const CustomTextarea = ({
  cssClasses,
  inputFieldId,
  labelText,
  value,
  handleOnChange,
  placeholder,
}) => {
  const editorRef = useRef(null);

  return (
    <div
      className={cssClasses}
      // style={{ position: "relative", marginBottom: "10%" }}
    >
      <Editor
        apiKey="your-api-key"
        initialValue={placeholder}
        onInit={(evt, editor) => (editorRef.current = editor)}
        textareaName={inputFieldId}
        onEditorChange={handleOnChange}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <label
        htmlFor={inputFieldId}
        // style={{
        //   position: "absolute",
        //   zIndex: 10,
        //   top: "-5%",
        //   left: "2%",
        //   display: "flex",
        //   alignItems: "center",
        //   width: "10%",
        //   backgroundColor: "white",
        // }}
      >
        {labelText}
      </label>
    </div>
  );
};

export default CustomTextarea;
