

interface ServiceCardProps {
  title: string;
  features: string[];
  duration: string;
  fees: string;
  bgColor?: string;
  onLearnMore?: () => void;
}

export default function ServiceCard({
  title,
  features,
  duration,
  fees,
  bgColor = "#f9a620",
  onLearnMore
}: ServiceCardProps) {
  return (
    <div
      className="relative w-full max-w-[567px] rounded-[24px] p-10 md:p-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* Title */}
      <h2 className="font-['Marcellus:Regular',sans-serif] text-[32px] md:text-[40px] leading-[1.2] text-black mb-8">
        {title}
      </h2>

      {/* Features List */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-5">
            <div className="w-3 h-3 rounded-full bg-white flex-shrink-0" />
            <span className="font-['DM_Sans:Regular',sans-serif] font-normal text-[20px] leading-[32px] text-black" style={{ fontVariationSettings: "'opsz' 14" }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Duration and Fees */}
      <p className="font-['DM_Sans:SemiBold',sans-serif] font-semibold text-[20px] leading-[32px] text-black mb-6" style={{ fontVariationSettings: "'opsz' 14" }}>
        <span className="text-white">Duration: </span>
        <span>{duration}, </span>
        <span className="text-white">Fees: </span>
        <span>{fees}</span>
      </p>

      {/* Learn More Button */}
      <button
        onClick={onLearnMore}
        className="flex items-center gap-3 group hover:gap-4 transition-all"
      >
        <span className="font-['Marcellus:Regular',sans-serif] text-[20px] text-black">
          Learn More
        </span>
        <div className="w-5 h-5">
          
        </div>
      </button>
    </div>
  );
}
