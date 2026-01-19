import { Paper, Stack, Typography, type PaperProps } from "@mui/material";
import type { ReactNode } from "react";

export interface SectionProps extends PaperProps {
  label: ReactNode;
  dense?: boolean;
}

const Section = (props: SectionProps) => {
  const { label, dense, children, sx, ...others } = props;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: {
          xs: 2,
          md: 5,
        },
        boxShadow: {
          xs: `0px 3px 1px -2px rgba(0, 0, 0, 0.2),
              0px 2px 12px 0px rgba(0, 0, 0, 0.15),
              0px 1px 20px 0px rgba(0, 0, 0, 0.1);`,
          md: "inherit",
        },
        ...sx,
      }}
      {...others}
    >
      <Stack gap={dense ? 2 : 3} p={dense ? 2 : 3} flex={1}>
        {/* 헤더 */}
        {typeof label === "string" ? (
          <Typography variant="h6">{label}</Typography>
        ) : (
          label
        )}

        {/* 내용 */}
        {children}
      </Stack>
    </Paper>
  );
};

export default Section;
