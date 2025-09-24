import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import { useEffect, useRef } from "react";
import "highlight.js/styles/stackoverflow-dark.css";

hljs.registerLanguage("javascript", javascript);

const CodeSnippet = ({ code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(codeRef.current);
  },[]);

  return (
    <pre>
      <code className="javascript" ref={codeRef}>
        {`${code}`}
      </code>
    </pre>
  );
};

export default CodeSnippet;
