import React from "react";
import { motion } from "framer-motion";
import "./FloatingImage.css";

const FloatingImage = ({ src, alt, id }) => {
  return (
    <motion.div
      className="floating-image"
      id={id}
      initial={{ opacity: 0, x: -50, y: -50, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        type: "spring",
        stiffness: 80,
      }}
    >
      <img src={src} alt={alt} />
    </motion.div>
  );
};

export default FloatingImage;
