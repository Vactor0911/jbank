import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import LinkButtonGroup from "./LinkButtonGroup";
import LinkButton from "./LinkButton";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { green, orange } from "@mui/material/colors";
import { useNavigate } from "react-router";
import Footer from "../Footer";

const SidebarMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack width="250px" px={2} py={3} gap={3}>
      {/* 로고 */}
      <Box
        onClick={() => {
          navigate("/");
        }}
        sx={{
          cursor: "pointer",
        }}
      >
        <Typography variant="h5" color="primary">
          Jbank
        </Typography>
      </Box>

      {/* 로그인 정보 */}
      <ButtonBase
        sx={{
          width: "100%",
          textAlign: "left",
          p: "2px 4px",
          borderRadius: 2,
        }}
      >
        <Stack direction="row" width="100%" gap={2} alignItems="center">
          {/* 프로필 이미지 */}
          <Avatar
            src={SampleProfileImage}
            variant="rounded"
            sx={{
              width: "32px",
              height: "32px",
            }}
          />

          {/* 사용자 정보 */}
          <Stack flex={1} overflow="hidden">
            {/* Jbank 사용자 닉네임 */}
            <Typography
              variant="body1"
              fontWeight={500}
              noWrap
              textOverflow="ellipsis"
            >
              백터
            </Typography>

            {/* Steam 닉네임 */}
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              textOverflow="ellipsis"
            >
              백터 (Vactor0911)
            </Typography>
          </Stack>

          {/* 아이콘 */}
          <NavigateNextOutlinedIcon />
        </Stack>
      </ButtonBase>

      {/* 버튼 컨테이너 */}
      <Stack
        direction="row"
        divider={<Divider flexItem />}
        gap={1}
        bgcolor={theme.palette.secondary.main}
        p={1}
        borderRadius={2}
      >
        <ButtonBase
          sx={{
            flex: 1,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="body1" textAlign="center" color="text.primary">
            로그아웃
          </Typography>
        </ButtonBase>

        <ButtonBase
          sx={{
            flex: 1,
            borderRadius: 1.5,
          }}
        >
          <Typography
            variant="body1"
            flex={1}
            textAlign="center"
            color="text.primary"
          >
            의견 보내기
          </Typography>
        </ButtonBase>
      </Stack>

      {/* 링크 버튼 */}
      <LinkButtonGroup label="개발">
        <LinkButton
          title="홈"
          icon={<HomeRoundedIcon color="primary" />}
          linkTo="/home"
        />
        <LinkButton
          title="도움말"
          icon={
            <BuildRoundedIcon fontSize="small" sx={{ color: orange[500] }} />
          }
          linkTo="/help"
        />
        <LinkButton
          title="공지사항"
          icon={
            <NotificationsRoundedIcon
              sx={{
                color: green[400],
              }}
            />
          }
          linkTo="/notice"
        />
      </LinkButtonGroup>

      <LinkButtonGroup label="개발">
        <LinkButton title="홈" />
        <LinkButton title="도움말" />
        <LinkButton title="공지사항" />
      </LinkButtonGroup>

      {/* 푸터 */}
      <Footer />
    </Stack>
  );
};

export default SidebarMenu;
