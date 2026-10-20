import Navbar from "@/components/Navbar";
import ScrollFrameExperience from "@/components/ScrollFrameExperience";
import CompletedProjects from "@/components/CompletedProjects";
import OurExpertise from "@/components/OurExpertise";
import WhyChooseUs from "@/components/WhyChooseUs";
import OurProcess from "@/components/OurProcess";
import ClientTestimonials from "@/components/ClientTestimonials";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <main className="w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Navbar />
      <ScrollFrameExperience />
      <CompletedProjects />
      <OurExpertise />
      <WhyChooseUs />
      <OurProcess />
      <ClientTestimonials />
      <ContactCTA />
    </main>
  );
}
