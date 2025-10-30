import React from "react";
import { motion } from "framer-motion";

const SubmenuPage = ({ title, value, icon }) => {
  return (
    <motion.div
      className="p-4 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex justify-between items-center">

        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-2xl font-bold">{value}</p>
        </div>

        <div className="text-4xl">{icon}</div>
        
      </div>
    </motion.div>
  );
};

export default SubmenuPage;
