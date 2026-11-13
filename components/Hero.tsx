'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SearchBar from './SearchBar';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  image = '/images/hero/hero-kivu.jpg',
  imageAlt = 'Sunset over Lake Kivu and the green hills of western Rwanda',
  location = 'Lake Kivu · Rubavu',
  stayCount,
  regionCount,
  experienceCount,
}: {
  image?: string;
  imageAlt?: string;
  location?: string;
  stayCount: number;
  regionCount: number;
  experienceCount: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ['0%', '9%']);

  return (
    <section ref={sectionRef} className="wrap pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-[26px] bg-forest sm:rounded-[34px]">
        <div className="relative h-[calc(100svh-210px)] min-h-[520px] max-h-[740px]">
          <motion.div
            aria-hidden
            initial={reduce ? undefined : { scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            style={reduce ? undefined : { y: parallax }}
            className="absolute inset-0 -bottom-[10%]"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              quality={84}
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

          <div className="relative flex h-full flex-col justify-end p-5 pb-6 sm:p-8 sm:pb-9 lg:p-11 lg:pb-12">
            <div className="max-w-4xl text-white">
              <motion.p
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                className="flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/70"
              >
                <span className="h-px w-7 bg-white/40" />
                Murakaza neza · Welcome to Rwanda
              </motion.p>

              <motion.h1
                initial={reduce ? undefined : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
                className="mt-3.5 max-w-[17ch] text-balance text-[clamp(38px,5.6vw,72px)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
              >
                Stay well in the land of a thousand hills.
              </motion.h1>

              <motion.p
                initial={reduce ? undefined : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
                className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/75 sm:text-[15.5px]"
              >
                Volcanoes, rainforest and inland sea — handpicked places to sleep and local
                experiences to remember.
              </motion.p>
            </div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.44, ease: EASE }}
              className="mt-7 max-w-3xl"
            >
              <SearchBar variant="hero" />
            </motion.div>
          </div>

          <motion.p
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute right-5 top-5 hidden text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/60 sm:block sm:right-8 sm:top-8"
          >
            {location}
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1"
      >
        <p className="text-[12.5px] text-mute">
          <span className="font-semibold text-ink">{stayCount}</span> stays ·{' '}
          <span className="font-semibold text-ink">{regionCount}</span> regions ·{' '}
          <span className="font-semibold text-ink">{experienceCount}</span> experiences
        </p>
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute/80">
          Scroll to explore
          <span className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink">
            <ArrowDown className="h-3.5 w-3.5" />
          </span>
        </p>
      </motion.div>
    </section>
  );
}
