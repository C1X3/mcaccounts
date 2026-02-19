"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { useTRPC } from "@/server/client";
import ArticleSlider from "@/views/homepage/ArticleSlider";
import HeroSection from "@/views/homepage/HeroSection";
import PartnerScroller from "@/views/homepage/PartnerScroll";
import TopProductsSection from "@/views/homepage/TopProductsSection";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";

const HomePage = () => {
  const trpc = useTRPC();
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const { data: products } = useQuery(
    trpc.product.getAll.queryOptions({ isHomePage: true }),
  );
  const { data: articles } = useQuery(
    trpc.article.getAll.queryOptions({ includeInactive: false }),
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 1. Header with clean, light design */}
      <header className="py-8 flex items-center justify-center relative flex-col">
        <Navbar />

        <HeroSection />
      </header>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 pt-4 pb-16 -mt-20"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Scroll for products
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 rounded-full bg-gray-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 3. Top Selling Products Section */}
      <TopProductsSection products={products || []} />

      {/* 4. Product Article Slider */}
      {articles && articles.length > 0 && (
        <ArticleSlider articles={articles} products={products || []} />
      )}

      {/* 2. YouTuber/Partner Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/subtle-pattern.jpg')] bg-cover bg-center opacity-10 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 60,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-2 text-[var(--foreground)]">
              <span className="gradient-text">Our Partners</span>
            </h3>
            <p className="text-gray-600">
              Top Minecraft content creators who trust our products
            </p>
          </motion.div>
          <PartnerScroller />
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
