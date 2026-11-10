'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VideoSection({
  src = '/videos/rwanda-gorilla.webm',
  poster = '/images/hero/hero-gorilla.jpg',
  className,
}: {
  src?: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-forest', className)}>
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/8] lg:aspect-[21/9]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Mountain gorilla in Volcanoes National Park, Rwanda"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07271C]/85 via-[#07271C]/20 to-[#07271C]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07271C]/45 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:p-9 lg:flex-row lg:items-end lg:justify-between lg:p-12">
        <div className="max-w-xl text-white">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-sunflower">
            Volcanoes National Park · 23 seconds
          </p>
          <h2 className="mt-2.5 text-balance font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[40px]">
            Feel Rwanda before you land.
          </h2>
          <p className="mt-2.5 max-w-md text-[14.5px] leading-relaxed text-white/75">
            Mist moving through the bamboo, a family of gorillas waking up. This is a quiet moment
            filmed on the slopes above Kinigi — the same forest you can visit on a trek.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/experiences/gorilla-trekking"
              className="btn-gold !py-2.5 text-[14px]"
            >
              Plan a gorilla trek
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/destinations/volcanoes"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Explore Volcanoes
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause the film' : 'Play the film'}
            className="grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <p className="hidden text-[11.5px] leading-snug text-white/60 sm:block">
            Muted ambient film
            <br />
            Volunteer footage · CC BY 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
