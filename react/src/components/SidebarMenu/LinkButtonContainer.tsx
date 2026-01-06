import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface LinkButtonGroupProps {
  label?: string;
  children?: ReactNode;
}

const LinkButtonContainer = (props: LinkButtonGroupProps) => {
  const { label, children } = props;

  return (
    <Stack gap={0.5} my={1}>
      {/* 라벨 */}
      {label && (
        <Typography
          variant="body2"
          fontWeight={500}
          color="text.secondary"
          ml="12px"
          mb={1}
        >
          {label}
        </Typography>
      )}

      {/* 링크 버튼 */}
      {children}
    </Stack>
  );
};

export default LinkButtonContainer;
