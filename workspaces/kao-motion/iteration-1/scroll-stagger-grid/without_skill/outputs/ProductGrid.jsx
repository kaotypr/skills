import React from 'react'
import { motion } from 'motion/react'

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="rounded-lg border p-4 shadow-sm"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
            delay: index * 0.1,
          }}
        >
          <img src={product.image} alt={product.name} className="w-full rounded" />
          <h3 className="mt-2 font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default ProductGrid
