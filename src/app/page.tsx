"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import ArticleSection from "@/views/homepage/ArticleSection";
import HeroSection from "@/views/homepage/HeroSection";
import PartnerScroller from "@/views/homepage/PartnerScroll";
import TopProductsSection from "@/views/homepage/TopProductsSection";
import { motion } from "framer-motion";

// Featured product articles
const productArticles = [
  {
    id: 1,
    title: "Diamond Collection",
    description:
      "Elevate your Minecraft style with our premium Diamond Collection, featuring rare glowing capes woven from the finest virtual diamonds. Each cape comes alive with subtle particle effects that shimmer and trail behind you as you move, ensuring all eyes are on you in any server. Crafted with meticulous attention to detail, the animation cycles smoothly through every angle, creating an otherworldly aura. Plus, the capes are optimized for performance, so you get stunning visuals without any frame-rate drop.",
    image: "/images/diamond-cape.svg",
    color: "var(--primary)",
    alignment: "right", // Image on right
  },
  {
    id: 2,
    title: "Emerald Armor Series",
    description:
      "Step into battle with confidence in our exclusive Emerald Armor Series, where each piece of gear boasts a rich, gleaming emerald finish that catches the light in every direction. Subtle, dynamic particle accents highlight critical areas—like the shoulder plates and helmet crest—bringing a living, breathing look to your armor. Custom sound cues play on equip and damage, immersing you in the forging of ancient tomes and emerald veins. Designed for both aesthetics and functionality, these skins are fully compatible with most popular mods and resource packs.",
    image: "/images/emerald-armor.svg",
    color: "var(--accent)",
    alignment: "left", // Image on left
  },
  {
    id: 3,
    title: "Dragon Wings Collection",
    description:
      "Unleash the power of draconic flight with our Dragon Wings Collection—majestic, animated accessories that react to your every turn and jump. Realistic flame effects flicker along the edges of each feather, intensifying as you sprint or glide, while dynamic articulation ensures each wingbeat feels weighty and authentic. Whether you’re soaring high above your foes or diving into epic battles, these wings add both visual flair and a sense of raw power. Easily toggled on or off via hotkey, they’re the perfect blend of form and function for any adventurer looking to dominate the skies.",
    image: "/images/dragon-wings.svg",
    color: "var(--secondary)",
    alignment: "right", // Image on right
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 1. Header with clean, light design */}
      <header className="py-8 flex items-center justify-center relative flex-col">
        <Navbar />

        <HeroSection />
      </header>

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

      {/* 3. Product Article Sections */}
      {productArticles.map((article, index) => (
        <ArticleSection
          key={index}
          index={index}
          alignment={article.alignment as "left" | "right"}
          description={article.description}
          title={article.title}
          image={article.image}
        />
      ))}

      {/* 4. Top Selling Products Section */}
      <TopProductsSection />

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;