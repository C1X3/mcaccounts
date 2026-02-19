"use client";

import { motion, easeOut } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Route } from "next";

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const items: { label: string; href: Route | string; external?: boolean }[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Videos",
    href: "/videos",
  },
  {
    label: "About Us",
    href: "/about" as Route,
  },
  {
    label: "MCCapes",
    href: "https://mccapes.net",
    external: true,
  },
];

const NavMenu = () => {
  const pathname = usePathname();

  return (
    <motion.ul
      className="hidden md:flex space-x-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        const isActive = item.external
          ? false
          : pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <motion.li key={item.label} variants={fadeInUp} className="relative">
            {item.external ? (
              <a
                href={item.href as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? "bg-[#89CFF0] text-[#0f2744]"
                    : "hover:text-[#89CFF0]"
                }`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href as Route}
                className={`font-medium px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? "bg-[#89CFF0] text-[#0f2744]"
                    : "hover:text-[#89CFF0]"
                }`}
              >
                {item.label}
              </Link>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default NavMenu;
