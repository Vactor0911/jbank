import { Zoom as MuiZoom, type ZoomProps as MuiZoomProps } from "@mui/material";
import { useEffect, useState } from "react";

const Zoom = (props: MuiZoomProps) => {
  const [isIconVisible, setIsIconVisible] = useState(false);

  // 컴포넌트 로드 시 아이콘 표시
  useEffect(() => {
    // 0.25초 후 아이콘 표시
    const timer = setTimeout(() => {
      setIsIconVisible(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MuiZoom
      in={isIconVisible}
      easing={{
        enter: "cubic-bezier(0, 1.5, 0.75, 1)",
        exit: "linear",
      }}
      timeout={200}
    >
      {props.children}
    </MuiZoom>
  );
};

export default Zoom;
