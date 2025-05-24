"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { useTRPC } from "@/server/client";
<<<<<<< HEAD
import ArticleSection from "@/views/homepage/ArticleSection";
=======
import ArticleSlider from "@/views/homepage/ArticleSlider";
>>>>>>> 4fe6dbf (All of version 2)
import HeroSection from "@/views/homepage/HeroSection";
import PartnerScroller from "@/views/homepage/PartnerScroll";
import TopProductsSection from "@/views/homepage/TopProductsSection";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

<<<<<<< HEAD
// Featured product articles
const productArticles = [
  {
    id: 1,
    title: "Minecraft's Worst Cape Scams Ever",
    description: `In October 2024, Mojang released a new limited-edition cosmetic as part of their Minecraft Experience Villager Rescue event. Attendees of this real-life gathering were rewarded with an exclusive in-game item: a purple villager-themed cape, now commonly referred to as the Minecraft Experience Cape. This cape quickly became one of the most sought-after cosmetics in the game, with over 13,000 accounts currently equipped with it. Its rarity, vibrant design, and connection to a live event made it highly desirable for collectors and competitive players alike.\n\nHowever, with this popularity came a surge in scamming activity. Shortly after the cape’s release, new fraudulent schemes began circulating across the Minecraft community, especially targeting younger players on large multiplayer servers. One of the most common scams is known as account beaming, where scammers attempt to steal access to a player’s Minecraft account through deception. Typically, this starts with a scammer posing as a friendly or high-ranking player, often using MVP++ status on servers like Hypixel to gain trust. They invite the player to a Discord server under the guise of playing together, usually Bedwars, and once the victim joins, they are asked to verify themselves via a bot. This bot pretends to be affiliated with Minecraft, requesting login credentials or a one-time sign-in code. If the user provides that code, their account is immediately compromised.\n\nMicrosoft support rarely helps in these cases, as the credentials were willingly entered, even under misleading circumstances. Many affected players find themselves permanently locked out of their accounts with no way to recover years of stats and achievements.\n\nAccounts that include the Minecraft Experience Cape are now top targets for these scammers. According to individuals familiar with the beaming scene, these accounts are considered valuable because of their rarity and resale potential, often reaching up to $80 or more. Scammers tend to focus on these capes since many of the owners are casual users who might not be as cautious or aware of security threats.\n\nAnother widespread scam involves the sale of fake Cape codes. In this method, a seller pretends to offer a legitimate Minecraft Experience Cape redemption code, takes payment, usually through irreversible cryptocurrency, and then provides a bogus code or nothing at all. Victims lose both their money and the opportunity to redeem the cosmetic item, with no recourse for recovery.\n\nTo avoid these risks, it’s crucial for players to remain vigilant and avoid sharing sensitive login information. Never trust unsolicited Discord messages, suspicious bots, or too-good-to-be-true deals. Always ensure that one-time sign-in codes are kept private and only used for their intended purpose.\n\nBy choosing a trusted provider, players can enjoy the benefits of exclusive cosmetics without the worry of fraud or account loss. As the Minecraft Experience Cape continues to grow in popularity, staying informed and cautious is the best way to protect your account and your digital investments.`,
    video: "https://www.youtube.com/embed/wGbQJwCBbR4",
    color: "var(--primary)",
    alignment: "left",
    productSlug: "tiktok-cape"
  },
  {
    id: 2,
    title: "History of the Experience Cape",
    description:
      `It’s been nearly ten years since the release of the last major rare Minecraft cape, the 2016 Minecon cape, but in October of 2024, that changed when the Minecraft Experience cape was finally released, adding a new rare cape for the new generation of players to collect. At that time, you were only able to obtain it by attending a real-life event hosted in Dallas, Texas.\n\nHowever, over the following months, it was announced that the cape would become obtainable in both Toronto and London throughout the summer months of 2025. This decision naturally caused the rarity of the cape to go down, but not to worry, as there are only 13,000 of these capes that exist as of today, and the price is expected to one day hit $1,000 as players will slowly begin to quit the game as time progresses, causing more and more to be lost to the market every day.\n\nLater, Mojang expanded the opportunity by offering the cape at two more real-world events in Toronto and London during the summer of 2025. This increased availability slightly, but the overall rarity stayed intact. As of now, only about 13,000 of these capes exist, making it one of the rarest cosmetics in the game.\n\nThat limited number is why so many people are starting to view the Minecraft Experience Cape as more than just an in-game item. It’s quickly becoming a digital collectible with real-world value. Just like past Minecon capes that now sell for hundreds or even thousands of dollars, this new cape is positioned to become a serious investment over time.\n\nThe numbers make it clear. Minecraft has over 140 million active players, yet only 13,000 Experience Capes exist. And as time goes on, many of these capes will slowly disappear as players stop playing, lose access to accounts, or simply never resell them. With fewer and fewer in circulation, the value of the remaining ones will naturally rise.\n\nSome Cape collectors and digital asset investors believe the Experience Cape could eventually reach or even surpass a $1,000 price tag. That’s not just a random guess. It’s based on the same patterns that turned older capes into valuable collectibles today.\n\nThis is a chance to own a piece of Minecraft history. Whether you’re a collector, a long-time fan of the game, or someone looking to diversify into digital assets, the Minecraft Experience Cape offers a unique opportunity. It combines cultural value with scarcity and the long-term potential of a growing resale market.\n\nIf you're thinking about investing in something digital, this might be one of the smartest moves you can make. The Minecraft Experience Cape isn’t just a cosmetic—it’s a digital asset that could pay off in more ways than one.`,
    video: "https://www.youtube.com/embed/bggJU306IXs",
    color: "var(--accent)",
    alignment: "right", // Image on left
    productSlug: "experience-cape"
  },
];

const HomePage = () => {
  const trpc = useTRPC();
  const { data: products } = useQuery(trpc.product.getAll.queryOptions({ isHomePage: true }));
=======
const HomePage = () => {
  const trpc = useTRPC();
  const { data: products } = useQuery(trpc.product.getAll.queryOptions({ isHomePage: true }));
  const { data: articles } = useQuery(trpc.article.getAll.queryOptions({ includeInactive: false }));
>>>>>>> 4fe6dbf (All of version 2)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 1. Header with clean, light design */}
      <header className="py-8 flex items-center justify-center relative flex-col">
        <Navbar />

        <HeroSection />
      </header>

<<<<<<< HEAD
      {/* 3. Product Article Sections */}
      {productArticles.map((article, index) => (
        <ArticleSection
          key={index}
          index={index}
          alignment={article.alignment as "left" | "right"}
          description={article.description}
          title={article.title}
          video={article.video}
          productSlug={article.productSlug}
        />
      ))}
=======
      {/* 3. Product Article Slider */}
      {articles && articles.length > 0 && (
        <ArticleSlider articles={articles} products={products || []} />
      )}
>>>>>>> 4fe6dbf (All of version 2)

      {/* 4. Top Selling Products Section */}
      <TopProductsSection products={products || []} />

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