import React, { FC, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { styles as s } from "./style.ts";
import { PhotoToUpload } from "./PhotoToUpload.tsx";
import BasicText from "../../../components/Text/BasicText.tsx";
import { Entypo } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";
import { ImageGalleryModal } from "./ImageGalleryModal.tsx";

interface PhotosToUploadGalleryProps {
  photos: ImagePickerAsset[];
  handleRemovePhoto: (uri: string) => void;
}

export const PhotosToUploadGallery: FC<PhotosToUploadGalleryProps> = (
  props,
) => {
  const { photos, handleRemovePhoto } = props;

  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState<number>(0);

  const handleShowImageGallery = () => {
    setShowImageGallery(true);
  };

  const photosToUpload = useMemo(() => {
    return photos.map((photo) => (
      <PhotoToUpload
        photoData={photo}
        handleRemovePhoto={handleRemovePhoto}
        handleShowImageGallery={handleShowImageGallery}
        handleInitialGalleryIndex={setInitialGalleryIndex}
      />
    ));
  }, [
    photos,
    handleRemovePhoto,
    handleShowImageGallery,
    setInitialGalleryIndex,
  ]);

  return (
    <View>
      {photos.length > 0 && (
        <View style={s.galleryTitleContainer}>
          <Entypo name="attachment" size={14} color="grey" />
          <BasicText style={s.galleryTitle}>Attachments</BasicText>
        </View>
      )}

      <ScrollView horizontal style={s.container}>
        {photosToUpload}
      </ScrollView>

      <ImageGalleryModal
        initialIndex={initialGalleryIndex}
        photos={photos}
        open={showImageGallery}
        onDismiss={() => setShowImageGallery(false)}
      />
    </View>
  );
};
