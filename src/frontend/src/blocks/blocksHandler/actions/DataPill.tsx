import React, { useRef, useEffect, useMemo } from 'react';
// Assuming the path to your type definition file
import type { AvailableDataSource } from '../../../components/workflowBuilder/types';

// ✅ MODIFIED: Updated to look up labels using the new pill format
const stringToHtmlWithPills = (str: string, labelMap: { [key: string]: string }): string => {
  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const pillRegex = /(\$\?\{[^}]+\})/g;

  if (str === '') return '';

  const parts = str.split(pillRegex);

  return parts.map(part => {
    if (pillRegex.test(part)) {
      // Extract the key from the format: $?{<key>}
      const mapKey = part.substring(3, part.length - 1); 
      const label = labelMap[mapKey] || mapKey; // Use the key itself as a fallback label
      return `<span
          contentEditable="false"
          style="display: inline-block; background-color: #2a2e3f; border: 1px solid #4a4f62; border-radius: 4px; padding: 1px 6px; margin: 0 2px; font-size: 0.875rem; color: #c5c5d2; user-select: none; vertical-align: middle;"
          data-pill-value="${escapeHtml(part)}"
      >
          ${escapeHtml(label)}
      </span>`;
    }
    return escapeHtml(part).replace(/\n/g, '<br>');
  }).join('');
};

const htmlToString = (html: string): string => {
  let processedHtml = html;

  const tempPillDiv = document.createElement('div');
  tempPillDiv.innerHTML = processedHtml;
  tempPillDiv.querySelectorAll('span[data-pill-value]').forEach(pill => {
    const value = pill.getAttribute('data-pill-value');
    if (value) {
      pill.replaceWith(document.createTextNode(value));
    }
  });
  processedHtml = tempPillDiv.innerHTML;

  processedHtml = processedHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n');

  const tempStripDiv = document.createElement('div');
  tempStripDiv.innerHTML = processedHtml;
  let text = tempStripDiv.textContent || '';

  if (text.endsWith('\n')) {
    text = text.slice(0, -1);
  }

  return text.replace(/\u00A0/g, ' ');
};

const setCursorAfterNode = (node: Node) => {
    const selection = window.getSelection();
    if (selection) {
        const range = document.createRange();
        range.setStartAfter(node);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

type ContentEditableWithPillsInputProps = {
  value: string;
  onChange: (newValue: string) => void;
  onPillTrigger: (element: HTMLDivElement) => void; 
  lastInsertedPill: { value: string; instanceIndex: number } | null;
  setLastInsertedPill: (v: null) => void; 
  className?: string;
  placeholder?: string;
  rows?: number;
  availableDataSources?: AvailableDataSource[];
};

const ContentEditableWithPillsInput = ({
  value,
  onChange,
  onPillTrigger,
  lastInsertedPill,
  setLastInsertedPill,
  className = "",
  placeholder = "",
  rows = 1,
  availableDataSources = [],
}: ContentEditableWithPillsInputProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // ✅ MODIFIED: Generates the label map using the new pill format
  const pillLabelMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    for (const source of availableDataSources) {
      if (!source.id) continue;
      for (const key in source.data) {
        const mapKey = `${source.id}.${source.appType}/${key}`;
        map[mapKey] = source.data[key].label;
      }
    }
    return map;
  }, [availableDataSources]);

  useEffect(() => {
    if (!editorRef.current) return;
    const currentDomString = htmlToString(editorRef.current.innerHTML);
    if (value !== currentDomString) {
      editorRef.current.innerHTML = stringToHtmlWithPills(value, pillLabelMap);
    }
    if (lastInsertedPill) {
      const pillNodes = editorRef.current.querySelectorAll(`span[data-pill-value="${lastInsertedPill.value}"]`);
      const targetNode = pillNodes[lastInsertedPill.instanceIndex];
      if (targetNode) {
        setCursorAfterNode(targetNode);
      }
    }
  }, [value, lastInsertedPill, pillLabelMap]);

  useEffect(() => {
    if (lastInsertedPill) {
      const timer = setTimeout(() => {
        setLastInsertedPill(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [lastInsertedPill, setLastInsertedPill]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;
    const newStringValue = htmlToString(currentTarget.innerHTML);
    onChange(newStringValue);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
            const textContent = textNode.textContent || '';
            if (textContent[range.startOffset - 1] === '$') {
                onPillTrigger(currentTarget); 
            }
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    if (e.key === 'Backspace' && range.startOffset === 0 && container.previousSibling && (container.previousSibling as HTMLElement).hasAttribute('data-pill-value')) {
        e.preventDefault();
        container.previousSibling.remove();
        handleInput(e as any); 
        return;
    }
    if (e.key === 'ArrowRight') {
        const node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE && range.startOffset === node.textContent?.length) {
            const nextSibling = node.nextSibling;
            if (nextSibling && (nextSibling as HTMLElement).hasAttribute('data-pill-value')) {
                e.preventDefault();
                setCursorAfterNode(nextSibling);
            }
        }
    }
    if (e.key === 'ArrowLeft') {
        const node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
            const prevSibling = node.previousSibling;
            if (prevSibling && (prevSibling as HTMLElement).hasAttribute('data-pill-value')) {
                e.preventDefault();
                const newRange = document.createRange();
                newRange.setStartBefore(prevSibling);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }
  };
  
  const minHeight = `${1.5 * (rows || 1) + 1}rem`; 

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`${className} relative`}
      style={{ minHeight }}
      suppressContentEditableWarning={true}
      data-placeholder={placeholder}
    />
  );
};

export default ContentEditableWithPillsInput;