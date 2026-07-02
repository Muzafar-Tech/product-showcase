import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import logo from "./assets/muzafar-tech-logo-navbar.png";
const socials = [
  { icon: "mdi:github", label: "GitHub", href: "#" },
  { icon: "mdi:linkedin", label: "LinkedIn", href: "#" },
  { icon: "mdi:instagram", label: "Instagram", href: "#" },
  { icon: "mdi:facebook", label: "Facebook", href: "#" },
  { icon: "mdi:email-outline", label: "Email", href: "#" },
];
function SocialIcon({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -8, scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
      style={{
        boxShadow: hover
          ? "0 0 30px rgba(168,85,247,0.45), inset 0 0 20px rgba(168,85,247,0.08)"
          : "0 0 0 rgba(168,85,247,0)",
      }}
    >
      <Icon
        icon={icon}
        width={26}
        className="transition-colors duration-300"
        color={hover ? "#c084fc" : "#e5e5e5"}
      />

      {/* label tooltip */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={hover ? { opacity: 1, y: -34 } : { opacity: 0, y: 6 }}
        className="pointer-events-none absolute whitespace-nowrap rounded-full bg-purple-500/90 px-3 py-1 text-xs font-medium text-white"
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
      }}
      className="flex flex-wrap justify-center gap-x-3 text-3xl font-semibold md:text-4xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-b from-white to-purple-300 bg-clip-text text-transparent"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function BrandWordmark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="mb-2 flex flex-col items-center"
    >
      <span className="text-sm font-bold tracking-[0.35em] text-white/90">
        MUZAFAR
      </span>
      <div className="mt-1 flex items-center gap-2">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 20 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="h-px bg-purple-400/60"
        />
        <span className="text-xs font-semibold tracking-[0.4em] text-purple-400">
          TECH
        </span>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 20 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="h-px bg-purple-400/60"
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-black px-6">
      {/* ambient background glow, same purple as the logo ring */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

      <div className="relative z-10 text-center">
        <motion.img
          src={logo}
          alt="Muzafar Tech"
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
          whileHover={{
            scale: 1.05,
            rotate: -2,
          }}
          className="mx-auto mb-2 w-28 drop-shadow-[0_0_30px_rgba(168,85,247,0.45)] md:w-36"
        />
        <BrandWordmark />
        <AnimatedHeading text="Let's build something premium" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } },
        }}
        className="relative z-10 flex gap-5"
      >
        {socials.map((s) => (
          <motion.div
            key={s.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <SocialIcon {...s} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
