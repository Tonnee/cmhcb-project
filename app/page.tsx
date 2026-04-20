import { Hero } from "@/features/home/components/hero";
import About from "@/features/home/components/about";
import Guide from "@/features/home/components/guide";
import Services from "@/features/home/components/services";
import WellBeing from "@/features/home/components/well-being";
import Training from "@/features/home/components/training";
import Therapists from "@/features/home/components/therapists";
import { UpcomingEvents } from "@/features/home/components/upcoming-events";
import { ScheduleAppointment } from "@/features/home/components/schedule-appointment";

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Guide />
      <Services />
      <WellBeing />
      <Training />
      <Therapists />
      <ScheduleAppointment />
      <UpcomingEvents />
    </main>
  );
}
