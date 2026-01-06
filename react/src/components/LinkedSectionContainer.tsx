import { ButtonBase, Stack, Typography } from "@mui/material";
import { useCallback, type ReactNode } from "react";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useNavigate } from "react-router";
import SectionContainer from "./SectionContainer";

interface LinkedSectionContainerProps {
  label: ReactNode;
  children?: ReactNode;
  linkTo?: string;
}

const LinkedSectionContainer = (props: LinkedSectionContainerProps) => {
  const { label, children, linkTo } = props;

  const navigate = useNavigate();

  // 라벨 클릭 핸들러
  const handleLabelClick = useCallback(() => {
    navigate(linkTo || "#");
  }, [linkTo, navigate]);

  return (
    <SectionContainer>
      <Stack p={1} gap={1}>
        {/* 라벨 */}
        <ButtonBase
          onClick={handleLabelClick}
          sx={{
            width: "100%",
            p: 0.5,
            px: 1,
            borderRadius: 2,
            textAlign: "left",
          }}
        >
          <Stack direction="row" width="100%" alignItems="center">
            {typeof label === "string" ? (
              <Typography variant="h6" flex={1}>
                {label}
              </Typography>
            ) : (
              label
            )}
            <NavigateNextOutlinedIcon />
          </Stack>
        </ButtonBase>

        {/* 버튼 그룹 */}
        {children}
      </Stack>
    </SectionContainer>
  );
};

export default LinkedSectionContainer;
