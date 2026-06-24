import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { Categories } from "@/components/Categories";
import { FeaturedVehicles } from "@/components/FeaturedVehicles";
import { Inspection3D } from "@/components/Inspection3D";
import { Brands } from "@/components/Brands";
export const Route = createFileRoute("/")({
    component: Index,
});
function Index() {
    return (<>
      <Hero />
      <SearchBar />
      <Categories />
      <FeaturedVehicles />
      <Inspection3D />
      <Brands />
    </>);
}
