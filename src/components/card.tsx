import { MoveRight } from "lucide-react";

interface CardProps {
  image: string;
  title: string;
  paragraph: string;
  color: "red" | "blue" | "purple" | "green";
}

const colorMap = {
  red: {
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-500/50",
    shadow: "hover:shadow-red-500/10",
    text: "text-red-500",
    glow: "after:bg-red-500/20",
    gradient: "from-red-500/10 to-transparent",
  },
  blue: {
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/50",
    shadow: "hover:shadow-blue-500/10",
    text: "text-blue-400",
    glow: "after:bg-blue-500/20",
    gradient: "from-blue-500/10 to-transparent",
  },
  purple: {
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/50",
    shadow: "hover:shadow-purple-500/10",
    text: "text-purple-400",
    glow: "after:bg-purple-500/20",
    gradient: "from-purple-500/10 to-transparent",
  },
  green: {
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-500/50",
    shadow: "hover:shadow-green-500/10",
    text: "text-green-400",
    glow: "after:bg-green-500/20",
    gradient: "from-green-500/10 to-transparent",
  },
};

export default function Card({ image, title, paragraph, color = "red" }: CardProps) {
  const theme = colorMap[color];

  return (
    <div
      className={`group relative glass rounded-2xl overflow-hidden transition-all duration-300
        ${theme.hoverBorder} ${theme.shadow} hover:-translate-y-2
        hover:shadow-xl`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${theme.glow}`}
      />

      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay at bottom of image */}
        <div
          className={`absolute inset-0 bg-linear-to-t ${theme.gradient} from-20% to-transparent`}
        />
      </div>

      {/* Content */}
      <div className="relative p-6">
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
