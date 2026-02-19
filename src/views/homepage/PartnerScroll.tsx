"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { YouTubeChannel } from "@/types/youtube";
import { fetchYouTubeChannels, YOUTUBE_CHANNEL_IDS } from "@/utils/youtube";
import { motion } from "framer-motion";
import Image from "next/image";

const PartnerScroller = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      const data = await fetchYouTubeChannels(YOUTUBE_CHANNEL_IDS);
      setChannels(data);
      setIsLoading(false);
    };
    loadChannels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (channels.length === 0) return null;

  return (
    <Marquee gradient={false} speed={30} className="py-2 overflow-hidden">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="flex flex-col items-center mx-6 cursor-pointer transition-all duration-300 hover:scale-105 group"
          onClick={() => window.open(channel.url, "_blank")}
        >
          <div className="w-24 h-24 relative mb-2">
            <motion.div
              className="w-full h-full overflow-hidden bg-[var(--color-surface)] rounded-full border-2 border-[var(--accent)]/40 transition-all duration-300 group-hover:border-[var(--accent)]/70"
              transition={{ duration: 0.6 }}
            >
              <Image
                src={channel.thumbnailUrl}
                alt={channel.name}
                fill
                className="rounded-full"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          </div>
          <h4 className="text-base font-semibold text-[var(--foreground)] mb-0.5 transition-all duration-300 group-hover:font-bold">
            {channel.name}
          </h4>
          <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)] text-sm">
            <span className="font-bold">{channel.subscribers}</span>{" "}
            <span className="font-normal">subscribers</span>
          </p>
        </div>
      ))}
    </Marquee>
  );
};

export default PartnerScroller;
