"use client";

import * as React from "react";
import Image from "next/image";
import { GALLERY_DATA } from "../data/gallery";
import {
  HiXMark,
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
  HiMagnifyingGlass,
} from "react-icons/hi2";

const CATEGORIES = [
  { id: "all", label: "All Media" },
  { id: "event", label: "Events" },
  { id: "workshop", label: "Workshops" },
  { id: "activity", label: "Activities" },
  { id: "occasion", label: "Occasions" },
];

export default function GalleryView(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(null);

  // Filter items based on selected category
  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return GALLERY_DATA;
    return GALLERY_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleItemClick = (id: string) => {
    const index = filteredItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      setActiveItemIndex(index);
    }
  };

  const handleCloseModal = () => {
    setActiveItemIndex(null);
  };

  const handlePrev = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeItemIndex !== null) {
      setActiveItemIndex((prevIndex) =>
        prevIndex === null
          ? null
          : prevIndex === 0
            ? filteredItems.length - 1
            : prevIndex - 1
      );
    }
  }, [activeItemIndex, filteredItems.length]);

  const handleNext = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeItemIndex !== null) {
      setActiveItemIndex((prevIndex) =>
        prevIndex === null
          ? null
          : prevIndex === filteredItems.length - 1
            ? 0
            : prevIndex + 1
      );
    }
  }, [activeItemIndex, filteredItems.length]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === "Escape") handleCloseModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItemIndex, handlePrev, handleNext]);

  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  return (
    <div className="flex flex-col gap-12 py-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4 select-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === "all"
              ? GALLERY_DATA.length
              : GALLERY_DATA.filter((item) => item.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-sans font-medium text-sm px-6 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2 cursor-pointer ${isActive
                  ? "bg-primary-dark border-primary-dark text-white shadow-md shadow-primary-dark/10"
                  : "bg-white border-muted/20 text-light-ash hover:border-primary/40 hover:text-primary"
                }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-light text-light-ash/80"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="group relative aspect-[4/3] rounded-[24px] overflow-hidden bg-muted border border-muted/20 cursor-pointer"
            >
              {/* Media Content */}
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-full h-full">
                  {/* Using thumbnail or video preview */}
                  <video
                    src={item.src}
                    muted
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}

              {/* Center Play / Zoom Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 text-white text-2xl">
                  {item.type === "video" ? (
                    <HiPlay className="w-6 h-6 ml-0.5" />
                  ) : (
                    <HiMagnifyingGlass className="w-6 h-6" />
                  )}
                </div>
              </div>

              {/* Hover Caption Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-green-overlay via-dark-green-overlay/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10 pointer-events-none">
                <span className="self-start font-sans font-bold text-[10px] uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full mb-3 select-none">
                  {item.category}
                </span>
                <p className="font-sans text-sm text-white/95 leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="font-marcellus text-2xl text-dark mb-2">No Media Found</p>
          <p className="font-sans text-light-ash">
            There are currently no items in this category.
          </p>
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      {activeItem && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300 animate-fade-in cursor-zoom-out"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer text-xl"
            aria-label="Close modal"
          >
            <HiXMark className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 flex items-center justify-center transition-colors cursor-pointer text-2xl"
                aria-label="Previous media"
              >
                <HiChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 flex items-center justify-center transition-colors cursor-pointer text-2xl"
                aria-label="Next media"
              >
                <HiChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Content Wrapper */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[60vh] md:h-[70vh] flex items-center justify-center cursor-default"
          >
            {activeItem.type === "image" ? (
              <div className="relative w-full h-full transition-transform duration-300 scale-95 md:scale-100">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-contain select-none"
                  priority
                />
              </div>
            ) : (
              <video
                src={activeItem.src}
                controls
                autoPlay
                className="max-h-full max-w-full rounded-2xl focus:outline-none"
              />
            )}
          </div>

          {/* Caption Details */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-6 text-center max-w-[80vw] md:max-w-2xl px-6 pointer-events-none"
          >
            <span className="inline-block font-sans font-bold text-xs uppercase tracking-widest text-accent bg-accent/15 border border-accent/20 px-3 py-1 rounded-full mb-3 select-none">
              {activeItem.category}
            </span>
            <p className="font-marcellus text-white/95 text-lg md:text-xl leading-relaxed">
              {activeItem.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
