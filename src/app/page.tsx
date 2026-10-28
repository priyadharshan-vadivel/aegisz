import { Container } from "@/components/ui/Container";
import { Todo } from "@/components/ui/Todo";
import { Terminal } from "@/components/sections/Terminal";
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
  WhyWeExist,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <>
      <HeroStage>
        <Hero />
      </HeroStage>
      <WhyWeExist />
      <VisionMission />
      <WhatWeDo />
      <PortfolioTeaser />
      <IaacSpotlight>
        <Terminal lit />
      </IaacSpotlight>
      <WhoWeServe />
      <WhyAegisz />
      <Container className="pt-section">
        <Todo>Customer proof (logos, case studies or quotes) once approved for publication. Do not invent.</Todo>
      </Container>
      <Partners />
      <ClosingCta />
    </>
  );
}
