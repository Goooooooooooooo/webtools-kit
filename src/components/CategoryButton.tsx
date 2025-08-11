import { motion } from 'framer-motion';
import { ToolCategory } from '@/types';

interface CategoryButtonProps {
  category: ToolCategory;
  darkMode?: boolean;
  active: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, darkMode, active, onClick }) => {
  return (
    <motion.button
      key={category.id}
      className={`category-btn ${category.color} ${active ? 'active' : ''}
        ${darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100' 
            : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span>{category.icon}</span>
      {category.name}
    </motion.button>
  );
};

export default CategoryButton;