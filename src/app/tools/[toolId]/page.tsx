'use client';

import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { categories, tools } from '@/data/tools';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import React from 'react';
import Link from 'next/link';

interface ToolPageProps {
  params: Promise<{ toolId: string }>; // 使用 Promise 来处理异步参数
}

export default function ToolPage({ params }: ToolPageProps) {
  const { darkMode } = useAppContext();
  const { toolId } = React.use(params); // 解包 params
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) {
    return notFound();
  }

  // 直接渲染工具组件
  const ToolComponent = tool.component;
  if (!ToolComponent) {
    return notFound();
  }
  const category = categories.find(c => c.id === tool.category);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-4 rounded-xl text-5xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {tool.icon}
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-1 tool-title ${darkMode ? 'dark' : ''}`}>{tool.name}</h1>
              <p className={`tool-desc ${darkMode ? 'dark' : ''}`}>{tool.description}</p>
              <div className="mt-2">
                <Link href={{
                    pathname: '/',
                    query: { tab: category?.id },
                    hash: 'all-tool',
                  }} className={`text-sm px-3 py-1 w-20 category-btn ${category?.color} active`}>
                  {category ? category.name : '未分类'}
                </Link>
              </div>
            </div>
          </div>
          
          <div className={`tool-card compact rounded-xl p-6 md:p-8 ${darkMode ? 'dark' : ''}`}>
            {ToolComponent && <ToolComponent />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}