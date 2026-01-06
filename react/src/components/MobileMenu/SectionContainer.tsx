import { Paper, type PaperProps } from "@mui/material";

const SectionContainer = (props: PaperProps) => {
  const { children, ...others } = props;
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        boxShadow: `0px 3px 1px -2px rgba(0, 0, 0, 0.2),
          0px 2px 12px 0px rgba(0, 0, 0, 0.15),
          0px 1px 20px 0px rgba(0, 0, 0, 0.1);`,
      }}
      {...others}
    >
      {children}
    </Paper>
  );
};

export default SectionContainer;
