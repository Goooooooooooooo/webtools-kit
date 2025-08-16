'use client';

import { useAppContext } from '@/context/AppContext';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';

// 数据类型定义
type DataType = 'custom' | 'users' | 'products' | 'transactions' | 'addresses' | 'companies';
type FormatType = 'json' | 'csv' | 'xml';
type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone' | 'name' | 'id' | 'url' | 'color' | 'address';

// 字段配置接口
interface FieldConfig {
  id: string;
  name: string;
  type: FieldType;
  min?: number;
  max?: number;
}

// 中日简化行政区划（示例）
const addressData = {
  CN: [
    { province: '北京市', city: '北京市', district: '东城区', streets: ['东华门大街', '王府井大街'] },
    { province: '北京市', city: '北京市', district: '西城区', streets: ['西直门外大街', '金融大街'] },
    { province: '广东省', city: '广州市', district: '天河区', streets: ['天河北路', '体育西路'] },
    { province: '广东省', city: '深圳市', district: '南山区', streets: ['科技南十二路', '深南大道'] },
    // 可扩展更多省市区
  ],
  JP: [
    { prefecture: '東京都', city: '新宿区', district: '西新宿', streets: ['西新宿通り', '歌舞伎町通り'] },
    { prefecture: '東京都', city: '渋谷区', district: '道玄坂', streets: ['道玄坂通り', '宇田川町'] },
    { prefecture: '大阪府', city: '大阪市北区', district: '梅田', streets: ['曽根崎通', '芝田町'] },
    // 可扩展更多都道府县
  ]
};

// 预定义配置
const predefinedConfigs: Record<DataType, { fields: FieldConfig[] }> = {
  users: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'name', type: 'name' },
      { id: '3', name: 'email', type: 'email' },
      { id: '4', name: 'age', type: 'number', min: 18, max: 80 },
      { id: '5', name: 'registeredAt', type: 'date' },
    ]
  },
  products: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'name', type: 'string' },
      { id: '3', name: 'category', type: 'string' },
      { id: '4', name: 'price', type: 'number', min: 10, max: 500 },
      { id: '5', name: 'stock', type: 'number', min: 0, max: 100 },
    ]
  },
  transactions: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'amount', type: 'number', min: 1, max: 1000 },
      { id: '3', name: 'currency', type: 'string' },
      { id: '4', name: 'status', type: 'string' },
      { id: '5', name: 'date', type: 'date' },
    ]
  },
  addresses: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'country', type: 'string' },
      { id: '3', name: 'province', type: 'string' },
      { id: '4', name: 'city', type: 'string' },
      { id: '5', name: 'district', type: 'string' },
      { id: '6', name: 'street', type: 'string' },
    ]
  },
  companies: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'name', type: 'string' },
      { id: '3', name: 'industry', type: 'string' },
      { id: '4', name: 'employees', type: 'number', min: 10, max: 10000 },
      { id: '5', name: 'revenue', type: 'number', min: 100000, max: 10000000 },
    ]
  },
  custom: {
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'name', type: 'string' },
      { id: '3', name: 'value', type: 'number', min: 0, max: 100 },
    ]
  }
};

type FieldValue = string | number | boolean;

// 随机选择函数
const randomChoice = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// 模拟数据生成函数
const generateData = (count: number, fields: FieldConfig[], addressCountry?: 'CN' | 'JP') => {
  return Array.from({ length: count }, () => {
    const record: Record<string, FieldValue> = {};
    
    fields.forEach(field => {
      switch (field.type) {
        case 'string':
          record[field.name] = `文本_${Math.random().toString(36).substring(2, 8)}`;
          break;
        case 'number':
          const min = field.min || 0;
          const max = field.max || 100;
          record[field.name] = Math.floor(Math.random() * (max - min + 1)) + min;
          break;
        case 'boolean':
          record[field.name] = Math.random() > 0.5;
          break;
        case 'date':
          record[field.name] = new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            .toISOString().split('T')[0];
          break;
        case 'email':
          const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
          record[field.name] = `${Math.random().toString(36).substring(2, 8)}@${randomChoice(domains)}`;
          break;
        case 'phone':
          record[field.name] = `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
          break;
        case 'name':
          const firstNames = ['张', '王', '李', '赵', '刘'];
          const lastNames = ['明', '华', '强', '伟', '芳'];
          record[field.name] = `${randomChoice(firstNames)}${randomChoice(lastNames)}`;
          break;
        case 'id':
          record[field.name] = `ID_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          break;
        case 'url':
          record[field.name] = `https://${Math.random().toString(36).substring(2, 8)}.com`;
          break;
        case 'color':
          record[field.name] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
          break;
        case 'address':
          // if (!addressCountry) break;
          if (addressCountry === 'CN') {
            const addr = randomChoice(addressData.CN);
            record[field.name] = `${addr.province}${addr.city}${addr.district}${randomChoice(addr.streets)}`;
          } else if (addressCountry === 'JP') {
            const addr = randomChoice(addressData.JP);
            record[field.name] = `${addr.prefecture}${addr.city}${addr.district}${randomChoice(addr.streets)}`;
          } else {
            const addr = randomChoice(addressData.CN);
            record[field.name] = `${addr.province}${addr.city}${addr.district}${randomChoice(addr.streets)}`;
          }
          break;
        default:
          record[field.name] = '未知类型';
      }
    });
    
    return record;
  });
};

export default function TestDataGenerator() {
  const { darkMode } = useAppContext();
  const [dataType, setDataType] = useState<DataType>('users');
  const [dataCount, setDataCount] = useState<number>(10);
  const [outputFormat, setOutputFormat] = useState<FormatType>('json');
  const [generatedData, setGeneratedData] = useState<Record<string, FieldValue>[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [fieldConfig, setFieldConfig] = useState<FieldConfig[]>(predefinedConfigs.users.fields);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [addressCountry, setAddressCountry] = useState<'CN' | 'JP'>('CN');
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // 当数据类型变化时更新字段配置
  useEffect(() => {
    setFieldConfig([...predefinedConfigs[dataType].fields]);
    if (dataType === 'addresses') setAddressCountry('CN');
  }, [dataType]);

  // 生成数据
  const generateDataHandler = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const data = generateData(dataCount, fieldConfig, dataType === 'addresses' ? addressCountry : undefined);
      setGeneratedData(data);
      setIsGenerating(false);
    }, 300);
  };

  // 数据格式化
  const formatData = useMemo(() => {
    if (generatedData.length === 0) return '';
    switch (outputFormat) {
      case 'json':
        return JSON.stringify(generatedData, null, 2);
      case 'csv':
        const header = includeHeader ? Object.keys(generatedData[0]).join(',') + '\n' : '';
        const rows = generatedData.map(item =>
          Object.values(item).map(val =>
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
          ).join(',')
        ).join('\n');
        return header + rows;
      case 'xml':
        const items = generatedData.map(item => {
          const fields = Object.entries(item).map(([key, value]) =>
            `<${key}>${value}</${key}>`
          ).join('');
          return `<item>${fields}</item>`;
        }).join('');
        return `<?xml version="1.0" encoding="UTF-8"?>\n<data>${items}</data>`;
      default: return '';
    }
  }, [generatedData, outputFormat, includeHeader]);

  const downloadData = () => {
    if (!formatData || !downloadRef.current) return;
    const blob = new Blob([formatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadRef.current.href = url;
    downloadRef.current.download = `test-data-${dataType}-${Date.now()}.${outputFormat}`;
    downloadRef.current.click();
    URL.revokeObjectURL(url);
  };

  const addNewField = () => {
    const newField: FieldConfig = { id: Date.now().toString(), name: `字段_${fieldConfig.length + 1}`, type: 'string' };
    setFieldConfig([...fieldConfig, newField]);
    setActiveField(newField.id);
  };

  const removeField = (id: string) => {
    setFieldConfig(fieldConfig.filter(f => f.id !== id));
    if (activeField === id) setActiveField(fieldConfig.length > 1 ? fieldConfig[0].id : null);
  };

  const updateFieldConfig = (id: string, updates: Partial<FieldConfig>) => {
    setFieldConfig(fieldConfig.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const activeFieldData = fieldConfig.find(f => f.id === activeField);

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">数据配置</h2>
          <div className="mb-3">
            <label className="block mb-1">数据类型</label>
            <select value={dataType} onChange={e => setDataType(e.target.value as DataType)} className="w-full p-2 border rounded">
              <option value="users">用户</option>
              <option value="products">产品</option>
              <option value="transactions">交易</option>
              <option value="addresses">地址</option>
              <option value="companies">公司</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          {dataType === 'addresses' && (
            <div className="mb-3">
              <label className="block mb-1">国家</label>
              <select value={addressCountry} onChange={e => setAddressCountry(e.target.value as 'CN'|'JP')} className="w-full p-2 border rounded">
                <option value="CN">中国</option>
                <option value="JP">日本</option>
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="block mb-1">生成数量: {dataCount}</label>
            <input type="number" min={1} max={1000} value={dataCount} onChange={e => setDataCount(parseInt(e.target.value) || 1)} className="w-full p-2 border rounded"/>
          </div>

          <div className="flex gap-2 mb-3">
            <button onClick={generateDataHandler} className="btn btn-primary flex-1 p-2">{isGenerating ? '生成中...' : '生成数据'}</button>
            <button onClick={downloadData} className="flex-1 p-2 bg-green-500 text-white rounded" disabled={generatedData.length===0}>下载数据</button>
            <a ref={downloadRef} className="hidden"></a>
          </div>

          <div className="mb-3">
            <label className="block mb-1">输出格式</label>
            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value as FormatType)} className="w-full p-2 border rounded">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>
          {outputFormat==='csv' && (
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={includeHeader} onChange={e => setIncludeHeader(e.target.checked)}/>
              <span>包含表头</span>
            </div>
          )}
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4 flex justify-between items-center">字段配置 <button onClick={addNewField} className="px-2 py-1 bg-indigo-500 text-white rounded text-sm">添加字段</button></h2>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {fieldConfig.map(f => (
              <div key={f.id} className={`p-2 border rounded flex justify-between items-center cursor-pointer ${activeField===f.id?'bg-indigo-100':'bg-gray-100'}`} onClick={()=>setActiveField(f.id)}>
                <div>{f.name} ({f.type})</div>
                <button onClick={e=>{e.stopPropagation(); removeField(f.id)}} className="text-red-500"><FiTrash/></button>
              </div>
            ))}
          </div>

          {activeFieldData && (
            <div className="mt-3 border-t pt-3">
              <label className="block mb-1">字段名称</label>
              <input type="text" value={activeFieldData.name} onChange={e=>updateFieldConfig(activeFieldData.id,{name:e.target.value})} className="w-full p-2 border rounded mb-2"/>
              <label className="block mb-1">字段类型</label>
              <select value={activeFieldData.type} onChange={e=>updateFieldConfig(activeFieldData.id,{type:e.target.value as FieldType})} className="w-full p-2 border rounded mb-2">
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔</option>
                <option value="date">日期</option>
                <option value="email">邮箱</option>
                <option value="phone">电话</option>
                <option value="name">姓名</option>
                <option value="id">ID</option>
                <option value="url">URL</option>
                <option value="color">颜色</option>
                <option value="address">地址</option>
              </select>
              {(activeFieldData.type==='number') && (
                <div className="flex gap-2">
                  <input type="number" placeholder="最小值" value={activeFieldData.min||''} onChange={e=>updateFieldConfig(activeFieldData.id,{min:e.target.value?parseInt(e.target.value):undefined})} className="w-1/2 p-2 border rounded"/>
                  <input type="number" placeholder="最大值" value={activeFieldData.max||''} onChange={e=>updateFieldConfig(activeFieldData.id,{max:e.target.value?parseInt(e.target.value):undefined})} className="w-1/2 p-2 border rounded"/>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg ${darkMode?'bg-gray-800/50':'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">生成结果</h2>
        <textarea value={formatData} readOnly className="w-full h-[300px] p-2 border rounded font-mono text-sm" />
      </div>
    </div>
  );
}