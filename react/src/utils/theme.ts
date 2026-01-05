import {
  createTheme,
  responsiveFontSizes,
  type PaletteMode,
} from "@mui/material";

// 공통 팔레트 값
const commonPalette = {
  primary: {
    main: "#4880EE",
  },
  text: {
    primary: "#313C4A",
    secondary: "#B0B8C1",
  },
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

// 공통 컴포넌트 스타일
const getComponents = (mode: PaletteMode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === "dark" ? "#18181A" : "#FEFEFE",
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
    },
    styleOverrides: {
      tooltip: {
        fontSize: "0.9rem",
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
      },
    },
  },
});

// 라이트 테마 생성
export const createLightTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "light",
        ...commonPalette,
      },
      typography,
      components: getComponents("light"),
    })
  );

// 다크 테마 생성 (VS Code Dark Modern 기반)
export const createDarkTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "dark",
        ...commonPalette,
      },
      typography,
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
