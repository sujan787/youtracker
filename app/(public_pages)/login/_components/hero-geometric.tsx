"use client";

import { motion, type Variants } from "framer-motion";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { ImYoutube } from "react-icons/im";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

// framer-motion v12 wants easing as a typed cubic-bezier tuple.
const easeShape: [number, number, number, number] = [0.23, 0.86, 0.39, 0.96];
const easeFade: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: easeShape,
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.12]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  badge = "YouMark",
  title1 = "Save YouTube",
  title2 = "Watch Later",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.4 + i * 0.18, ease: easeFade },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050507]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-blue-500/[0.06] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-violet-500/[0.18]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-blue-500/[0.16]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-fuchsia-500/[0.16]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] mb-8 md:mb-12 backdrop-blur"
          >
            <ImYoutube size={22} className="text-red-500" />
            <span className="text-sm text-white/70 tracking-wide font-medium">{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-white/90 to-blue-300",
                  pacifico.className
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Save YouTube videos for later and stay focused on what matters.
              Reduce distractions and manage your viewing time effectively.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4"
          >
            <Button
              onClick={() => signIn("google", { callbackUrl: "/videos" })}
              size="lg"
              className="h-12 px-7 bg-white text-black hover:bg-white/90 rounded-full shadow-lg shadow-white/10 transition-all duration-200 font-medium"
            >
              <FcGoogle size={22} className="mr-2" />
              Continue with Google
            </Button>

            <p className="text-sm text-white/40">
              Prefer email?{" "}
              <Link href="/register" className="text-white/70 underline underline-offset-4 hover:text-white transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/80 pointer-events-none" />
    </div>
  );
}
