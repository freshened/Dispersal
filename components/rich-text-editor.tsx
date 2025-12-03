"use client"

import { useMemo, useEffect, useState } from "react"
import dynamic from "next/dynamic"

if (typeof window !== "undefined") {
  require("react-quill/dist/quill.snow.css")
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  )

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .rich-text-editor .ql-container {
        font-size: 14px;
        min-height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-top: none;
        border-radius: 0 0 0.5rem 0.5rem;
      }
      .rich-text-editor .ql-editor {
        color: white;
        min-height: 200px;
      }
      .rich-text-editor .ql-editor.ql-blank::before {
        color: rgba(255, 255, 255, 0.5);
        font-style: normal;
      }
      .rich-text-editor .ql-toolbar {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .rich-text-editor .ql-toolbar .ql-stroke {
        stroke: white;
      }
      .rich-text-editor .ql-toolbar .ql-fill {
        fill: white;
      }
      .rich-text-editor .ql-toolbar .ql-picker-label {
        color: white;
      }
      .rich-text-editor .ql-toolbar button:hover,
      .rich-text-editor .ql-toolbar button.ql-active {
        background: rgba(255, 255, 255, 0.1);
      }
      .rich-text-editor .ql-toolbar .ql-picker-options {
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .rich-text-editor .ql-toolbar .ql-picker-item {
        color: white;
      }
      .rich-text-editor .ql-toolbar .ql-picker-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-lg p-4 min-h-[200px]">
        <p className="text-white/50">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  )
}

