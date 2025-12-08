"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo = () => {
  const router = useRouter();

  return (
    <div className="flex items-center cursor-pointer relative" onClick={() => router.push("/")}>
      <Image
        src="/images/hat.png"
        alt="Holiday Hat"
        width={30}
        height={30}
        className="absolute -top-1 -left-3 z-10 pointer-events-none"
        style={{ transform: "rotate(-15deg)" }}
      />
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] relative">
        <span className="text-[var(--primary)]">MC</span>
        <span className="gradient-text">Capes</span>
      </h1>
    </div>
  );
};

export default Logo;
