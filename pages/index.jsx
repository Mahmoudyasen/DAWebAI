import CatSearch from "@/-components/CatSearch";
import Hero from "@/-components/Hero";
import Hero2 from "@/-components/Hero";
import RootLayout from "@/-components/layout";
export default function Home() {
  return (
  <>
      <RootLayout>
        <Hero/>
        <CatSearch/>
      </RootLayout>
  </>
  );
}
