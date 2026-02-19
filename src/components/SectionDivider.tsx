"use client";

type Variant = "wave" | "slant" | "curve" | "fade";

interface SectionDividerProps {
  variant?: Variant;
  flip?: boolean;
  className?: string;
  /** Color of the section below (for gradient blend) */
  nextColor?: string;
}

const SectionDivider = ({
  variant = "wave",
  flip = false,
  className = "",
  nextColor = "#0a1e35",
}: SectionDividerProps) => {
  const fill = nextColor;

  if (variant === "fade") {
    return (
      <div
        className={`h-24 w-full ${className}`}
        style={{
          background: `linear-gradient(to bottom, transparent, ${fill})`,
        }}
      />
    );
  }

  if (variant === "slant") {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ height: 48 }}
      >
        <svg
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          className={`w-full h-full ${flip ? "rotate-180" : ""}`}
        >
          <path
            d="M0,48 L0,24 Q600,0 1200,24 L1200,48 Z"
            fill={fill}
          />
        </svg>
      </div>
    );
  }

  if (variant === "curve") {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ height: 64 }}
      >
        <svg
          viewBox="0 0 1200 64"
          preserveAspectRatio="none"
          className={`w-full h-full ${flip ? "scale-y-[-1]" : ""}`}
        >
          <path
            d="M0,64 C300,0 900,0 1200,64 L1200,64 L0,64 Z"
            fill={fill}
          />
        </svg>
      </div>
    );
  }

  // wave (default)
  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ height: 56 }}
    >
      <svg
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        className={`w-full h-full ${flip ? "scale-y-[-1]" : ""}`}
      >
        <path
          d="M0,32 C150,0 350,56 600,32 C850,8 1050,56 1200,32 L1200,56 L0,56 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
