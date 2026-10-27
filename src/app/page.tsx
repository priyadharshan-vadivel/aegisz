import { Container } from "@/components/ui/Container";
import { Todo } from "@/components/ui/Todo";
import {
  ClosingCta,
  DesignServicesBand,
  Hero,
  IaacSpotlight,
  Partners,
  PortfolioGrid,
  ProblemSection,
  WhoWeServe,
  WhyAegisz,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <PortfolioGrid />
      <IaacSpotlight />
      <DesignServicesBand />
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
