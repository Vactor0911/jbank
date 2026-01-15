import {
  createTheme,
  responsiveFontSizes,
  type PaletteMode,
} from "@mui/material";

// 팔레트 스타일
const getPalette = (mode: PaletteMode) => {
  return {
    primary: {
      main: "#4880EE",
    },
    secondary: {
      main: mode === "light" ? "#ECEEF1" : "#2C2E33",
    },
    text: {
      primary: mode === "light" ? "#424E5E" : "#E4E6E9",
      secondary: mode === "light" ? "#677383" : "#A8B1BC",
    },
    warning: {
      main: "#F7D16C",
    },
    background: {
      default: mode === "light" ? "#F6F7F9" : "#18181A",
    },
  };
};

// 공통 타이포그래피
const typography = {
  fontFamily: ["Noto Sans KR", "sans-serif"].join(","),
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
};

// 공통 모양
const shape = {
  borderRadius: 4,
};

// 공통 컴포넌트 스타일
const getComponents = (mode: PaletteMode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === "dark" ? "#18181A" : "#F6F7F9",
        transition: "background-color 0.3s ease, color 0.3s ease",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderWidth: 1.2,
        borderRadius: "50px",
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
      enterTouchDelay: 0,
      leaveTouchDelay: 3000,
      disableFocusListener: true,
    },
    styleOverrides: {
      tooltip: {
        fontSize: "0.9rem",
        wordBreak: "keep-all" as const,
        textWrap: "pretty",
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        wordBreak: "keep-all" as const,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        transition: "background-color 0.3s ease",
        borderRadius: 2,
      },
    },
    defaultProps: {
      sx: {
        borderRadius: 2,
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      size: "small" as const,
    },
  },
  MuiAvatar: {
    defaultProps: {
      slotProps: {
        img: {
          draggable: false,
        },
      },
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: "wave" as const,
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
  },
});

// 라이트 테마 생성
export const createLightTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "light",
        ...getPalette("light"),
      },
      typography,
      shape,
      components: getComponents("light"),
    })
  );

// 다크 테마 생성 (VS Code Dark Modern 기반)
export const createDarkTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "dark",
        ...getPalette("dark"),
      },
      typography,
      shape,
      components: getComponents("dark"),
    })
  );

// 기본 내보내기 (라이트 테마) - 기존 코드 호환성 유지
export const theme = createTheme({
  colorSchemes: {
    light: createLightTheme(),
    dark: createDarkTheme(),
  },
});
