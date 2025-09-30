import { useMemo } from "react";

const useTouch = () => {
  const isTouch = useMemo(() => "ontouchstart" in window || navigator.maxTouchPoints > 0, []);
  return isTouch;
};

export default useTouch;
