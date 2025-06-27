"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div className="text-sm leading-relaxed text-muted-foreground">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

// AdCraft AI specific testimonials data
export const testimonials = [
  {
    text: "AdCraft AI completely transformed our marketing workflow. We're creating professional ads 10x faster than before, and our conversion rates have increased by 250%. The AI understands our brand perfectly.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Chen",
    role: "Marketing Director at TechFlow",
  },
  {
    text: "As a small business owner, I couldn't afford a design team. AdCraft AI gives me professional-quality ads that rival big brands. My sales have doubled since I started using it.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Marcus Rodriguez",
    role: "E-commerce Owner",
  },
  {
    text: "The video ad generation is incredible. What used to take our team weeks now happens in minutes. Our clients are amazed by the quality and speed of delivery.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emily Watson",
    role: "Creative Director at BrandCraft",
  },
  {
    text: "AdCraft AI helped us launch our product with stunning visuals on a tight budget. The ROI has been phenomenal - we've seen 400% growth in just 3 months.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Kim",
    role: "Startup Founder at InnovateLab",
  },
  {
    text: "Creating content for multiple platforms used to be a nightmare. Now I generate perfectly sized ads for every channel in seconds. My productivity has skyrocketed.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Lisa Thompson",
    role: "Social Media Manager",
  },
  {
    text: "The AI understands context incredibly well. It creates ads that not only look amazing but actually convert. Our click-through rates improved by 180%.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Alex Johnson",
    role: "Product Manager at NextGen",
  },
  {
    text: "The image editing features are game-changing. I can perfect my product shots and create variations instantly. It's like having a professional designer on demand.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Rachel Green",
    role: "Fashion Brand Owner",
  },
  {
    text: "AdCraft AI's templates are incredibly diverse and professional. I've created ads for everything from tech products to food brands, and they all look amazing.",
    image: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face",
    name: "Michael Torres",
    role: "Freelance Designer",
  },
  {
    text: "The speed and quality are unmatched. I can iterate on ad concepts in real-time with clients, which has completely changed how we work together.",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    name: "Jennifer Liu",
    role: "Agency Creative Lead",
  },
];