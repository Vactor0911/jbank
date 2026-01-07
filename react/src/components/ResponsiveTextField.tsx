import {
  FormControl,
  Input,
  InputLabel,
  OutlinedInput,
  type InputProps,
} from "@mui/material";
import { useIsMobile } from "../hooks";
import { useAtomValue } from "jotai";
import { scrollContainerRefAtom } from "../states";

interface ResponsiveTextFieldProps extends InputProps {
  label?: string;
}

const ResponsiveTextField = (props: ResponsiveTextFieldProps) => {
  const { label, ...others } = props;

  const isMobile = useIsMobile();

  const scrollContainerRef = useAtomValue(scrollContainerRefAtom);

  // 포커스 시 화면 중앙으로 스크롤
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const containerElement = scrollContainerRef;
    if (containerElement) {
      const inputRect = inputElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();
      const offset =
        inputRect.top -
        containerRect.top -
        containerRect.height / 2 +
        inputRect.height / 2;
      containerElement.scrollBy({ top: offset, behavior: "smooth" });
    }
  };

  // 모바일용 스타일
  if (isMobile) {
    return (
      <FormControl variant="standard">
        <InputLabel>{label}</InputLabel>
        <Input {...others} onFocus={handleFocus} />
      </FormControl>
    );
  }

  // PC용 스타일
  return (
    <FormControl variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput label={label} onFocus={handleFocus} {...others} />
    </FormControl>
  );
};

export default ResponsiveTextField;
