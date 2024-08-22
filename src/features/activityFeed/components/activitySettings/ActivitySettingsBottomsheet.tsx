import React, { useRef, FC, useEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { styles as s } from "./style.ts";
import { FontAwesome6 } from "@expo/vector-icons";
import { MenuActionButton } from "../../../../components/Button/MenuActionButton.tsx";
import BasicBottomSheet from "../../../../components/BottomSheet/BasicBottomSheet.tsx";

interface ActivitySettingsBottomsheetProps {
  open: boolean;
  onDismiss: () => void;
  handleDeletePost: () => void;
}

export const ActivitySettingsBottomsheet: FC<
  ActivitySettingsBottomsheetProps
> = (props) => {
  const { open, onDismiss, handleDeletePost } = props;

  const bottomsheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (open) {
      bottomsheetRef.current.present();
    } else {
      bottomsheetRef.current.dismiss();
    }
  }, [open]);

  return (
    <BasicBottomSheet
      onDismiss={onDismiss}
      ref={bottomsheetRef}
      _snapPoints={["18%"]}
    >
      <MenuActionButton
        onPress={handleDeletePost}
        icon={<FontAwesome6 name="trash-can" size={20} color="red" />}
        labelStyle={s.labelContainerStyle}
        iconContainerStyle={s.iconContainerStyle}
        label={"Delete post"}
      />
    </BasicBottomSheet>
  );
};
