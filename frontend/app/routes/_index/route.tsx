import type { MetaFunction } from "@remix-run/node";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "EcoLocal" },
    { name: "description", content: "Welcome to EcoLocal!" },
  ];
};
export default function Index() {
  const scrollToSection = (section: string, margin?: number) => {
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      window.scrollTo({
        top: sectionElement.offsetTop - (margin || 0),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    localStorage.getItem("user");
  }, []);

  return (
    <>
      <Section1 scrollToSection={scrollToSection} />
      <Section2 scrollToSection={scrollToSection} />
      <Section3 />
    </>
  );
}
