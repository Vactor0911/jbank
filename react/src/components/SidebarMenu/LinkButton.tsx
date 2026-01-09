import {
  ButtonBase,
  Stack,
  Typography,
  type ButtonBaseProps,
} from "@mui/material";
import { useCallback, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

interface LinkButtonProps extends ButtonBaseProps {
  icon?: ReactNode;
  title: string;
  linkTo?: string;
}

const LinkButton = (props: LinkButtonProps) => {
  const { icon, title, linkTo, disabled, ...others } = props;

  const navigate = useNavigate();
  const location = useLocation();

  // 클릭 핸들러
  const handleClick = useCallback(() => {
    navigate(linkTo || "#");
  }, [linkTo, navigate]);

  return (
    <ButtonBase
      sx={{
        p: "8px 12px",
        textAlign: "left",
        borderRadius: 2,
        bgcolor: location.pathname === linkTo ? "action.selected" : "inherit",
        transition: "background-color 0.3s",
      }}
      onClick={handleClick}
      disabled={disabled}
      {...others}
    >
      <Stack width="100%" direction="row" alignItems="center" gap={1} sx={{
        "& .MuiSvgIcon-root": {
          opacity: disabled ? 0.25 : 1,
        }
      }}>
        {/* 아이콘 */}
        {icon}

        {/* 제목 */}
        <Typography
          flex={1}
          fontWeight={location.pathname === linkTo ? "bold" : 500}
          color={disabled ? "text.disabled" : "inherit"}
          sx={{
            transition: "font-weight 0.3s",
          }}
        >
          {title}
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

export default LinkButton;
