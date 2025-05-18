import { motion } from "framer-motion";
import { useState } from "react";

interface ArticleSectionProps {
    alignment: "left" | "right";
    description: string;
    title: string;
    video: string;
    index: number;
}

const ArticleSection = ({ alignment, description, title, video, index }: ArticleSectionProps) => {
    const [showModal, setShowModal] = useState(false);
    const paragraphs = description.split("\n\n");
    const firstParagraph = paragraphs[0];
    const floatClass = alignment === "right" ? "float-right md:ml-6" : "float-left md:mr-6";

    return (
        <>
            <section
                key={index}
                className={`py-16 ${index % 2 === 0 ? "bg-[var(--surface-light)]" : "bg-white"} relative`}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-light)] to-transparent opacity-5 z-0"
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                <div className="container mx-auto">
                    <motion.div
                        className="relative"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Title and intro paragraph - always at the top */}
                        <motion.div
                            className="mb-8 text-center md:text-left md:w-4/5 mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <motion.h3
                                className="text-3xl font-bold mb-4 text-[var(--foreground)]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                            >
                                <span className="gradient-text">{title}</span>
                            </motion.h3>
                            <motion.p
                                className="text-gray-600 text-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                {firstParagraph}
                            </motion.p>
                        </motion.div>

                        {paragraphs.length > 2 && (
                            <motion.div
                                className="md:w-4/5 mx-auto overflow-auto mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                            >
                                <iframe
                                    src={video}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={`rounded-lg w-full h-[200px] md:w-1/2 md:h-[300px] ${floatClass} mb-4`}
                                />

                                {/* Paragraphs 2 & 3 flow around the video */}
                                <p className="text-gray-600 text-lg mb-4">{paragraphs[1]}</p>
                                <p className="text-gray-600 text-lg mb-4">{paragraphs[2]}</p>

                                {/* If there's a 4th paragraph, render it below both */}
                                {paragraphs.length > 3 && (
                                    <p className="clear-both text-gray-600 text-lg mt-4">
                                        {paragraphs[3]}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        <div className="text-center mt-6">
                            <motion.button
                                className="minecraft-btn"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 15px 30px rgba(74, 222, 128, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.7 }}
                                onClick={() => setShowModal(true)}
                            >
                                Read More
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Article Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                                        <span className="gradient-text">{title}</span>
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Video at the top of modal */}
                                <div className="mb-6 aspect-video">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg">
                                    </iframe>
                                </div>

                                {/* Full article content */}
                                <div className="prose max-w-none">
                                    {description.split('\n\n').map((paragraph, i) => (
                                        <p key={i} className="mb-4 text-gray-600">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="minecraft-btn"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </>
    );
};

export default ArticleSection;