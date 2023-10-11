import { useEffect, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { type editor } from 'monaco-editor';

import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { IconArrayDownTray, IconOverflowText, IconWrapText } from '@/icons';
import classNames from '@/utils/classnames';
import { maxRenderedOutputSizeBytes } from '@/utils/constants';
import Button from '../Button/Button';
import CopyButton from '../Button/CopyButton';

const LINE_HEIGHT = 26;
const MAX_HEIGHT = 275; // Equivalent to 10 lines
const MAX_LINES = 10;
const FONT = {
  size: 13,
  type: 'monospace',
  font: 'RobotoMono',
};

type MonacoEditorType = editor.IStandaloneCodeEditor | null;

interface CodeBlockProps {
  header?: {
    title?: string;
    description?: string;
    color?: string;
  };
  tabs: {
    label: string;
    content: string;
  }[];
}

export default function CodeBlock({ header, tabs }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const editorRef = useRef<MonacoEditorType>(null);

  const [originalContentHeight, setOriginalContentHeight] = useState(0);
  const [isWordWrap, setIsWordWrap] = useState(false);

  const { handleCopyClick, isCopying } = useCopyToClipboard();

  const monaco = useMonaco();
  const content = tabs[activeTab].content;

  useEffect(() => {
    if (!monaco) {
      return;
    }

    monaco.editor.defineTheme('inngest-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          token: 'delimiter.bracket.json',
          foreground: 'cbd5e1', //slate-300
        },
        {
          token: 'string.key.json',
          foreground: '818cf8', //indigo-400
        },
        {
          token: 'number.json',
          foreground: 'fbbf24', //amber-400
        },
        {
          token: 'string.value.json',
          foreground: '6ee7b7', //emerald-300
        },
        {
          token: 'keyword.json',
          foreground: 'f0abfc', //fuschia-300
        },
      ],
      colors: {
        'editor.background': '#1e293b4d', // slate-800/40
        'editorLineNumber.foreground': '#cbd5e14d', // slate-300/30
        'editorLineNumber.activeForeground': '#CBD5E1', // slate-300
      },
    });
  }, [monaco]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    } else {
      return text.length;
    }
  }

  const handleWrapText = () => {
    if (editorRef.current) {
      let containerWidth = editorRef?.current?.getLayoutInfo().contentWidth;
      const containerWidthWithLineNumbers =
        containerWidth + editorRef.current.getLayoutInfo().contentLeft;
      const contentWidth = editorRef?.current?.getContentWidth();

      // If lines are wider than the container, calculate approximately how many lines the code block has when text is wrapped
      if (contentWidth > containerWidth) {
        const linesContent = editorRef?.current?.getModel()?.getLinesContent();
        let totalLinesThatFit = 0;

        if (linesContent && linesContent.length > 0) {
          for (let lineNumber = 1; lineNumber <= linesContent.length; lineNumber++) {
            const lineContent = linesContent[lineNumber - 1];

            const lineLength = getTextWidth(
              lineContent,
              `${FONT.size}px ${FONT.font}, ${FONT.type}`,
            );

            if (lineLength <= containerWidth) {
              totalLinesThatFit++;
            } else {
              const linesNeeded = Math.ceil(lineLength / containerWidth);
              totalLinesThatFit += linesNeeded;
            }
          }
        }
        if (totalLinesThatFit > MAX_LINES) {
          editorRef?.current?.layout({ height: MAX_HEIGHT, width: containerWidthWithLineNumbers });
        } else {
          editorRef?.current?.layout({
            height: totalLinesThatFit * LINE_HEIGHT,
            width: containerWidthWithLineNumbers,
          });
        }
      } else {
        editorRef.current.layout({
          height: originalContentHeight,
          width: containerWidthWithLineNumbers,
        });
      }
      const newWordWrap = isWordWrap ? 'off' : 'on';
      editorRef.current.updateOptions({ wordWrap: newWordWrap });
      setIsWordWrap(!isWordWrap);
    }
  };

  // This prevents larger outputs from crashing the browser
  const isOutputTooLarge = content?.length > maxRenderedOutputSizeBytes;

  const downloadJson = ({ content }) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = 'data.json'; // Set the file name with a .json extension
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-800/40 border border-slate-700/30 rounded-lg shadow overflow-hidden">
      {header && (
        <div className={classNames(header.color, 'pt-3')}>
          {(header.title || header.description) && (
            <div className="flex flex-col gap-1 font-mono text-xs px-5 pb-2.5">
              <p className="text-white">{header.title}</p>
              <p className="text-white/60">{header.description}</p>
            </div>
          )}
        </div>
      )}
      <div className="bg-slate-800/40 flex justify-between shadow border-b border-slate-700/20">
        <div className="flex -mb-px">
          {tabs.map((tab, i) => {
            const isSingleTab = tabs.length === 1;
            const isActive = i === activeTab && !isSingleTab;

            return (
              <button
                key={i}
                className={classNames(
                  `text-xs px-5 py-2.5`,
                  isSingleTab
                    ? 'text-slate-400'
                    : 'border-b block transition-all duration-150 outline-none',
                  isActive && 'border-indigo-400 text-white',
                  !isActive && !isSingleTab && 'border-transparent text-slate-400',
                )}
                onClick={() => handleTabClick(i)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {!isOutputTooLarge && (
          <div className="flex gap-2 items-center mr-2">
            <CopyButton code={content} isCopying={isCopying} handleCopyClick={handleCopyClick} />
            <Button
              icon={isWordWrap ? <IconOverflowText /> : <IconWrapText />}
              btnAction={handleWrapText}
            />
          </div>
        )}
      </div>
      {isOutputTooLarge ? (
        <>
          <div className="px-5 py-2.5 text-xs bg-amber-500/40 text-white">
            Output size is too large to render {`( > 1MB )`}
          </div>
          <div className="h-24 flex items-center justify-center	">
            <Button
              label="Download Raw"
              icon={<IconArrayDownTray />}
              btnAction={() => downloadJson({ content: content })}
            />
          </div>
        </>
      ) : (
        <div>
          {monaco && (
            <Editor
              defaultLanguage="json"
              value={content}
              theme="inngest-theme"
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
                lineNumbers: 'on',
                extraEditorClassName: '',
                contextmenu: false,
                scrollBeyondLastLine: false,
                fontFamily: FONT.font,
                fontSize: FONT.size,
                fontWeight: 'light',
                lineHeight: LINE_HEIGHT,
                renderLineHighlight: 'none',
                renderWhitespace: 'none',
                guides: {
                  indentation: false,
                  highlightActiveBracketPair: false,
                  highlightActiveIndentation: false,
                },
                scrollbar: { verticalScrollbarSize: 10 },
                padding: {
                  top: 10,
                  bottom: 10,
                },
              }}
              onMount={(editor) => {
                handleEditorDidMount(editor);
                const contentHeight = editor.getContentHeight();
                if (contentHeight > MAX_HEIGHT) {
                  editor.layout({ height: MAX_HEIGHT, width: 0 });
                  setOriginalContentHeight(MAX_HEIGHT);
                } else {
                  editor.layout({ height: contentHeight, width: 0 });
                  setOriginalContentHeight(contentHeight);
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
