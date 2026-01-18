import { useAtomValue } from "jotai";
import { navigationValueAtom } from "../../states";
import HomePc from "./HomePc";
import WIP from "../WIP";
import { useIsMobile } from "../../hooks";
import HomeMobile from "./HomeMobile";

const Main = () => {
  const navigationValue = useAtomValue(navigationValueAtom);
  const isMobile = useIsMobile();

  if (navigationValue === 0) {
    if (isMobile) {
      return <HomeMobile />;
    }
    return <HomePc />;
  }
  return <WIP />;
};

export default Main;
