import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

const HeroSection = () => {
  const router = useRouter();
  const isMobile = useIsMobile(768);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Grid texture background */}
      <div className="absolute inset-0 hero-grid-pattern opacity-70 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-6 pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* LEFT: Text & CTA */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 animate-gradient-x-baby-blue"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              Elevate Your <span>Minecraft</span> Experience
            </motion.h2>

            <motion.p
              className="text-base md:text-lg mb-8 max-w-md text-[#ADD8E6] leading-relaxed"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              Premium accounts that are no longer obtainable anywhere else. Grab
              these exclusive, limited-edition accounts to make your character
              stand out.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <motion.button
                className="minecraft-btn relative overflow-hidden px-8 py-3 rounded-lg font-semibold shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(255,215,0,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/shop")}
              >
                Shop Now
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-lg border-2 border-[#89CFF0] text-[#ADD8E6] font-medium hover:bg-[#89CFF0]/20 transition-all duration-300"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(137,207,240,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/about")}
              >
                About Us
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero image */}
          {isMobile ? (
            <div className="w-full h-[280px] flex justify-center items-center">
              <div className="relative w-4/5 h-full overflow-hidden [&_img]:outline-none [&_img]:shadow-none [&_img]:ring-0 [&_img]:!filter-none">
                <Image
                  src="/images/hero.webp"
                  alt="Minecraft Character with Premium Cape"
                  fill
                  style={{ objectFit: "contain", outline: "none", boxShadow: "none" }}
                  className="scale-110 outline-none shadow-none"
                  priority
                />
              </div>
            </div>
          ) : (
            <motion.div
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="relative w-[100%] md:w-[110%] h-[380px] md:h-[480px] lg:h-[560px] overflow-hidden [&_img]:outline-none [&_img]:shadow-none [&_img]:ring-0 [&_img]:!filter-none"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <Image
                  src="/images/hero.webp"
                  alt="Minecraft Character with Premium Cape"
                  fill
                  style={{ objectFit: "contain", outline: "none", boxShadow: "none" }}
                  className="scale-105 outline-none shadow-none"
                  priority
                />
              </motion.div>
            </motion.div>
          )}
        </div>
        </div>
      </div>

      {/* Scroll indicator - positioned inside hero at bottom */}
      <div className="absolute bottom-24 md:bottom-32 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
              Discover exclusive products
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border-2 border-[var(--accent)] flex items-start justify-center pt-1"
            >
              <div className="w-1 h-2 rounded-full bg-[var(--accent)]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
