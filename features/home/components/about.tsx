import * as React from "react";

export function About(): React.JSX.Element {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto">
        <h2 className="font-marcellus text-3xl lg:text-4xl text-dark mb-4">
          About Us
        </h2>
      </div>
    </section>
  );
}
"use client";

import imgBeautifulWomanHoldingClipboard2 from "figma:asset/f69e19a8baea8cac45192d39b0e2ea476429161b.png";
import imgSuccessfulBusinessman1 from "figma:asset/99b661ad21df875f7a343f8ade58b1a254a740f3.png";
import imgBodyOrgan1 from "figma:asset/e0a5a32077a2f5ce49919db75d2bb84b691b42bc.png";
import imgHeart1 from "figma:asset/d3518cfa9d7f2f774281a786353c652c86991129.png";
import imgLineChart1 from "figma:asset/77b90590adf0c862ea12802bd0cceadef4c764d9.png";

interface IconBadgeProps {
  children: React.ReactNode;
  bgColor: string;
}

function IconBadge({ children, bgColor }: IconBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center w-11 h-11 rounded-full align-middle mx-1"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </span>
  );
}

interface ImageBadgeProps {
  src: string;
  alt: string;
}

function ImageBadge({ src, alt }: ImageBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full overflow-hidden align-middle mx-1 border-2 border-white shadow-md">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </span>
  );
}

export default function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1366px] mx-auto px-[105px]">
        <div className="max-w-[1001px] mx-auto">
          <h2 className="font-['Marcellus',sans-serif] text-[32px] leading-[58px] text-black text-center">
            We connect licensed therapists{" "}
            <ImageBadge
              src={imgBeautifulWomanHoldingClipboard2}
              alt="Licensed therapist"
            />
            , mental health programs{" "}
            <IconBadge bgColor="#035300">
              <img
                src={imgBodyOrgan1}
                alt="Mental health"
                className="w-[30px] h-[30px]"
              />
            </IconBadge>
            , and personalized care{" "}
            <IconBadge bgColor="#F9A620">
              <img src={imgHeart1} alt="Care" className="w-[27px] h-[27px]" />
            </IconBadge>{" "}
            services, ensuring clients{" "}
            <ImageBadge
              src={imgSuccessfulBusinessman1}
              alt="Client"
            />{" "}
            receive the support they need to thrive{" "}
            <IconBadge bgColor="#72C100">
              <img
                src={imgLineChart1}
                alt="Growth"
                className="w-[26px] h-[26px]"
              />
            </IconBadge>{" "}
            wherever they feel safe.
          </h2>
        </div>
      </div>
    </section>
  );
}
