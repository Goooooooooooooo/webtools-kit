'use client';

import { motion } from 'framer-motion';
import { FiChevronRight, FiZap } from 'react-icons/fi';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  className?: string;
  darkMode?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, className = '', darkMode = false }) => {
  return (
    <motion.div
      key={tool.id}
      className={`tool-card compact 
          ${darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-indigo-500/50' 
          : 'bg-white border-gray-200 hover:border-indigo-400/50'} ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tool-header">
        <div className={`tool-icon ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {tool.icon}
        </div>
        <div>
          <h3 className={`text-lg font-semibold mb-1 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>{tool.name}</h3>
          <p className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{tool.description}</p>
        </div>
      </div>
      
      <div className={`tool-footer ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <span><FiZap className={`mr-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} /> {tool.stats.usage}</span>
        <button className="btn btn-primary compact">
          使用 <FiChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default ToolCard;