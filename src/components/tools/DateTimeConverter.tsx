'use client';

import { useState, useEffect, useRef } from 'react';
import { FiCopy, FiCheck, FiRefreshCw, FiCalendar, FiHash, FiInfo } from 'react-icons/fi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useAppContext } from '@/context/AppContext';

// 扩展 dayjs 功能
dayjs.extend(utc);
dayjs.extend(timezone);

// 常用时区列表
const timezones = Intl.supportedValuesOf("timeZone");

// 常用Cron表达式示例
const cronExamples = [
  { expression: '0 * * * *', description: '每小时运行一次' },
  { expression: '0 0 * * *', description: '每天午夜运行' },
  { expression: '0 0 * * 0', description: '每周日午夜运行' },
  { expression: '0 0 1 * *', description: '每月1日午夜运行' },
  { expression: '0 0 1 1 *', description: '每年1月1日午夜运行' },
  { expression: '*/5 * * * *', description: '每5分钟运行一次' },
  { expression: '0 9 * * 1-5', description: '工作日早上9点运行' },
  { expression: '0 0 1,15 * *', description: '每月1日和15日午夜运行' },
];

// 类型定义
type TimeUnit = 'seconds' | 'milliseconds';
type CopyType = 'timestamp' | 'date';

export default function DateTimeConverter() {
  // 使用上下文中的暗黑模式
  const { darkMode } = useAppContext();
  
  // 状态管理
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateTimeInput, setDateTimeInput] = useState<string>('');
  const [timestampOutput, setTimestampOutput] = useState<string>('');
  const [dateTimeOutput, setDateTimeOutput] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('seconds');
  const [targetTimezone, setTargetTimezone] = useState<string>(dayjs.tz.guess());
  const [copied, setCopied] = useState<{ [key in CopyType]: boolean }>({
    timestamp: false,
    date: false,
  });
  const [dateFormatHelp, setDateFormatHelp] = useState<boolean>(false);

  // 时间显示引用
  const timeRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 初始化当前时间
  useEffect(() => {
    const now = dayjs();
    setDateTimeInput(now.format('YYYY-MM-DD HH:mm:ss'));
    setTimestampInput(Math.floor(now.valueOf() / 1000).toString());
  }, []);

  // 更新时间显示
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRef.current) {
        const now = dayjs();
        timeRef.current.innerText = now.format('HH:mm:ss');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 时间戳转日期时间（输出目标时区）
  useEffect(() => {
    if (!timestampInput.trim()) {
      setDateTimeOutput('');
      return;
    }
    
    try {
      const timestampValue = parseInt(timestampInput, 10);
      if (isNaN(timestampValue)) {
        setDateTimeOutput('无效的时间戳');
        return;
      }
      
      const timestampMs = timeUnit === 'seconds' ? timestampValue * 1000 : timestampValue;
      const date = dayjs(timestampMs);
      
      if (!date.isValid()) {
        setDateTimeOutput('时间戳无效或超出范围');
        return;
      }
      
      // 转换为目标时区
      const formattedDate = date.tz(targetTimezone).format('YYYY-MM-DD HH:mm:ss');
      setDateTimeOutput(formattedDate);
    } catch (error) {
      setDateTimeOutput('转换错误');
      console.log(error);
    }
  }, [timestampInput, timeUnit, targetTimezone]);

  // 日期时间转时间戳
  useEffect(() => {
    if (!dateTimeInput.trim()) {
      setTimestampOutput('');
      return;
    }
    
    try {
      // 尝试解析各种日期格式
      let date;
      const formats = [
        'YYYY-MM-DD HH:mm:ss.SSS',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm',
        'YYYY/MM/DD HH:mm:ss.SSS',
        'YYYY/MM/DD HH:mm:ss',
        'YYYY/MM/DD HH:mm',
        'YYYY.MM.DD HH:mm:ss.SSS',
        'YYYY.MM.DD HH:mm:ss',
        'YYYY.MM.DD HH:mm',
      ];
      
      for (const format of formats) {
        date = dayjs(dateTimeInput, format);
        if (date.isValid()) break;
      }
      
      if (!date || !date.isValid()) {
        setTimestampOutput('无效的日期格式');
        return;
      }
      
      const timestampValue = date.tz(targetTimezone).valueOf();
      const displayTimestamp = timeUnit === 'seconds' 
        ? Math.floor(timestampValue / 1000) 
        : timestampValue;
      
      setTimestampOutput(displayTimestamp.toString());
    } catch (error) {
      setTimestampOutput('转换错误');
      console.log(error);
    }
  }, [dateTimeInput, timeUnit, targetTimezone]);

  // 设置当前时间
  const setCurrentTime = () => {
    const now = dayjs();
    setDateTimeInput(now.format('YYYY-MM-DD HH:mm:ss'));
    setTimestampInput(Math.floor(now.valueOf() / 1000).toString());
  };

  // 复制功能
  const handleCopy = (type: CopyType) => {
    let textToCopy = '';
    
    switch (type) {
      case 'timestamp':
        textToCopy = timestampOutput;
        break;
      case 'date':
        textToCopy = dateTimeOutput;
        break;
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
    }
  };

  // 清除所有输入
  const handleClear = () => {
    setTimestampInput('');
    setDateTimeInput('');
    setTimestampOutput('');
    setDateTimeOutput('');
  };

  // 主题样式
  const inputClass = `w-full px-3 py-2 rounded border transition-colors ${
    darkMode 
      ? 'bg-gray-800 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
      : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
  }`;
  
  const labelClass = `block text-sm font-medium mb-1 ${
    darkMode ? 'text-gray-300' : 'text-gray-700'
  }`;
  
  const containerClass = `rounded-xl p-6 transition-colors ${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'
  } border`;
  
  const cardClass = `p-4 rounded-lg transition-colors ${
    darkMode ? 'bg-gray-700' : 'bg-gray-50'
  }`;
  
  const sectionTitleClass = `text-lg font-semibold flex items-center mb-4 ${
    darkMode ? 'text-blue-400' : 'text-blue-600'
  }`;
  
  const buttonSecondaryClass = `flex items-center px-3 py-2 rounded transition ${
    darkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  }`;

  return (
    <div>
      {/* 顶部区域：时区设置和当前时间信息 */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* 当前时间信息 */}
        <div className={containerClass}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            当前时间信息
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardClass} flex items-center justify-between`}>
              <div>
                <div className="text-sm text-gray-500 mb-1">本地时间</div>
                <div className={`font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {dayjs().format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
            
            <div className={cardClass}>
              <div className="text-sm text-gray-500 mb-1">目标时区时间</div>
              <div className={`font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {dayjs().tz(targetTimezone).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            
              <div className={cardClass}>
                <div className="text-sm text-gray-500 mb-1">时间戳 (秒)</div>
                <div className={`font-mono ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {Math.floor(Date.now() / 1000)}
                </div>
              </div>
              
              <div className={cardClass}>
                <div className="text-sm text-gray-500 mb-1">时间戳 (毫秒)</div>
                <div className={`font-mono ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {Date.now()}
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* 输入和转换区域 */}
      <div className="grid grid-cols-1 gap-8">
        {/* 输入面板 */}
        <div className={containerClass}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              时间转换工具
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={setCurrentTime}
                className={`btn btn-primary text-sm`}
              >
                <FiRefreshCw className="mr-2" /> 当前时间
              </button>
              <button
                onClick={handleClear}
                className={`${buttonSecondaryClass} text-sm`}
              >
                清空
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* 时区选择 */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>目标时区</label>
                <select
                  value={targetTimezone}
                  onChange={(e) => setTargetTimezone(e.target.value)}
                  className={`${inputClass} w-full`}
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  所有日期时间将转换到此时区显示
                </p>
              </div>
            </div>
            {/* 时间戳输入区域 */}
            <div>
              <h3 className={sectionTitleClass}>
                <FiHash className="mr-2" /> 时间戳转日期
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <div>
                  <label className={labelClass}>时间戳值</label>
                  <input
                    type="text"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    className={`${inputClass} font-mono`}
                    placeholder="输入时间戳"
                  />
                </div>
                
                <div>
                  <label className={labelClass}>时间单位</label>
                  <div className="flex">
                    <button
                      onClick={() => setTimeUnit('seconds')}
                      className={`px-4 py-2 rounded-l border ${
                        timeUnit === 'seconds'
                          ? darkMode
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-500 text-white border-blue-500'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 border-gray-600'
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      秒
                    </button>
                    <button
                      onClick={() => setTimeUnit('milliseconds')}
                      className={`px-4 py-2 rounded-r border ${
                        timeUnit === 'milliseconds'
                          ? darkMode
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-500 text-white border-blue-500'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 border-gray-600'
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      毫秒
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className={labelClass}>转换结果</label>
                <div className={`${cardClass} flex items-center justify-between`}>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">目标时区: {targetTimezone}</div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {dateTimeOutput || '输入时间戳后将显示日期时间'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('date')}
                    className={`p-2 rounded ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    disabled={!dateTimeOutput}
                    title="复制日期时间"
                  >
                    {copied.date ? <FiCheck className="text-green-500" /> : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>

            {/* 日期时间输入区域 */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  <FiCalendar className="mr-2" /> 日期转时间戳
                </h3>
                <button 
                  onClick={() => setDateFormatHelp(!dateFormatHelp)}
                  className="text-sm flex items-center text-blue-500"
                >
                  <FiInfo className="mr-1" /> 格式说明
                </button>
              </div>
              
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="text"
                  value={dateTimeInput}
                  onChange={(e) => setDateTimeInput(e.target.value)}
                  className={`${inputClass} font-mono`}
                  placeholder="输入日期时间 (如: 2023-10-15 14:30:00)"
                />
                <button
                  onClick={() => dateInputRef.current?.focus()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500"
                  title="输入日期时间"
                >
                  <FiCalendar />
                </button>
              </div>
              
              {dateFormatHelp && (
                <div className={`mt-2 p-3 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-100'
                }`}>
                  <p className="font-medium mb-1">支持格式:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>YYYY-MM-DD HH:mm:ss (2023-10-15 14:30:00)</li>
                    <li>YYYY/MM/DD HH:mm:ss (2023/10/15 14:30:00)</li>
                    <li>YYYY.MM.DD HH:mm:ss (2023.10.15 14:30:00)</li>
                    <li>YYYY-MM-DD HH:mm (2023-10-15 14:30)</li>
                    <li>YYYY-MM-DD HH:mm:ss.SSS (2023-10-15 14:30:00.123)</li>
                  </ul>
                </div>
              )}
              
              <div className="mt-4">
                <label className={labelClass}>转换结果</label>
                <div className={`${cardClass} flex items-center justify-between`}>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {timeUnit === 'seconds' ? '秒时间戳' : '毫秒时间戳'}
                    </div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {timestampOutput || '输入日期时间后将显示时间戳'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('timestamp')}
                    className={`p-2 rounded ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    disabled={!timestampOutput}
                    title="复制时间戳"
                  >
                    {copied.timestamp ? <FiCheck className="text-green-500" /> : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 常用Cron表达式 */}
        <div className={containerClass}>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            常用Cron表达式参考
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="p-3 text-left">表达式</th>
                  <th className="p-3 text-left">描述</th>
                </tr>
              </thead>
              <tbody>
                {cronExamples.map((cron, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 
                      ? (darkMode ? 'bg-gray-800' : 'bg-white') 
                      : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}
                  >
                    <td className="p-3 font-mono border-b border-gray-200 dark:border-gray-700">
                      {cron.expression}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                      {cron.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={`mt-4 p-4 rounded-lg ${
            darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-100'
          }`}>
            <h4 className="font-medium mb-2">Cron表达式说明</h4>
            <p className="text-sm mb-2">
              Cron表达式用于定时任务调度，格式为: <code className="font-mono">秒 分 时 日 月 周</code>
            </p>
            <p className="text-sm">
              字段说明：秒(0-59) 分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-6, 0为周日)
            </p>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'} border`}>
        <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-blue-800'}`}>使用说明</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className={darkMode ? 'text-gray-300' : 'text-blue-700'}>
            <span className="font-medium">时间戳转日期：</span>在时间戳输入框中输入时间戳（支持秒或毫秒），结果将显示在下方（目标时区）
          </li>
          <li className={darkMode ? 'text-gray-300' : 'text-blue-700'}>
            <span className="font-medium">日期转时间戳：</span>在日期时间输入框中输入日期（支持多种格式），结果将显示在下方
          </li>
          <li className={darkMode ? 'text-gray-300' : 'text-blue-700'}>
            <span className="font-medium">时区转换：</span>选择目标时区，所有日期时间结果会自动转换为目标时区的时间
          </li>
          <li className={darkMode ? 'text-gray-300' : 'text-blue-700'}>
            <span className="font-medium">一键功能：</span>
            <ul className="list-circle pl-5 mt-1 space-y-1">
              <li><FiRefreshCw className="inline mr-1" /> 设置当前时间</li>
              <li><FiCopy className="inline mr-1" /> 复制转换结果</li>
              <li>清空所有输入</li>
              <li><FiInfo className="inline mr-1" /> 查看日期格式说明</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}