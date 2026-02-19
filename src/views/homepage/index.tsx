"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import SectionDivider from "@/components/SectionDivider";
import { useTRPC } from "@/server/client";
import ArticleSlider from "@/views/homepage/ArticleSlider";
import HeroSection from "@/views/homepage/HeroSection";
import PartnerScroller from "@/views/homepage/PartnerScroll";
import TopProductsSection from "@/views/homepage/TopProductsSection";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const HomePage = () => {
  const trpc = useTRPC();
  const { data: products } = useQuery(
    trpc.product.getAll.queryOptions({ isHomePage: true }),
  );
  const { data: articles } = useQuery(
    trpc.article.getAll.queryOptions({ includeInactive: false }),
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero + scroll - fill viewport, scroll indicator at bottom */}
      <div className="min-h-screen flex flex-col bg-[#1a1f2e]">
        <header className="relative flex-1 flex flex-col">
          <Navbar />
          <HeroSection />
        </header>
      </div>

      {/* Products - lighter blue section with gold accent strip */}
      <TopProductsSection products={products || []} />

      {/* Partners - from about page */}
      <section className="py-20 bg-[var(--color-background-darker)] border-y border-[var(--accent)]/30 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-80 pointer-events-none" />
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
            <p className="text-[var(--color-text-muted)]">
              Top Minecraft content creators who trust our products
            </p>
          </motion.div>
          <PartnerScroller />
        </div>
      </section>

      {/* Wavy divider into Articles */}
      {articles && articles.length > 0 && (
        <>
          <SectionDivider variant="wave" nextColor="#0a1e35" />
          <ArticleSlider articles={articles} products={products || []} />
        </>
      )}

      {/* Fade divider into footer - darkest to anchor page */}
      <SectionDivider variant="fade" nextColor="#0a1e35" />

      <Footer />
    </div>
  );
};

export default HomePage;
