import React from 'react'
import { motion } from "motion/react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

function ProductGrid({ products }) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px", amount: 0.2 }}
    >
      {products.map(product => (
        <motion.div
          key={product.id}
          className="rounded-lg border p-4 shadow-sm"
          variants={cardVariants}
        >
          <img src={product.image} alt={product.name} className="w-full rounded" />
          <h3 className="mt-2 font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid
