import LinkButton from "../LinkButton";
import LinkButtonContainer from "../LinkButtonContainer";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import { grey, orange } from "@mui/material/colors";

const Home = () => {
  return (
    <>
      {/* Jbank 홈 */}
      <LinkButtonContainer>
        <LinkButton
          title="Jbank 홈"
          icon={<HomeRoundedIcon color="primary" />}
          linkTo="/"
        />

        {/* 공지사항 */}
        <LinkButton
          title="Jbank 공지사항"
          icon={
            <FeedRoundedIcon
              sx={{
                color: grey[500],
              }}
            />
          }
          linkTo="/notice"
        />
      </LinkButtonContainer>

      {/* 거래 */}
      <LinkButtonContainer label="거래">
        {/* 송금하기 */}
        <LinkButton
          title="송금하기"
          icon={<SendRoundedIcon color="primary" />}
          linkTo="/transfer"
        />

        {/* 계좌 */}
        <LinkButton
          title="계좌"
          icon={<AccountBalanceRoundedIcon sx={{ color: orange[500] }} />}
          linkTo="/accounts"
        />
      </LinkButtonContainer>
    </>
  );
};

export default Home;
