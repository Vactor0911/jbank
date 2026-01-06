import { ButtonBase, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface LinkButtonProps {
  icon?: ReactNode;
  title: string;
}

const LinkButton = (props: LinkButtonProps) => {
  const { icon, title } = props;

  return (
    <ButtonBase
      sx={{
        p: "8px 12px",
        textAlign: "left",
        borderRadius: 2,
      }}
    >
      <Stack width="100%" direction="row" alignItems="center" gap={1}>
        {/* 아이콘 */}
        {icon}

        {/* 제목 */}
        <Typography flex={1} fontWeight={500}>
          {title}
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

export default LinkButton;
