
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ProductFeature = ({ icon, title, description, index }: ProductFeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300",
        index % 2 === 0 ? "lg:translate-y-4" : ""
      )}
    >
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 p-3 rounded-lg mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default ProductFeature;
