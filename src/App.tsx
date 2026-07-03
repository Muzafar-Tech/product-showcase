import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import logo from "./assets/muzafar-tech-logo-navbar.png";

function productImages(seed: string, count: number) {
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/700/700`,
  );
}

const products = [
  {
    name: "Aurora Sneakers",
    price: "$129",
    rating: 5,
    images: productImages("aurora-sneaker", 5),
  },
  {
    name: "Nimbus Backpack",
    price: "$89",
    rating: 4,
    images: productImages("nimbus-backpack", 5),
  },
  {
    name: "Halo Smartwatch",
    price: "$199",
    rating: 5,
    images: productImages("halo-smartwatch", 5),
  },
];

const AUTO_ADVANCE_MS = 4500;

// ---------------------------------------------------------------------------
// Logo-matched hero header — consistent with the rest of the demo series
// ---------------------------------------------------------------------------
function LogoBadge() {
  return (
    <div className="relative mx-auto mb-8 w-fit">
      {/* Purple Glow */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl" />

      <motion.img
        src={logo}
        alt="Muzafar Tech"
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 120,
        }}
        whileHover={{
          scale: 1.05,
          rotate: -2,
        }}
        className="relative z-10 mx-auto w-32 md:w-40 drop-shadow-[0_0_35px_rgba(168,85,247,0.45)]"
      />
    </div>
  );
}

function BrandWordmark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="mb-8 flex flex-col items-center"
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

// ---------------------------------------------------------------------------
// Directional slide variants for the image carousel — direction is passed in
// as `custom` so AnimatePresence knows which way to animate in/out.
// ---------------------------------------------------------------------------
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, scale: 0.97 }),
};

export default function App() {
  const [productIndex, setProductIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [barKey, setBarKey] = useState(0); // remounts the progress bar to restart its fill

  const product = products[productIndex];

  // 3D pointer-tilt on the whole showcase frame
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(ry, [-60, 60], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(rx, [-60, 60], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleTilt(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rx.set(e.clientX - rect.left - rect.width / 2);
    ry.set(e.clientY - rect.top - rect.height / 2);
  }
  function resetTilt() {
    rx.set(0);
    ry.set(0);
  }

  function goToProduct(next: number) {
    setDirection(next > productIndex ? 1 : -1);
    setProductIndex((next + products.length) % products.length);
    setImageIndex(0);
    setBarKey((k) => k + 1);
  }

  function nextImage() {
    setDirection(1);
    setImageIndex((i) => (i + 1) % product.images.length);
  }
  function prevImage() {
    setDirection(-1);
    setImageIndex(
      (i) => (i - 1 + product.images.length) % product.images.length,
    );
  }

  // When a product finishes its auto-advance timer (progress bar completes),
  // move to the next product — but only if the user isn't hovering.
  function handleBarComplete() {
    if (hovered) return;
    goToProduct(productIndex + 1);
  }

  // Reset the progress bar whenever the product changes for any reason
  useEffect(() => {
    setBarKey((k) => k + 1);
  }, [productIndex]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-black px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

      <div className="relative z-10 text-center">
        <LogoBadge />
        <BrandWordmark />
        <p className="mb-1 text-sm uppercase tracking-[0.3em] text-purple-400">
          Product Showcase
        </p>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">
          Hover. Pause. Explore.
        </h1>
      </div>

      {/* ---- Showcase frame ---- */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          resetTilt();
        }}
        onMouseMove={handleTilt}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative z-10 w-[22rem] rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
      >
        {/* ambient product-color glow */}
        <motion.div
          key={`glow-${productIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-fuchsia-500 blur-3xl"
        />

        {/* per-product progress dots + fill bars (Instagram-story style) */}
        <div className="mb-4 flex gap-1.5">
          {products.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
            >
              {i === productIndex ? (
                <div
                  key={barKey}
                  onAnimationEnd={handleBarComplete}
                  className="h-full rounded-full bg-purple-400"
                  style={{
                    animation: `fill-bar ${AUTO_ADVANCE_MS}ms linear forwards`,
                    animationPlayState: hovered ? "paused" : "running",
                  }}
                />
              ) : (
                <div
                  className={`h-full rounded-full ${i < productIndex ? "w-full bg-purple-400/50" : "w-0"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* image stage */}
        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-black">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={`${productIndex}-${imageIndex}`}
              src={product.images[imageIndex]}
              alt={`${product.name} view ${imageIndex + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* dark gradient for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* nav arrows — only interactive while hovered, fade+scale in */}
          <motion.button
            aria-label="Previous image"
            onClick={prevImage}
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
            transition={{ duration: 0.25 }}
            className="cursor-pointer absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md"
          >
            <Icon icon="mdi:chevron-left" width={20} />
          </motion.button>
          <motion.button
            aria-label="Next image"
            onClick={nextImage}
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="cursor-pointer absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md"
          >
            <Icon icon="mdi:chevron-right" width={20} />
          </motion.button>

          {/* image counter */}
          <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/80 backdrop-blur-md">
            {imageIndex + 1} / {product.images.length}
          </div>

          {/* per-image dot indicators */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > imageIndex ? 1 : -1);
                  setImageIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === imageIndex ? "w-5 bg-purple-300" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* product info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={productIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-4 flex items-center justify-between px-1"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                {product.name}
              </h2>
              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    icon="mdi:star"
                    width={13}
                    className={
                      i < product.rating ? "text-purple-300" : "text-white/15"
                    }
                  />
                ))}
              </div>
            </div>
            <span className="text-lg font-semibold text-purple-300">
              {product.price}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* product switcher dots */}
      <div className="relative z-10 flex gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goToProduct(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === productIndex ? "w-6 bg-purple-400" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fill-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
