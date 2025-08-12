'use client';

import { useAppContext } from '@/context/AppContext';
import React, { useState, useMemo } from 'react';

type ConversionCategory = 'length' | 'weight' | 'volume' | 'temperature';

const unitsMap = {
  length: [
    { label: '米 (m)', value: 'm', factor: 1 },
    { label: '厘米 (cm)', value: 'cm', factor: 0.01 },
    { label: '毫米 (mm)', value: 'mm', factor: 0.001 },
    { label: '公里 (km)', value: 'km', factor: 1000 },
    { label: '英寸 (in)', value: 'in', factor: 0.0254 },
    { label: '英尺 (ft)', value: 'ft', factor: 0.3048 },
    { label: '码 (yd)', value: 'yd', factor: 0.9144 },
    { label: '英里 (mi)', value: 'mi', factor: 1609.344 },
  ],
  weight: [
    { label: '千克 (kg)', value: 'kg', factor: 1 },
    { label: '克 (g)', value: 'g', factor: 0.001 },
    { label: '毫克 (mg)', value: 'mg', factor: 0.000001 },
    { label: '吨 (t)', value: 't', factor: 1000 },
    { label: '磅 (lb)', value: 'lb', factor: 0.45359237 },
    { label: '盎司 (oz)', value: 'oz', factor: 0.02834952 },
  ],
  volume: [
    { label: '升 (L)', value: 'L', factor: 1 },
    { label: '毫升 (mL)', value: 'mL', factor: 0.001 },
    { label: '立方米 (m³)', value: 'm3', factor: 1000 },
    { label: '立方厘米 (cm³)', value: 'cm3', factor: 0.001 },
    { label: '加仑 (gal)', value: 'gal', factor: 3.78541 },
    { label: '品脱 (pt)', value: 'pt', factor: 0.473176 },
    { label: '夸脱 (qt)', value: 'qt', factor: 0.946353 },
  ],
  temperature: [
    { label: '摄氏度 (°C)', value: 'c' },
    { label: '华氏度 (°F)', value: 'f' },
    { label: '开尔文 (K)', value: 'k' },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>(unitsMap.length[0].value);
  const { darkMode } = useAppContext();

  // 根据选择类别，动态切换“从单位”，并重置选择
  React.useEffect(() => {
    setFromUnit(unitsMap[category][0].value);
    setInputValue('1');
  }, [category]);

  // 计算所有目标单位的换算结果，除了当前选择的fromUnit
  const results = useMemo(() => {
  // 温度转换函数
  function convertTemperature(value: number, from: string, to: string): number {
      if (from === to) return value;

      let celsius: number;
      switch (from) {
      case 'c':
          celsius = value;
          break;
      case 'f':
          celsius = (value - 32) * (5 / 9);
          break;
      case 'k':
          celsius = value - 273.15;
          break;
      default:
          celsius = value;
      }

      switch (to) {
      case 'c':
          return celsius;
      case 'f':
          return celsius * (9 / 5) + 32;
      case 'k':
          return celsius + 273.15;
      default:
          return celsius;
      }
  }

  // 通用单位换算函数
  function convertValue(value: number, from: string, to: string, category: ConversionCategory): number {
      if (category === 'temperature') {
      return convertTemperature(value, from, to);
      }

      const units = unitsMap[category];
      const fromUnitObj = units.find((u) => u.value === from);
      const toUnitObj = units.find((u) => u.value === to);
      if (!fromUnitObj || !toUnitObj) return NaN;

      const baseValue = value * fromUnitObj.factor;
      return baseValue / toUnitObj.factor;
  }

  const val = parseFloat(inputValue);
  if (isNaN(val)) return [];

  return unitsMap[category]
      .filter((u) => u.value !== fromUnit)
      .map((unit) => ({
      label: unit.label,
      value: convertValue(val, fromUnit, unit.value, category),
      }));
  }, [category, inputValue, fromUnit]);

  return (
    <main className={`container max-w-4xl mx-auto p-4`}>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block mb-1 font-medium">换算类别</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value as ConversionCategory)}
          >
            <option value="length">长度</option>
            <option value="weight">重量</option>
            <option value="volume">体积</option>
            <option value="temperature">温度</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">输入数值</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">当前单位</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {unitsMap[category].map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">换算结果</h2>
        {results.length === 0 && <p className="text-gray-500">请输入有效数字</p>}

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {results.map(({ label, value }) => (
            <li
              key={label}
              className={`border rounded p-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow text-center break-words`}
            >
              <div className="text-lg font-semibold">{value.toFixed(4)}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}