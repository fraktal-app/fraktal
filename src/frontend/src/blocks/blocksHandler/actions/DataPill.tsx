import React, { useRef, useEffect } from 'react';

// Utility functions (stringToHtmlWithPills, htmlToString, setCursorAfterNode) remain the same
const stringToHtmlWithPills = (str: string): string => {
  const escapeHtml = (unsafe: string) => 
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const parts = str.split(/(\{step_[^}]+\})/g);

  return parts.map(part => {
    if (/^\{step_[^}]+\}$/.test(part)) {
      const label = part.slice(1, -1);
      return `<span
        contentEditable="false"
        style="display: inline-block; background-color: #2a2e3f; border: 1px solid #4a4f62; border-radius: 4px; padding: 1px 6px; margin: 0 2px; font-size: 0.875rem; color: #c5c5d2; user-select: none; vertical-align: middle;"
        data-pill-value="${escapeHtml(part)}"
      >
        ${escapeHtml(label)}
      </span>`;
    }
    return escapeHtml(part);
  }).join('');
};

const htmlToString = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');

  tempDiv.querySelectorAll('span[data-pill-value]').forEach(pill => {
    const value = pill.getAttribute('data-pill-value');
    if (value) {
      pill.replaceWith(document.createTextNode(value));
    }
  });

  return tempDiv.textContent || '';
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
  onPillTrigger: (element: HTMLDivElement, currentValue: string, cursorPosition: number) => void; 
  lastInsertedPill: string | null;
  className?: string;
  placeholder?: string;
  rows?: number;
};

const ContentEditableWithPillsInput = ({
  value,
  onChange,
  onPillTrigger,
  lastInsertedPill,
  className = "",
  placeholder = "",
  rows = 1,
}: ContentEditableWithPillsInputProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueString = useRef(value);

  useEffect(() => {
    if (value === lastValueString.current) {
        return;
    }
    
    if (editorRef.current) {
        editorRef.current.innerHTML = stringToHtmlWithPills(value);
        lastValueString.current = value;
        
        if (lastInsertedPill) {
            const pillNodes = editorRef.current.querySelectorAll(`span[data-pill-value="${lastInsertedPill}"]`);
            const lastPillNode = pillNodes[pillNodes.length - 1];
            if (lastPillNode) {
                setCursorAfterNode(lastPillNode);
            }
        }
    }
  }, [value, lastInsertedPill]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;
    const newStringValue = htmlToString(currentTarget.innerHTML);
    
    lastValueString.current = newStringValue;
    onChange(newStringValue);
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        
        if (textNode.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
            const textContent = textNode.textContent || '';
            if (textContent[range.startOffset - 1] === '$') {
                // ✅ FIXED: Robustly calculate the absolute cursor position
                const editor = editorRef.current;
                let absolutePosition = 0;
                if (editor) {
                    const precedingRange = document.createRange();
                    precedingRange.setStart(editor, 0);
                    precedingRange.setEnd(range.startContainer, range.startOffset);
                    absolutePosition = precedingRange.toString().length;
                }
                
                onPillTrigger(currentTarget, newStringValue, absolutePosition); 
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