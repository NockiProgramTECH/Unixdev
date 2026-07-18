import { MoveRight } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
  icon: ReactNode;
  title: string;
  paragraph: string;
  color: "red" | "blue" | "purple" | "green";
}

const colorMap = {
  red: {
    iconBg: "bg-red-500/10",
    hoverBorder: "hover:border-red-500/50",
    shadow: "hover:shadow-red-500/10",
    text: "text-red-500",
    glow: "after:bg-red-500/20",
  },
  blue: {
    iconBg: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/50",
    shadow: "hover:shadow-blue-500/10",
    text: "text-blue-400",
    glow: "after:bg-blue-500/20",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/50",
    shadow: "hover:shadow-purple-500/10",
    text: "text-purple-400",
    glow: "after:bg-purple-500/20",
  },
  green: {
    iconBg: "bg-green-500/10",
    hoverBorder: "hover:border-green-500/50",
    shadow: "hover:shadow-green-500/10",
    text: "text-green-400",
    glow: "after:bg-green-500/20",
  },
};

export default function Card({ icon, title, paragraph, color = "red" }: CardProps) {
  const theme = colorMap[color];

  return (
    <div
      className={`group relative glass rounded-2xl p-6 transition-all duration-300
        ${theme.hoverBorder} ${theme.shadow} hover:-translate-y-2
        hover:shadow-xl`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${theme.glow}`}
      />

      {/* Content - relative to be above glow */}
      <div className="relative">
        {/* Icon container */}
        <div
          className={`w-14 h-14 rounded-xl ${theme.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {paragraph}
        </p>

        {/* CTA Link */}
        <a
          href="#"
          className={`inline-flex items-center gap-2 text-sm font-medium ${theme.text}
            hover:gap-3 transition-all duration-200`}
        >
          En savoir plus <MoveRight size={16} />
        </a>
      </div>
    </div>
  );
}
