import React, { FC, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { styles as s } from "./style.ts";
import { FontAwesome } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";

interface PhotoToUploadProps {
  photoData: ImagePickerAsset;
  handleRemovePhoto: (uri: string) => void;
  handleShowImageGallery: () => void;
  handleInitialGalleryIndex: (index: number) => void;
}

export const PhotoToUpload: FC<PhotoToUploadProps> = (props) => {
  const {
    photoData,
    handleRemovePhoto,
    handleShowImageGallery,
    handleInitialGalleryIndex,
  } = props;

  const [thumbnailUri, setThumbnailUri] = useState<string>(null);

  useEffect(() => {
    getImageUri();
  }, [photoData]);

  const handleOnPress = () => {
    handleInitialGalleryIndex(photoData.index);
    handleShowImageGallery();
  };

  const generateThumbnail = async (fileName) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(fileName, {
        time: 0,
      });
      return uri;
    } catch (e) {
      console.error(e);
    }
  };

  const getImageUri = async () => {
    if (photoData.type === "image") {
      setThumbnailUri("data:image/jpeg;base64," + photoData.base64);
    }

    if (photoData.type === "video") {
      const uri = await generateThumbnail(photoData.uri);
      setThumbnailUri(uri);
    }
  };

  const renderAssetIcon = () => {
    return (
      <View style={s.assetIcon}>
        {photoData.type === "video" ? (
          <FontAwesome name="video-camera" size={16} color="#1f30fb" />
        ) : (
          <FontAwesome name="image" size={16} color="#1f30fb" />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <Image
        style={s.image}
        imageStyle={s.image}
        source={{ uri: thumbnailUri }}
      />
      {renderAssetIcon()}
      <TouchableOpacity
        style={s.removeButton}
        onPress={() => handleRemovePhoto(photoData.uri)}
      >
        <FontAwesome name="remove" size={14} color="#ff0074" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
