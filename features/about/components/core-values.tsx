import { HiHeart, HiStar, HiShieldCheck, HiUsers, HiSparkles, HiAcademicCap, HiCheck } from "react-icons/hi2";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

const iconMap: Record<string, React.ReactNode> = {
  Heart: <HiHeart className="w-7 h-7" />,
  Shield: <HiShieldCheck className="w-7 h-7" />,
  Sparkles: <HiSparkles className="w-7 h-7" />,
  Academic: <HiAcademicCap className="w-7 h-7" />,
  Users: <HiUsers className="w-7 h-7" />,
  Check: <HiCheck className="w-7 h-7" />,
};

const DEFAULT_VALUES = [
  {
    title: "Compassion",
    description: "We approach every individual with deep empathy, creating a safe, non-judgmental space for healing and personal growth.",
    icon: "Heart",
  },
  {
    title: "Excellence",
    description: "We are committed to providing the highest standard of evidence-based psychological care and continuous professional development.",
    icon: "Sparkles",
  },
  {
    title: "Integrity",
    description: "We uphold strict ethical standards, ensuring absolute confidentiality, honesty, and transparency in all our therapeutic relationships.",
    icon: "Shield",
  },
  {
    title: "Inclusivity",
    description: "We respect and celebrate diversity, ensuring our services are accessible and welcoming to people from all walks of life.",
    icon: "Users",
  },
];

interface CoreValueItem {
  title: string;
  description: string;
  icon: string;
}

interface CoreValuesProps {
  values?: CoreValueItem[];
}

export function CoreValues({ values }: CoreValuesProps): React.JSX.Element {
  const displayValues = values && values.length > 0 ? values : DEFAULT_VALUES;

  return (
    <section className="py-16 md:py-24 bg-page-bg">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Text */}
          <div className="w-full lg:w-1/3">
            <SectionHeading
              align="left"
              title={<>Our Core <span className="text-primary-dark">Values</span></>}
              subtitle="What Drives Us"
              className="mb-8"
            />
            <p className="font-sans text-light-ash text-lg leading-relaxed mb-8">
              At CMHCB, our philosophy is deeply rooted in the belief that everyone deserves access to quality mental health care. These fundamental principles guide every decision we make and every therapy session we conduct.
            </p>
          </div>

          {/* Right Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayValues.map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-muted/50 hover:border-accent hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {iconMap[value.icon] || <HiHeart className="w-7 h-7" />}
                </div>
                <h3 className="font-marcellus text-2xl text-dark mb-4">{value.title}</h3>
                <p className="font-sans text-light-ash leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
