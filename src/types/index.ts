// 工具分类类型
export interface ToolCategory {
  id: string; // 分类唯一标识符
  name: string; // 分类名称
  icon: React.ReactNode; // 分类图标
  color: string;  // 用于分类的颜色渐变
}

// 工具组件映射类型
export interface ToolComponents {
  [key: string]: React.ComponentType;
}

// 工具类型
export interface Tool {
  id: string; // 工具唯一标识符
  name: string; // 工具名称
  description: string; // 工具描述
  category: string; // 工具分类ID
  icon: React.ReactNode; // 工具图标
  stats: { // 工具使用统计
    usage: string;
    favorites: string;
  };
  popular?: boolean; // 是否为热门工具
  component?: React.ComponentType; // 可选的组件属性，用于直接渲染工具组件
}

// 特性类型
export interface Feature {
  id: number; // 特性唯一标识符
  title: string; // 特性标题
  description: string; // 特性描述
  icon: React.ReactNode; // 特性图标
}