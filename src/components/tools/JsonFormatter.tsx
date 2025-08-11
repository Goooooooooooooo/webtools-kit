'use client';

import { useState, useRef } from 'react';
import { FiCopy, FiCheck, FiTrash, FiEdit3 } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';
import React from 'react';

export default function JsonFormatter() {
  const { darkMode } = useAppContext();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // 百分比
  const [indent, setIndent] = useState(2); // 新增：缩进
  const dragging = useRef(false);

  // 当缩进变化时自动格式化（如果输入有效）
  React.useEffect(() => {
    if (!input) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, indent));
      setError('');
    } catch {
      setOutput('');
      setError('JSON 格式错误，请检查输入内容');
    }
  }, [indent, input]);

  const handleFormat = () => {
    setError('');
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, indent));
    } catch (e) {
      setError('JSON 格式错误，请检查输入内容\n' + e);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopied(false);
  };

  // 拖动分割条
  const handleMouseDown = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
  };
  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = '';
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current) {
      const container = document.getElementById('json-formatter-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        let percent = ((e.clientX - rect.left) / rect.width) * 100;
        percent = Math.max(20, Math.min(80, percent)); // 限制最小最大宽度
        setLeftWidth(percent);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="space-y-6">
      <div
        id="json-formatter-container"
        className="relative flex w-full h-[400px] border rounded-lg overflow-hidden"
        style={{ background: darkMode ? '#23272f' : '#fff' }}
      >
        {/* 左侧输入框 */}
        <div
          className="h-full flex flex-col"
          style={{ width: `${leftWidth}%`, minWidth: 0 }}
        >
          {/* 左侧输入框标题和操作栏 */}
          <div className="flex flex-wrap items-center justify-between px-3 p-3 h-auto min-h-[2.5rem] gap-y-2">
            <label className={`block text-base font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>原始 JSON</label>
            <div className="flex flex-wrap gap-2 items-center">
              <button className="btn btn-primary p-2" onClick={handleFormat} title="格式化">
                <FiEdit3 />
              </button>
              <button className="btn btn-secondary p-2" onClick={handleClear} title="清空">
                <FiTrash />
              </button>
              <label className={`ml-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>缩进</label>
              <select
                value={indent}
                onChange={e => setIndent(Number(e.target.value))}
                className={`px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                style={{ width: 60 }}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
              </select>
            </div>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={1}
            className={`flex-1 w-full resize-none px-3 py-2 rounded border outline-none overflow-auto ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            placeholder="粘贴或输入 JSON 数据"
            style={{ fontFamily: 'monospace', minWidth: 0 }}
            spellCheck={false}
          />
          {error && <div className="mt-2 text-red-500 text-sm px-3">{error}</div>}
        </div>
        {/* 分割条 */}
        <div
          className="w-2 cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-blue-400 transition"
          style={{ zIndex: 10 }}
          onMouseDown={handleMouseDown}
        />
        {/* 右侧输出框 */}
        <div
          className="h-full flex flex-col relative"
          style={{ width: `${100 - leftWidth}%`, minWidth: 0 }}
        >
          {/* 右侧输出框标题和操作栏 */}
          <div className="flex flex-wrap items-center justify-between px-3 p-3 h-auto min-h-[2.5rem] gap-y-2">
            <label className={`block text-base font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>格式化结果</label>
            <button
              className="btn btn-primary"
              onClick={handleCopy}
              disabled={!output}
              title="复制结果"
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          </div>
          <div className="relative flex-1 flex">
            <textarea
              value={output}
              readOnly
              rows={1}
              className={`flex-1 w-full resize-none px-3 py-2 rounded border outline-none overflow-auto ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
              placeholder="格式化后的 JSON"
              style={{ fontFamily: 'monospace', minWidth: 0 }}
              spellCheck={false}
            />
          </div>
          {copied && <div className="mt-2 text-green-500 text-sm px-3">已复制到剪贴板！</div>}
        </div>
      </div>
    </div>
  );
}