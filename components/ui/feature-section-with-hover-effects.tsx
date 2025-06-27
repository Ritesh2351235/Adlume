import { cn } from "@/lib/utils";
import {
  Sparkles,
  Image,
  CreditCard,
  LayoutDashboard,
  Download,
  Share2,
  Layers,
  Zap,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Generation",
      description:
        "Create stunning product ads in seconds using advanced AI models trained on successful campaigns.",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Video Ad Creation",
      description:
        "Transform static images into engaging video advertisements with smooth animations and effects.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Flexible Pricing",
      description:
        "Pay only for what you use with our credit system. Scale from free to enterprise seamlessly.",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      title: "Professional Quality",
      description: "Generate ads that rival those created by professional design agencies.",
      icon: <Layers className="h-6 w-6" />,
    },
    {
      title: "Multiple Formats",
      description: "Export in various formats and resolutions optimized for different platforms.",
      icon: <Download className="h-6 w-6" />,
    },
    {
      title: "Easy Sharing",
      description:
        "Share directly to social media or collaborate with team members effortlessly.",
      icon: <Share2 className="h-6 w-6" />,
    },
    {
      title: "Intuitive Dashboard",
      description:
        "Manage all your generated content from a clean, user-friendly interface.",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      title: "Smart Templates",
      description: "Access our extensive library of templates and mockups for any industry.",
      icon: <Image className="h-6 w-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-purple-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};