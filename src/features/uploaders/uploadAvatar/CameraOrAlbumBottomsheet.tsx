import React, { useRef, FC, useEffect } from "react";
import BasicBottomSheet from "../../../components/BottomSheet/BasicBottomSheet.tsx";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import { styles as s } from "./style.ts";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUploadAvatar } from "./useUploadAvatar.ts";

interface CameraOrAlbumBottomsheetProps {
  open: boolean;
  onDismiss: () => void;
}

export const CameraOrAlbumBottomsheet: FC<CameraOrAlbumBottomsheetProps> = (
  props,
) => {
  const { open, onDismiss } = props;

  const {
    operations: { pickPhotoAndUploadAvatar, takePhotoAndUploadAvatar },
  } = useUploadAvatar();

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
        onPress={pickPhotoAndUploadAvatar}
        icon={<FontAwesome6 name="images" size={20} color="black" />}
        labelStyle={s.labelContainerStyle}
        iconContainerStyle={s.iconContainerStyle}
        label={"Choose photo from your library"}
      />
      <MenuActionButton
        onPress={takePhotoAndUploadAvatar}
        icon={<FontAwesome6 name="camera" size={20} color="black" />}
        labelStyle={s.labelContainerStyle}
        iconContainerStyle={s.iconContainerStyle}
        label={"Take a photo with your camera"}
      />
    </BasicBottomSheet>
  );
};
