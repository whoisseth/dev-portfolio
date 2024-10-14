"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cog, FilePlus, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User } from "@/lib/session";

interface AnimatedPortfolioButtonsProps {
  user: User | undefined;
}

export default function AnimatedPortfolioButtons({
  user,
}: AnimatedPortfolioButtonsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const buttonAnimation = {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" },
  };

  return (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={buttonAnimation}
        onHoverStart={() => setHoveredButton("auth")}
        onHoverEnd={() => setHoveredButton(null)}
      >
        {user ? (
          <Link
            prefetch={false}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group transition-colors duration-200",
              hoveredButton === "auth"
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            href="/api/sign-out"
          >
            <LogOut
              size={14}
              className="mr-2 transition-transform group-hover:scale-110"
            />
            Logout
          </Link>
        ) : (
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group transition-colors duration-200",
              hoveredButton === "auth"
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
          >
            <LogIn className="mr-2 transition-transform group-hover:scale-110" />
            Login
          </Link>
        )}
      </motion.div>

      <motion.div
        whileHover={buttonAnimation}
        onHoverStart={() => setHoveredButton("portfolio")}
        onHoverEnd={() => setHoveredButton(null)}
      >
        <Link
          className={cn(buttonVariants({ variant: "default" }), "group")}
          href="/create-portfolio"
        >
          {user ? (
            <>
              <motion.div
                className="relative mr-2 inline-block"
                animate={
                  hoveredButton === "portfolio"
                    ? { rotate: 360 }
                    : { rotate: 0 }
                }
                transition={{ duration: 0.5, ease: "linear" }}
              >
                <Cog className="size-4" />
              </motion.div>
              Manage Your Portfolio
            </>
          ) : (
            <>
              <motion.div
                animate={
                  hoveredButton === "portfolio"
                    ? { scale: 1.2, y: -2 }
                    : { scale: 1, y: 0 }
                }
                transition={{ duration: 0.3, ease: "backOut" }}
              >
                <FilePlus className="mr-2 h-4 w-4" />
              </motion.div>
              Create Your Portfolio
            </>
          )}
        </Link>
      </motion.div>
    </div>
  );
}
