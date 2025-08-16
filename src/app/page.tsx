// app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

// 在 globals.css 中定义这些样式
import '@/app/globals.css';
import Footer from '@/components/Footer';
import CategoryButton from '@/components/CategoryButton';
import ToolCard from '@/components/ToolCard';
import { categories, tools } from '@/data/tools';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';


export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useAppContext();

  const searchParams = useSearchParams();
  let tab = searchParams.get('tab');
  tab = typeof tab === 'string' ? tab : 'all'; // Query 参数
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';

  // 过滤工具
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 滚动到指定元素
  useEffect(() => {
    if (hash) {
      console.log(hash);
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  // 使用 useMemo 优化性能
  useMemo(() => {
    console.log(tab);
    // 如果 tab 存在且是有效的分类 ID，则设置为 activeCategory
    // 否则默认设置为 'all'
    console.log(categories.some(c => c.id === tab));
    if (tab && categories.some(c => c.id === tab)) {
      setActiveCategory(tab);
    } else {
      setActiveCategory('all');
    }
  }, [tab]);

  // 热门工具
  // const popularTools = tools.filter(tool => tool.popular);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* 导航栏 */}
      <Header />

      {/* 英雄区域 */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            一站式解决您的所有
            <span> 工具需求</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            免费在线工具，无需下载，无需注册，即开即用
          </motion.p>
          
          <motion.div 
            className="search-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input className={`${darkMode ? 'dark' : ''}`}
              type="text"
              placeholder="搜索您需要的工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FiSearch />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 热门工具 */}
      {/* <section className="popular-tools">
        <div className="container">
          <div className="section-header">
            <h2><FiStar className="mr-2" />热门工具推荐</h2>
            <div className="divider"></div>
          </div>
          
          <div className="tools-grid">
            {popularTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={`tool-card ${tool.popular ? 'popular' : ''} ${darkMode ? 'dark' : ''}`}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="tool-header">
                  <div className={`tool-icon ${darkMode ? 'dark' : ''}`}>
                    {tool.icon}
                  </div>
                  <h3 className={`${darkMode ? 'dark' : ''}`}>{tool.name}</h3>
                </div>
                <p className={`${darkMode ? 'dark' : ''}`}>{tool.description}</p>
                
                <div className="tool-stats">
                  <span><FiZap /> {tool.stats.usage}</span>
                  <span><FiGift /> {tool.stats.favorites}</span>
                </div>
                <button className="btn btn-primary">
                  立即使用 <FiChevronRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 工具分类 */}
      <section id='all-tool' className={`tool-categories ${darkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>工具分类</h2>
            <div className="divider"></div>
          </div>
          
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                darkMode={darkMode}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)} 
              />
            ))}
          </div>
          
          {/* 工具网格 */}
          <div className="tools-grid compact">
            {filteredTools.map((tool) => (
              <div key={tool.id}>
                <Link 
                  href={`/tools/${tool.id}`} // 这里是跳转的核心
                  className="group block h-full"
                >
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    darkMode={darkMode}
                    className='h-full'
                  /> 
                </Link>
              </div>
            ))}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="no-results">
              <div className="icon">🔍</div>
              <h3>没有找到匹配的工具</h3>
              <p>尝试使用其他关键词搜索</p>
            </div>
          )}
        </div>
      </section>

      {/* 特色优势 */}
      {/* <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>我们的优势</h2>
            <div className="divider"></div>
          </div>
          
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">
                <FiZap />
              </div>
              <h3>快速高效</h3>
              <p>所有工具在云端处理，无需下载安装，打开即用，节省您宝贵时间</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>安全可靠</h3>
              <p>所有数据处理均在浏览器端完成，您的文件不会上传至服务器</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="feature-icon">
                <FiGift />
              </div>
              <h3>完全免费</h3>
              <p>所有工具永久免费使用，无隐藏收费，无会员限制</p>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* 页脚 */}
      <Footer />
    </div>
  );
}