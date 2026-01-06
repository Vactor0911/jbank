import PageWrapper from "../../components/PageWrapper";
import { useAtomValue } from "jotai";
import { navigationValueAtom } from "../../states";
import Home from "./Home";
import WIP from "./WIP";

const Main = () => {
  const navigationValue = useAtomValue(navigationValueAtom);

  return (
    <PageWrapper>
      {navigationValue === 0 && <Home />}
      {navigationValue !== 0 && <WIP />}
    </PageWrapper>
  );
};

export default Main;
