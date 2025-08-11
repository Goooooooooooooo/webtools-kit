'use client';

import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

export default function ColorConverter() {
  const [hexColor, setHexColor] = useState('#3498db');
  const [rgbColor, setRgbColor] = useState('rgb(52, 152, 219)');
  const [hslColor, setHslColor] = useState('hsl(204, 70%, 53%)');
  const [isValid, setIsValid] = useState(true);
  const { darkMode } = useAppContext();
  const [copied, setCopied] = useState(false);

    // 复制功能
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const hexToRgb = (hex: string) => {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 验证是否为3位或6位十六进制颜色
    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex)) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    
    // 如果是3位，扩展为6位
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // 转换为RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 扩展3位颜色
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // 转换为RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // 转换为HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = 0;
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 灰色
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexColor(value);
    
    if (value.length >= 4) {
      const rgb = hexToRgb(value);
      if (rgb) {
        setRgbColor(rgb);
        setHslColor(hexToHsl(value));
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">颜色格式转换</h2>
      {copied && (
        <div className={`mt-2 text-green-500 text-sm`}>已复制到剪贴板！</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={`block mb-2 ${ darkMode ? 'text-gray-100' : 'text-gray-800'}`}>HEX 颜色</label>
          <motion.div 
            className="search-container border rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input className={`${darkMode ? 'dark' : ''} ${isValid ? '' : 'border-red-700'}`}
              type="text"
              value={hexColor}
              onChange={handleHexChange}
              placeholder="#FFFFFF"
            />
          </motion.div>
          {/* <input
            type="text"
            value={hexColor}
            onChange={handleHexChange}
            placeholder="#FFFFFF"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 
              ${darkMode ? 'dark' : ''}
              ${isValid ? '' : 'border-red-700'}
            `}
          /> */}
          {!isValid && <p className="text-red-400 mt-2">请输入有效的十六进制颜色值</p>}
        </div>
        
        <div>
          <label className={`block mb-2 ${ darkMode ? 'text-gray-100' : 'text-gray-800'}`}>RGB 颜色</label>
          <motion.div 
            className="search-container border rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input className={`${darkMode ? 'dark' : ''}`}
              type="text"
              value={rgbColor}
              readOnly
            />
            <button onClick={() => handleCopy(rgbColor)}>
              <FiCopy />
            </button>
          </motion.div>
        </div>
        
        <div>
          <label className={`block mb-2 ${ darkMode ? 'text-gray-100' : 'text-gray-800'}`}>HSL 颜色</label>
          <motion.div 
            className="search-container border rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input className={`${darkMode ? 'dark' : ''}`}
              type="text"
              value={hslColor}
              readOnly
            />
            <button onClick={() => handleCopy(hslColor)}>
              <FiCopy />
            </button>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center">
        <div 
          className="w-full h-40 rounded-xl border border-blue-700 mb-4"
          style={{ backgroundColor: hexColor }}
        ></div>
        <p className={`${ darkMode ? 'text-gray-100' : 'text-gray-800'}`}>当前颜色预览</p>
      </div>
    </div>
  );
}