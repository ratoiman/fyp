import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@mui/material";
import ImageResize from "quill-image-resize/src/ImageResize";
import { isMobile } from "react-device-detect";
Quill.register("modules/imageResize", ImageResize);

const RichTextEditor = (props) => {
  const colors = [
    "#000000",
    "#e60000",
    "#ff9900",
    "#ffff00",
    "#008a00",
    "#0066cc",
    "#9933ff",
    "#ffffff",
    "#facccc",
    "#ffebcc",
    "#ffffcc",
    "#cce8cc",
    "#cce0f5",
    "#ebd6ff",
    "#bbbbbb",
    "#f06666",
    "#ffc266",
    "#ffff66",
    "#66b966",
    "#66a3e0",
    "#c285ff",
    "#888888",
    "#a10000",
    "#b26b00",
    "#b2b200",
    "#006100",
    "#0047b2",
    "#6b24b2",
    "#444444",
    "#5c0000",
    "#663d00",
    "#666600",
    "#003700",
    "#002966",
    "#3d1466",
  ];

  const modules = {
    imageResize: {
      displaySize: true,
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: true,
    },
    toolbar: [
      ["bold"],
      ["italic"],
      ["underline"],
      ["strike"],
      [{ list: "ordered" }],
      [{ list: "bullet" }],
      [{ indent: "-1" }],
      [{ indent: "+1" }],

      [{ header: [1, 2, 3] }],
      [{ size: [false, "small", "large", "huge"] }],
      [{ align: [] }],
      [{ color: ["#DAA520", ...colors] }],
      [{ background: ["#DAA520", ...colors] }],
      ["link"],
      ["image"],
    ],
  };

  const modulesMobile = {
    imageResize: {
      displaySize: true,
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: true,
    },
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      [
        { header: [1, 2, 3] },
        { size: [false, "small", "large", "huge"] },
        { align: [] },
      ],
      [
        { color: ["#DAA520", ...colors] },
        { background: ["#DAA520", ...colors] },
        "link",
        "image",
      ],
      // ["clear"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
  ];

  return (
    <Box>
      <ReactQuill
        theme={"snow"}
        value={props.description}
        onChange={props.setDescription}
        modules={isMobile ? modulesMobile : modules}
        formats={formats}
      />
    </Box>
  );
};

export const RichTextDisplay = (props) => {
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
  ];
  return (
    <ReactQuill
      readOnly
      theme={false}
      value={props.description}
      formats={formats}
    />
  );
};

export default RichTextEditor;
