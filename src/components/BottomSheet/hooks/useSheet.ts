import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

export const useSheet = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const showModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return {
    bottomSheetModalRef,
    showModal,
  };
};
