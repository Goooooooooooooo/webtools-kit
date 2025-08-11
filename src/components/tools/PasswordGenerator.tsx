'use client';

import { useState } from 'react';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumber: boolean, useSymbol: boolean) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const number = '0123456789';
  const symbol = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (useUpper) chars += upper;
  if (useLower) chars += lower;
  if (useNumber) chars += number;
  if (useSymbol) chars += symbol;

  if (!chars) return '';

  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export default function PasswordGenerator() {
  const { darkMode } = useAppContext();
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumber, setUseNumber] = useState(true);
  const [useSymbol, setUseSymbol] = useState(false);
  const [password, setPassword] = useState(() =>
    generatePassword(13, true, true, true, false)
  );
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(generatePassword(length, useUpper, useLower, useNumber, useSymbol));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`space-y-6`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className={`block mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>生成密码</h3>
          <div className={`flex items-center border rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-800':'bg-white'}`}>
            <input
              type="text"
              value={password}
              readOnly
              className={`flex-1 bg-transparent outline-none ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
            />
            <button
              className="ml-2 btn btn-primary"
              onClick={handleCopy}
              title="复制密码"
            >
              <FiCopy />
            </button>
            <button
              className="ml-2 btn btn-secondary"
              onClick={handleGenerate}
              title="重新生成"
            >
              <FiRefreshCw />
            </button>
          </div>
          {copied && (
            <div className={`mt-2 text-green-500 text-sm`}>已复制到剪贴板！</div>
          )}
        </div>

        <div>
          <h3 className={`block mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>密码设置</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>密码长度</span>
              <input
                type="number"
                min={4}
                max={32}
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className={`w-20 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>包含大写字母</span>
              <input
                type="checkbox"
                checked={useUpper}
                onChange={e => setUseUpper(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>包含小写字母</span>
              <input
                type="checkbox"
                checked={useLower}
                onChange={e => setUseLower(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>包含数字</span>
              <input
                type="checkbox"
                checked={useNumber}
                onChange={e => setUseNumber(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>包含特殊字符</span>
              <input
                type="checkbox"
                checked={useSymbol}
                onChange={e => setUseSymbol(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}