'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiCheck, FiTrash } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';
import React from 'react';
import { format, FormatOptions } from 'sql-formatter';

export default function SqlFormatter() {
  const { darkMode } = useAppContext();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [linesBetweenQueries, setLinesBetweenQueries] = useState(2);
  const [language, setLanguage] = useState<'sql' | 'mysql' | 'postgresql' | 'db2' | 'plsql' | 'tsql'>('sql');
  const [useTabs, setUseTabs] = useState(false);
  const [logicalOperatorNewline, setLogicalOperatorNewline] = useState<'before' | 'after'>('before');

  const dragging = useRef(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const options: FormatOptions = {
        tabWidth: indent,
        useTabs,
        keywordCase: uppercase ? 'upper' : 'lower',
        identifierCase: 'preserve',
        dataTypeCase: 'preserve',
        functionCase: 'preserve',
        indentStyle: 'standard',
        logicalOperatorNewline,
        expressionWidth: 80,
        linesBetweenQueries,
        denseOperators: false,
        newlineBeforeSemicolon: false,
      };
      const formatted = format(input, { ...options, language });
      setOutput(formatted);
    } catch {
      setOutput('');
    }
  }, [input, indent, uppercase, linesBetweenQueries, language, useTabs, logicalOperatorNewline]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setCopied(false);
  };

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
      const container = document.getElementById('sql-formatter-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        let percent = ((e.clientX - rect.left) / rect.width) * 100;
        percent = Math.max(20, Math.min(80, percent));
        setLeftWidth(percent);
      }
    }
  };
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="space-y-6">
                    <div className="flex items-center gap-2 flex-wrap">
              <label className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                缩进
                <select
                  value={indent}
                  onChange={e => setIndent(Number(e.target.value))}
                  className={`ml-1 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                  style={{ width: 60 }}
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </label>

              <label className={`text-sm flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                用 Tab 缩进
                <input
                  type="checkbox"
                  checked={useTabs}
                  onChange={e => setUseTabs(e.target.checked)}
                  className="ml-1 cursor-pointer"
                />
              </label>

              <label className={`text-sm flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                大写关键字
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={e => setUppercase(e.target.checked)}
                  className="ml-1 cursor-pointer"
                />
              </label>

              <label className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                查询间空行
                <select
                  value={linesBetweenQueries}
                  onChange={e => setLinesBetweenQueries(Number(e.target.value))}
                  className={`ml-1 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                  style={{ width: 60 }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </label>

              <label className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                逻辑操作符换行
                <select
                  value={logicalOperatorNewline}
                  onChange={e => setLogicalOperatorNewline(e.target.value as 'before' | 'after')}
                  className={`ml-1 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                  style={{ width: 100 }}
                >
                  <option value="before">前面换行</option>
                  <option value="after">后面换行</option>
                </select>
              </label>

              <label className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                SQL 方言
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as typeof language)}
                  className={`ml-1 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                  style={{ width: 130 }}
                >
                  <option value="sql">标准 SQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="db2">DB2</option>
                  <option value="plsql">PL/SQL (Oracle)</option>
                  <option value="tsql">T-SQL (SQL Server)</option>
                </select>
              </label>
            </div>
      <div
        id="sql-formatter-container"
        className="relative flex w-full h-[500px] border rounded-lg overflow-hidden"
        style={{ background: darkMode ? '#23272f' : '#fff' }}
      >
        {/* 左侧输入 */}
        <div
          className="h-full flex flex-col"
          style={{ width: `${leftWidth}%`, minWidth: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between px-3 p-3 h-auto min-h-[2.5rem] gap-y-2">
            <label className={`block text-base font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              原始 SQL
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <button className="btn btn-secondary p-2" onClick={handleClear} title="清空">
                <FiTrash />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={10}
            className={`flex-1 w-full resize-none px-3 py-2 rounded border outline-none overflow-auto ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            placeholder="粘贴或输入 SQL 语句"
            style={{ fontFamily: 'monospace', minWidth: 0 }}
            spellCheck={false}
          />
        </div>
        {/* 分割条 */}
        <div
          className="w-2 cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-blue-400 transition"
          style={{ zIndex: 10 }}
          onMouseDown={handleMouseDown}
        />
        {/* 右侧输出 */}
        <div
          className="h-full flex flex-col relative"
          style={{ width: `${100 - leftWidth}%`, minWidth: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between px-3 p-3 h-auto min-h-[2.5rem] gap-y-2">
            <label className={`block text-base font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              格式化结果（纯文本）
            </label>
              <button
                className="btn btn-primary"
                onClick={handleCopy}
                disabled={!output}
                title="复制结果"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className={`flex-1 w-full resize-none px-3 py-2 rounded border outline-none overflow-auto font-mono ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            spellCheck={false}
            placeholder="格式化后的 SQL 会显示在这里"
          />
          {copied && <div className="mt-2 text-green-500 text-sm px-3">已复制到剪贴板！</div>}
        </div>
      </div>
    </div>
  );
}