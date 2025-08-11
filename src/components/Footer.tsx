'use client';

import { useAppContext } from '@/context/AppContext';
import { FiTool, FiChevronRight, FiMail, FiHelpCircle } from 'react-icons/fi';


const Footer = () => {
  const { darkMode } = useAppContext();
  return (
      <footer className={`footer ${darkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <FiTool />
                </div>
                <h3>万能工具箱</h3>
              </div>
              <p>提供最全面、最便捷的在线工具集合，满足您的各种需求。</p>
              <div className="social-links">
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 16.163h-2.134v3.644h-2.775v-3.644h-1.083V13.5h1.083v-1.363c0-1.56.428-2.7 2.169-2.7h1.636v2.726h-1.02c-.318 0-.772.162-.772.84v1.02h1.771l-.231 2.663z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* <div className="footer-links">
              <h4>工具分类</h4>
              <ul>
                <li><a href="#"><FiChevronRight className="mr-2" /> 文本工具</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 图片工具</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 加密工具</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 开发工具</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>帮助中心</h4>
              <ul>
                <li><a href="#"><FiChevronRight className="mr-2" /> 使用教程</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 常见问题</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 意见反馈</a></li>
                <li><a href="#"><FiChevronRight className="mr-2" /> 联系我们</a></li>
              </ul>
            </div> */}
            
            {/* <div className="footer-contact">
              <h4>联系方式</h4>
              <ul>
                <li>
                  <FiMail className="mr-3" />
                  <span>contact@toolbox.com</span>
                </li>
                <li>
                  <FiHelpCircle className="mr-3" />
                  <span>support@toolbox.com</span>
                </li>
                <li className="newsletter">
                  <p>订阅我们的产品更新</p>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="您的邮箱" 
                    />
                    <button className="btn btn-primary">
                      订阅
                    </button>
                  </div>
                </li>
              </ul>
            </div> */}
          </div>
          
          <div className="copyright">
            <p>&copy; 2023 万能工具箱 - 您的在线工具集合 | 本网站仅供学习交流使用</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;