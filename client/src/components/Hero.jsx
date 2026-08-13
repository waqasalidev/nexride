import { HeroVideo } from "./HeroVideo.jsx";

export function Hero() {
  const handleExploreClick = () => {
    const el = document.getElementById("featured");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrowseClick = () => {
    const el = document.getElementById("categories");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return <HeroVideo onExploreClick={handleExploreClick} onBrowseClick={handleBrowseClick} />;
}
