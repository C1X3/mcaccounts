import ProductCard from "@/components/ProductCard";
import { ProductGetAllOutput } from "@/server/routes/_app";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

const TopProductsSection = ({
  products,
}: {
  products: ProductGetAllOutput;
}) => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-[var(--background)]">
      {/* Dot grid background - fades in at top */}
      <div
        className="absolute inset-0 dot-pattern opacity-50 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%)",
        }}
      />

      <div className="container mx-auto px-6 pt-16 md:pt-20 pb-24 relative z-10">
        {/* Header - asymmetric: badge left, title centered */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center text-center">
            <span className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#0f2744] mb-6"
              style={{
                background: "linear-gradient(135deg, #89CFF0 0%, #ADD8E6 100%)",
                boxShadow: "0 4px 14px rgba(137,207,240,0.4)",
              }}
            >
              Customers&apos; Favorites
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text-baby-blue">
              Products
            </h2>
            <p className="text-[#ADD8E6] max-w-xl mx-auto text-lg">
              Exclusive in-game items curated for top Minecraft players
            </p>
          </div>
        </motion.div>

        {/* Product Grid - staggered layout on large screens */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              className={i === 1 && products.length >= 3 ? "lg:mt-8" : ""}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push("/shop")}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(137,207,240,0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-8 py-4 bg-[#89CFF0] hover:bg-[#7ec8e3] text-[#0f2744] font-bold rounded-xl shadow-lg transition-all"
          >
            Explore All Products
            <FaChevronRight className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TopProductsSection;
