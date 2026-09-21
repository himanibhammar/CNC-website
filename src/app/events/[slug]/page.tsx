import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FLAGSHIP_EVENTS } from "@/data/flagship-events";
import { PAST_EVENTS } from "@/data/past-events";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const flagshipSlugs = FLAGSHIP_EVENTS.map((e) => ({ slug: e.id }));
  const pastSlugs = PAST_EVENTS.map((e) => ({ slug: e.id }));
  return [...flagshipSlugs, ...pastSlugs];
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const flagship = FLAGSHIP_EVENTS.find((e) => e.id === slug);
  const past = PAST_EVENTS.find((e) => e.id === slug);
  const title = flagship?.title || past?.title || "Event Detail";

  return {
    title: `${title} — Challenges & Championships`,
    description: flagship?.description || past?.description || "Event Dossier",
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;

  // Search in Flagships first, then Past Events
  const flagship = FLAGSHIP_EVENTS.find((e) => e.id === slug);
  const past = PAST_EVENTS.find((e) => e.id === slug);

  if (!flagship && !past) {
    notFound();
  }

  const isFlagship = !!flagship;
  const title = flagship ? flagship.title : past!.title;
  const category = flagship ? flagship.category : past!.category;
  const description = flagship ? flagship.description : past!.description;
  const tagline = flagship ? flagship.tagline : `Archival engineering competition held in ${past!.year}.`;
  const primaryImage = flagship ? flagship.images[0].src : past!.image;
  const galleryImages = flagship ? flagship.images : [{ src: past!.image, alt: past!.title, caption: "Archival Plate" }];
  const highlights = flagship?.highlights || [
    "Full-scale arena and testing benchmark validation",
    "Open collegiate and developer qualification rounds",
    "Jury technical scoring and telemetry review",
  ];

  return (
    <div className="w-full min-h-screen pt-32 pb-28 px-6 sm:px-10 lg:px-16 bg-[#07090e] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ARCHIVE</span>
          </Link>
        </div>

        {/* Hero Header Dossier */}
        <div className="border-b border-white/[0.08] pb-12 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-semibold tracking-widest text-blue-400">
              {flagship ? flagship.number : `YEAR // ${past?.year}`}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
              {category}
            </span>
            {isFlagship && (
              <span className="ml-auto font-mono text-[10px] tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
                ACTIVE FLAGSHIP
              </span>
            )}
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white uppercase leading-[1] mb-6">
            {title}
          </h1>

          <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-wider max-w-3xl leading-relaxed uppercase">
            {tagline}
          </p>
        </div>

        {/* Primary Viewfinder Photograph */}
        <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/10 bg-[#0d111b] mb-16 shadow-2xl">
          <Image
            src={primaryImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-[2px] font-mono text-[10px] tracking-widest text-neutral-300 uppercase">
            PRIMARY VIEWPORT // {title}
          </div>
        </div>

        {/* Two-Column Technical Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08] mb-16">
          {/* Left Column: Description & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
              // EVENT BRIEF
            </h2>
            <p className="font-sans text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              {description}
            </p>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
              Organized under the official aegis of Challenges & Championships. All tracks prioritize rigorous technical execution, real-time data integrity, and cross-disciplinary engineering teamwork.
            </p>
          </div>

          {/* Right Column: Highlights & Specifications */}
          <div className="lg:col-span-5 space-y-6 bg-[#0a0d16] p-6 sm:p-8 rounded-sm border border-white/[0.06]">
            <h2 className="font-mono text-xs tracking-[0.25em] text-blue-400 uppercase">
              // COMPETITION PARAMETERS
            </h2>

            <ul className="space-y-4">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-neutral-400">
              <span>STATUS</span>
              <span className="text-white">{isFlagship ? "Registration Open" : "Concluded"}</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-8 mb-20">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
              // PHOTOGRAPHIC DOSSIER ({galleryImages.length} PLATES)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/[0.08] bg-[#0b0e17] group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-[2px] font-mono text-[9px] tracking-widest text-neutral-300 uppercase">
                  {img.caption || `PLATE 0${i + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-8 sm:p-12 rounded-sm bg-[#090c14] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-sans text-2xl font-light text-white uppercase">
              PARTICIPATE IN {title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light">
              Registration links, handbook downloads, and schedule timelines are coordinated through C&C official channels.
            </p>
          </div>

          <div className="shrink-0">
            <Button href="/contact" variant="solid">
              CONTACT ORGANIZERS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
