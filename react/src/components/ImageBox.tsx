import { Box, type BoxProps, Skeleton } from "@mui/material";
import { useState } from "react";

interface ImageBoxProps extends BoxProps {
  src: string | undefined;
  alt?: string;
}

const ImageBox = (props: ImageBoxProps) => {
  const { src, alt, sx, ...others } = props;

  const [loaded, setLoaded] = useState(false);

  if (!src || !loaded) {
    return (
      <>
        <Skeleton variant="rectangular" sx={sx} />
        <Box
          component="img"
          src={src}
          alt={alt}
          draggable={false}
          onLoad={() => setLoaded(true)}
          sx={{ display: "none", ...sx }}
        />
      </>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      draggable={false}
      sx={sx}
      {...others}
    />
  );
};

export default ImageBox;
