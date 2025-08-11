import { motion } from 'framer-motion';
import { Feature } from '@/types';

interface FeatureCardProps {
  feature: Feature;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, delay = 0 }) => {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-md p-8 rounded-xl border border-gray-700 shadow-xl"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  );
};

export default FeatureCard;