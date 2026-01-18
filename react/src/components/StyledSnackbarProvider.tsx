import { IconButton, useTheme } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";
import type { ReactNode } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const StyledSnackbarProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      action={(snackbarId) => (
        <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
          <CloseRoundedIcon />
        </IconButton>
      )}
      iconVariant={{
        success: <CheckCircleRoundedIcon fontSize="small" />,
        warning: <WarningRoundedIcon fontSize="small" />,
        error: <CancelRoundedIcon fontSize="small" />,
        info: <InfoRoundedIcon fontSize="small" />,
      }}
      css={{
        "&.notistack-MuiContent": {
          backgroundColor: theme.palette.text.secondary,
          borderRadius: "8px",
          color: theme.palette.secondary.main,
        },
        "&.notistack-MuiContent div#notistack-snackbar .MuiSvgIcon-root": {
          marginRight: "8px",
        },
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default StyledSnackbarProvider;
