import { useAtomValue } from "jotai";
import { navigationValueAtom } from "../../states";
import HomePc from "./HomePc";
import WIP from "../WIP";
import { useIsMobile } from "../../hooks";
import HomeMobile from "./HomeMobile";
import { useAccount } from "../../hooks/account";
import { useEffect } from "react";

const Main = () => {
  const navigationValue = useAtomValue(navigationValueAtom);
  const isMobile = useIsMobile();

  const { fetchAccountData: fetchAccountData } = useAccount();

  // 계좌 정보 불러오기
  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  if (navigationValue === 0) {
    if (isMobile) {
      return <HomeMobile />;
    }
    return <HomePc />;
  }
  return <WIP />;
};

export default Main;
