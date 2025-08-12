'use client';

import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiTool, FiHome, FiStar, FiHeart, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';


const Header = () => {
  const { darkMode, toggleTheme, mobileMenuOpen, setMobileMenuOpen } = useAppContext();

  return (
    <div>
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="container">
          <div className="logo">
          <div className="logo-icon">
              <FiTool />
          </div>
          <h1>ToolBox Pro</h1>
          </div>
          
          {/* 桌面导航 */}
          <div className="desktop-nav">
          <Link href="/"><FiHome className="mr-1" /> 首页</Link>
          <Link href="/#all-tool"><FiTool className="mr-1" /> 所有工具</Link>
          <a href="/404"><FiStar className="mr-1" /> 热门工具</a>
          <a href="/404"><FiHeart className="mr-1" /> 收藏</a>
          </div>
          
          <div className="nav-actions">
          <button 
              onClick={toggleTheme}
              className="theme-toggle"
          >
              {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          
          {/* <button className="btn btn-secondary">
              <FiUser className="mr-2" /> 登录
          </button> */}
          
          {/* 移动端菜单按钮 */}
          <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
          >
              <FiMenu />
          </button>
          </div>
      </div>
    </nav>
    {mobileMenuOpen && (
      <motion.div 
          className={`mobile-menu ${darkMode ? 'dark' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
      >
          <div className="mobile-menu-header">
          <button 
              className="close-btn"
              onClick={() => setMobileMenuOpen(false)}
          >
              <FiX />
          </button>
          </div>
          
          <div className="mobile-menu-content">
          <Link href="/" className={`text-xl flex items-center py-3 ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
              }`} onClick={() => setMobileMenuOpen(false)}>
              <FiHome className="mr-3" /> 首页
          </Link>
          <Link href="/#all-tool" className={`text-xl flex items-center py-3 ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
              }`} onClick={() => setMobileMenuOpen(false)}>
              <FiTool className="mr-3" /> 所有工具
          </Link>
          <a href="#" className={`text-xl flex items-center py-3 ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
              }`} onClick={() => setMobileMenuOpen(false)}>
              <FiStar className="mr-3" /> 热门工具
          </a>
          <a href="#" className={`text-xl flex items-center py-3 ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
              }`} onClick={() => setMobileMenuOpen(false)}>
              <FiHeart className="mr-3" /> 收藏
          </a>
          {/* <button className="btn btn-primary">
              <FiUser className="mr-2" /> 登录/注册
          </button> */}
          
          <button 
              onClick={toggleTheme}
              className="theme-toggle-full"
          >
              {darkMode ? (
              <>
                  <FiSun className="mr-2" /> 切换到亮色模式
              </>
              ) : (
              <>
                  <FiMoon className="mr-2" /> 切换到暗色模式
              </>
              )}
          </button>
          </div>
      </motion.div>
      )}
  </div>
  );
};

export default Header;