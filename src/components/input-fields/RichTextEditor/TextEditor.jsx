import { useEffect, useState } from "react";
import {
    EditorState,
    ContentState,
    convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";

const editorLabels = {
    "generic.add": "Add",
    "generic.cancel": "Cancel",
};
let prevValue = "";

const TextEditor = ({ style, label, handleData, value = "", isFile, required }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (newEditorState) => {
        const newText = newEditorState.getCurrentContent().getPlainText();
        prevValue = newText;
        handleData(newText);
        setEditorState(newEditorState);
    };

    useEffect(() => {
        if ((prevValue !== value && value) || value === "") {
            const contentState = ContentState.createFromText(value);
            let newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState);
        }
    }, [value, isFile]);

    return (
        <div className="row multiRows">
            <div style={style}>
                <label
                    style={{ padding: "8px", fontSize: "13px", color: "black" }}
                    htmlFor="my-editor"
                >
                    {label}
                    {required && <span style={{color:"#f00"}}>*</span>}
                </label>

                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    localization={{
                        locale: "en",
                        translations: editorLabels["generic.add"],
                    }}
                    onEditorStateChange={onEditorStateChange}
                    id="my-editor"
                    mention={{
                        separator: " ",
                        trigger: "@",
                        suggestions: [
                            { text: "APPLE", value: "apple" },
                            { text: "BANANA", value: "banana", url: "banana" },
                            { text: "CHERRY", value: "cherry", url: "cherry" },
                            { text: "DURIAN", value: "durian", url: "durian" },
                            {
                                text: "EGGFRUIT",
                                value: "eggfruit",
                                url: "eggfruit",
                            },
                            { text: "FIG", value: "fig", url: "fig" },
                            {
                                text: "GRAPEFRUIT",
                                value: "grapefruit",
                                url: "grapefruit",
                            },
                            {
                                text: "HONEYDEW",
                                value: "honeydew",
                                url: "honeydew",
                            },
                        ],
                    }}
                />
            </div>
        </div>
    );
};

export default TextEditor;
