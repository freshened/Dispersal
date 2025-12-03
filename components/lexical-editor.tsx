"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { LinkNode } from "@lexical/link"
import { $getRoot, EditorState, $getSelection, $isRangeSelection, $isTextNode } from "lexical"
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { $isHeadingNode, $createHeadingNode } from "@lexical/rich-text"
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Type } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    ul: "list-disc list-inside mb-4",
    ol: "list-decimal list-inside mb-4",
    listitem: "mb-1",
  },
  paragraph: "mb-4",
  quote: "border-l-4 border-white/30 pl-4 italic my-4",
}

function onError(error: Error) {
  console.error(error)
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
  }

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
  }

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
  }

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getTopLevelElementOrThrow()
        if ($isHeadingNode(element)) {
          element.replace($createHeadingNode(headingSize))
        } else {
          const heading = $createHeadingNode(headingSize)
          element.replace(heading)
          heading.select()
        }
      }
    })
  }

  const formatList = (listType: "bullet" | "number") => {
    if (listType === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    }
  }

  const formatFontSize = (fontSize: string) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        const nodes = selection.getNodes()
        nodes.forEach((node) => {
          if ($isTextNode(node)) {
            const currentStyle = node.getStyle() || ''
            const cleanedStyle = currentStyle.replace(/font-size:\s*[^;]+;?/g, '').trim()
            const newStyle = cleanedStyle 
              ? `${cleanedStyle}; font-size: ${fontSize};`
              : `font-size: ${fontSize};`
            node.setStyle(newStyle)
          }
        })
      }
    })
  }

  return (
    <div className="flex gap-2 p-2 border-b border-white/10 bg-white/5 rounded-t-lg">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={formatBold}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={formatItalic}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={formatUnderline}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <div className="w-px bg-white/20 mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h1")}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h2")}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="w-px bg-white/20 mx-1" />
      <Select onValueChange={formatFontSize}>
        <SelectTrigger className="h-8 w-auto px-2 text-white border-white/20 bg-white/5 hover:bg-white/10 text-xs">
          <Type className="h-3 w-3 mr-1" />
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/20">
          <SelectItem value="12px">12px</SelectItem>
          <SelectItem value="14px">14px</SelectItem>
          <SelectItem value="16px">16px</SelectItem>
          <SelectItem value="18px">18px</SelectItem>
          <SelectItem value="20px">20px</SelectItem>
          <SelectItem value="24px">24px</SelectItem>
          <SelectItem value="28px">28px</SelectItem>
          <SelectItem value="32px">32px</SelectItem>
          <SelectItem value="36px">36px</SelectItem>
          <SelectItem value="48px">48px</SelectItem>
        </SelectContent>
      </Select>
      <div className="w-px bg-white/20 mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatList("bullet")}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatList("number")}
        className="h-8 w-8 p-0 text-white hover:bg-white/10"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}

function SetInitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (value) {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        const parser = new DOMParser()
        const dom = parser.parseFromString(value, "text/html")
        const nodes = $generateNodesFromDOM(editor, dom)
        root.append(...nodes)
      })
    }
  }, [editor, value])

  return null
}

interface LexicalEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function OnChangePluginWrapper({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot()
      const htmlString = $generateHtmlFromNodes(editor, null)
      onChange(htmlString)
    })
  }

  return <OnChangePlugin onChange={handleChange} />
}

export function LexicalEditor({ value, onChange, placeholder = "Start writing..." }: LexicalEditorProps) {
  const initialConfig = {
    namespace: "BlogEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
    ],
  }

  return (
    <div className="border border-white/20 rounded-lg overflow-hidden bg-white/10">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] p-4 text-white outline-none prose prose-invert max-w-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-white/50 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePluginWrapper onChange={onChange} />
          <HistoryPlugin />
          <SetInitialValuePlugin value={value} />
        </div>
      </LexicalComposer>
    </div>
  )
}

