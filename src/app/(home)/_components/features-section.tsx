"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Palette,
  Smartphone,
  Search,
  BarChart,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
    {
      title: "Easy Setup",
      description:
        "Create your portfolio in seconds with our intuitive interface.",
      icon: Zap,
      animate: true,
    },

    {
      title: "Mobile Responsive",
      description:
        "Your portfolio looks great on all devices, from desktop to mobile.",
      icon: Smartphone,
    },
    {
      title: "SEO Optimized",
      description:
        "Get discovered easily with our SEO-friendly portfolio pages.",
      icon: Search,
    },
    {
      title: "Regular Updates",
      description:
        "Enjoy new features and improvements with our frequent updates.",
      icon: RefreshCw,
      animate: true,
    },
    {
      title: "Analytics Integration",
      description:
        "Track your portfolio's performance with built-in analytics.",
      icon: BarChart,
      comingSoon: true,
      animate: true,
    },
    {
      title: "Customizable Designs",
      description:
        "Choose from a variety of themes and customize to your liking.",
      icon: Palette,
      comingSoon: true,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-4xl font-bold"
        >
          Why Choose Portly?
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xl font-semibold">
                    <div className="flex items-center">
                      <motion.div
                        variants={feature.animate ? iconVariants : {}}
                        animate={feature.animate ? "animate" : ""}
                        className="mr-3 rounded-full bg-primary p-2"
                      >
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </motion.div>
                      {feature.title}
                    </div>
                    {feature.comingSoon && (
                      <Badge
                        variant="secondary"
                        className="whitespace-nowrap text-xs"
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
