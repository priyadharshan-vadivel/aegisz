import { BreakItTerminal } from "@/components/sections/BreakItTerminal";
import { VisionMission } from "@/components/sections/VisionMission";
import { HeroStage } from "@/components/three/HeroStage";
import {
  ClosingCta,
  Hero,
  IaacSpotlight,
  Partners,
  PortfolioTeaser,
  WhatWeDo,
  WhoWeServe,
  WhyAegisz,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <>
      <HeroStage>
        <Hero />
      </HeroStage>
      <VisionMission />
      <WhatWeDo />
      <PortfolioTeaser />
      <IaacSpotlight>
        <BreakItTerminal />
      </IaacSpotlight>
      <WhoWeServe />
      <WhyAegisz />
      {/* TODO: customer proof (logos, case studies or quotes) once approved for publication. Do not invent. */}
      <Partners />
      <ClosingCta />
    </>
  );
}
