import { ShieldPoster } from "@/components/three/ShieldPoster";
import { About, Hero, OurProducts, PartnersCta, VisionMission, WhoWeServe } from "@/components/sections/home";

// TODO: customer proof (logos, case studies or quotes) once approved for publication. Do not invent.
export default function HomePage() {
  return (
    <>
      <Hero visual={<ShieldPoster className="h-full w-full" />} />
      <About />
      <VisionMission />
      <WhoWeServe />
      <OurProducts />
      <PartnersCta />
    </>
  );
}
