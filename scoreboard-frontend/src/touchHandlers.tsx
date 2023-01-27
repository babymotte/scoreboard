import React, { SyntheticEvent } from "react";

export default function useSwipe(
  onSwipeUp: () => void,
  onSwipeDown: () => void
) {
  const touchStartRef = React.useRef([0, 0]);
  return {
    onTouchStart: (e: SyntheticEvent) => {
      const touchEvent = e.nativeEvent as TouchEvent;
      touchStartRef.current[0] = touchEvent.touches[0].screenY;
      touchStartRef.current[1] = touchEvent.touches[0].screenY;
    },
    onTouchMove: (e: SyntheticEvent) => {
      const touchEvent = e.nativeEvent as TouchEvent;
      touchStartRef.current[1] = touchEvent.touches[0].screenY;
      console.log(touchStartRef.current[1]);
    },
    onTouchEnd: (e: SyntheticEvent) => {
      if (touchStartRef.current[1] - touchStartRef.current[0] > 10) {
        onSwipeDown();
      }
      if (touchStartRef.current[1] - touchStartRef.current[0] < 10) {
        onSwipeUp();
      }
      e.preventDefault();
    },
  };
}
