"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import AboutHeroSection from "@/views/about/AboutHeroSection";
import VideosCarousel from "@/views/about/VideosCarousel";
import VouchesCarousel from "@/views/about/VouchesCarousel";
import ArticleSlider from "@/views/homepage/ArticleSlider";
import PartnerScroller from "@/views/homepage/PartnerScroll";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";

import { useTRPC } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

const AboutPage = () => {
  const trpc = useTRPC();
  const { data: products } = useQuery(
    trpc.product.getAll.queryOptions({ isHomePage: true }),
  );
  const { data: articles } = useQuery(
    trpc.article.getAll.queryOptions({ includeInactive: false }),
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero + Videos + Vouches — with grid texture */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[color-mix(in_srgb,var(--background),#000_5%)]">
        <div className="absolute inset-0 hex-dots-pattern opacity-80 pointer-events-none" />
        <AboutHeroSection />
        <VideosCarousel />
        <VouchesCarousel />
      </div>

      {/* Articles slider */}
      {articles && articles.length > 0 && (
        <ArticleSlider articles={articles} products={products || []} hideProduct />
      )}

      {/* Partners */}
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

      {/* FAQ */}
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <FAQSection showTitle={true} showContactButtons={true} />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;