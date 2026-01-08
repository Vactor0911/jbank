import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionContainerProps {
  label: string;
  children?: ReactNode;
}

const SectionContainer = (props: SectionContainerProps) => {
  const { label, children } = props;

  return (
    <Stack gap={1}>
      {/* 헤더 */}
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>

      {/* 내용 */}
      {children}
    </Stack>
  );
};

export default SectionContainer;
