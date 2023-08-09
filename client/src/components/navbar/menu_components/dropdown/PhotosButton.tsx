import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { MenuStateContext } from "../Menu";
import MenuSectionDivider from "../MenuSectionDivider";
import PhotosDropdown from "./components/PhotosDropdown";
import TrendingButton from "./components/TrendingButton";
import RecentButton from "./components/RecentButton";

const PhotosButton = () => {
  const collapseMenu = useContext(MenuStateContext);
  const [dropdownActive, setDropdownActive] = useState(false);

  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const nav = useNavigate();
  const navigateTo = (endpoint: string) => {
    collapseMenu();
    toggleDropdown();
    nav(endpoint);
  };

  return (
    <section className=" bg-lightgrey mobile-menu-element mb-2">
      <PhotosDropdown dropdownActive={dropdownActive} contentType="Photos" />
      <input
        type="checkbox"
        id="photos-dropdown"
        className="absolute opacity-0 h-0 checked:h-fit"
        onChange={toggleDropdown}
      />
      <ul
        className={`w-full overflow-hidden ${dropdownActive ? "h-fit" : "h-0"}`}
      >
        <MenuSectionDivider />
        <span onClick={() => navigateTo("/videos/recent")}>
          <RecentButton />
        </span>
      </ul>
      <ul
        className={`w-full overflow-hidden ${dropdownActive ? "h-fit" : "h-0"}`}
      >
        <span onClick={() => navigateTo("/videos/trending")}>
          <TrendingButton />
        </span>
      </ul>
    </section>
  );
};

export default PhotosButton;
