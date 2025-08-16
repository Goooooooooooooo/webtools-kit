import { FiTool, FiFileText, FiImage, FiLock, FiCode, 
  FiPlusSquare, FiGlobe, FiCompass, FiGrid, FiFile, 
  FiSliders, FiDollarSign, FiAperture,
  FiRefreshCw
} from 'react-icons/fi';
import { Tool, ToolCategory } from "@/types";
import ColorConverter from '@/components/tools/ColorConverter';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import JsonFormatter from '@/components/tools/JsonFormatter';
import SqlFormatter from '@/components/tools/SqlFormatter';
import QrCodeGenerater from '@/components/tools/QrCodeGenerater';
import UnitConverter from '@/components/tools/UnitConverter';
import DateTimeConverter from '@/components/tools/DateTimeConverter';
import TestDataGenerator from '@/components/tools/TestDataGenerator';

// 工具分类
export const categories: ToolCategory[] = [
    {
      id: 'all', 
      name: '全部工具', 
      icon: <FiTool />, 
      color: 'from-indigo-500 to-purple-500',
    },
    { 
      id: 'text', 
      name: '文本工具', 
      icon: <FiFileText />, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      id: 'image', 
      name: '图片工具', 
      icon: <FiImage />, 
      color: 'from-pink-500 to-rose-500' 
    },
    { 
      id: 'security', 
      name: '加密工具', 
      icon: <FiLock />, 
      color: 'from-amber-500 to-orange-500' 
    },
    { 
      id: 'dev', 
      name: '开发工具', 
      icon: <FiCode />, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      id: 'calc', 
      name: '计算工具', 
      icon: <FiPlusSquare />, 
      color: 'from-violet-500 to-fuchsia-500' 
    },
    { 
      id: 'network', 
      name: '网络工具', 
      icon: <FiGlobe />, 
      color: 'from-sky-500 to-blue-500' 
    },
  ];

// 工具数据
export const tools : Tool[] = [
  { 
    id: "1", 
    name: '图片压缩工具', 
    description: '高质量压缩JPG、PNG、GIF图片，保持清晰度的同时大幅减小文件体积',
    category: 'image',
    icon: <FiCompass />,
    stats: { usage: '1,245次', favorites: '8,742次' },
    popular: true
  },
  { 
    id: "2", 
    name: '二维码生成器', 
    description: '快速生成个性化二维码，支持URL、文本、联系方式等多种内容格式',
    category: 'text',
    icon: <FiGrid />,
    stats: { usage: '986次', favorites: '7,312次' },
    popular: true,
    // 使用QrCodeGenerator组件
    component: QrCodeGenerater
  },
  { 
    id: "3", 
    name: 'PDF转换工具', 
    description: '支持PDF与Word、Excel、PPT、JPG等格式间的相互转换',
    category: 'text',
    icon: <FiFile />,
    stats: { usage: '2,134次', favorites: '12,645次' },
    popular: true
  },
  { 
    id: "4", 
    name: 'JSON格式化', 
    description: '美化、压缩和验证JSON数据，支持多种视图模式',
    category: 'dev',
    icon: <FiRefreshCw />,
    stats: { usage: '1,876次', favorites: '5,432次' },
    popular: true,
    // 使用JsonFormatter组件
    component: JsonFormatter
  },
  { 
    id: "11", 
    name: 'SQL格式化', 
    description: '美化、压缩和验证SQL语句，支持多种数据库类型',
    category: 'dev',
    icon: <FiRefreshCw />,
    stats: { usage: '1,876次', favorites: '5,432次' },
    popular: true,
    // 使用SqlFormatter组件
    component: SqlFormatter
  },
  { 
    id: "5", 
    name: '加密解密工具', 
    description: '支持MD5、SHA、AES、RSA等多种加密解密算法',
    category: 'security',
    icon: <FiLock />,
    stats: { usage: '845次', favorites: '3,215次' }
  },
  { 
    id: "6", 
    name: '单位换算器', 
    description: '长度、重量、体积、温度等多种单位之间的快速换算',
    category: 'calc',
    icon: <FiSliders />,
    stats: { usage: '1,532次', favorites: '4,789次' },
    // 使用UnitConverter组件
    component: UnitConverter
  },
  { 
    id: "12", 
    name: 'Unix 时间戳转换', 
    description: 'Unix时间戳与日期互转、Cron表达式示例',
    category: 'dev',
    icon: <FiSliders />,
    stats: { usage: '1,532次', favorites: '4,789次' },
    // 使用DateTimeConverter组件
    component: DateTimeConverter
  },
    { 
    id: "13", 
    name: '测试数据生成器', 
    description: '快速生成测试数据，支持自定义字段类型和数量',
    category: 'dev',
    icon: <FiSliders />,
    stats: { usage: '1,532次', favorites: '4,789次' },
    // 使用TestDataGenerator组件
    component: TestDataGenerator
  },
  { 
    id: "7", 
    name: 'IP地址查询', 
    description: '查询IP地址的地理位置、ISP提供商等信息',
    category: 'network',
    icon: <FiGlobe />,
    stats: { usage: '2,345次', favorites: '6,789次' }
  },
  { 
    id: "8", 
    name: '货币汇率转换', 
    description: '实时转换全球160+种货币汇率',
    category: 'calc',
    icon: <FiDollarSign />,
    stats: { usage: '1,234次', favorites: '4,321次' }
  },
  {
    id: "9",
    name: "颜色转换器",
    description: "将颜色从一种格式转换为另一种格式（如HEX到RGB）",
    category: "calc",
    icon: <FiAperture />,
    stats: { usage: '1,234次', favorites: '4,321次' },
    popular: true,
    // 使用ColorConverter组件
    component: ColorConverter
  },
  {
    id: "10",
    name: "密码生成器",
    description: "快速生成安全密码, 自定义规则, 支持自定义长度和字符集",
    category: "security",
    icon: <FiLock />,
    stats: { usage: '1,234次', favorites: '4,321次' },
    popular: true,
    // 使用PasswordGenerator组件
    component: PasswordGenerator
  },
];