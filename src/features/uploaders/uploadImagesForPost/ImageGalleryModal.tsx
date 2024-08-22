import React, { FC, useEffect, useMemo, useRef } from "react";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BasicBottomSheet from "../../../components/BottomSheet/BasicBottomSheet.tsx";
import Gallery from "react-native-awesome-gallery";
import { AntDesign } from "@expo/vector-icons";
import { styles as s } from "./style.ts";
import { ImagePickerAsset } from "expo-image-picker";
import { Video } from "expo-av";
import { AssetDetail } from "../../activityFeed/components/postAsset/AssetLoader.tsx";

interface ImageGalleryModalProps {
  open: boolean;
  onDismiss: () => void;
  photos?: ImagePickerAsset[];
  assets?: AssetDetail[];
  initialIndex: number;
}

export const ImageGalleryModal: FC<ImageGalleryModalProps> = (props) => {
  const { open, onDismiss, photos, initialIndex, assets } = props;

  useEffect(() => {
    if (open) {
      bottomsheetRef.current.present();
    } else {
      bottomsheetRef.current.dismiss();
    }
  }, [open]);

  const bottomsheetRef = useRef<BottomSheetModal>(null);

  const photoURIs = useMemo(() => {
    if (!photos) return;
    return photos.map((photo) => {
      if (photo.type === "video") {
        return {
          type: "video",
          uri: photo.uri,
        };
      }

      if (photo.type === "image") {
        return {
          type: "image",
          uri: `data:image/jpeg;base64,${photo.base64}`,
        };
      }
    });
  }, [photos]);

  return (
    <BasicBottomSheet
      backgroundStyle={{ backgroundColor: "black" }}
      handleIndicatorStyle={{ display: "none" }}
      onDismiss={onDismiss}
      ref={bottomsheetRef}
      _snapPoints={["100%"]}
    >
      <View>
        <View style={s.imageGalleryModalCloseButton}>
          <TouchableOpacity
            onPress={() => {
              bottomsheetRef.current.dismiss();
            }}
          >
            <AntDesign name="closecircle" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Gallery
          initialIndex={initialIndex}
          data={photoURIs ?? assets}
          renderItem={(item) => {
            if (item.item.type === "video") {
              return (
                <View style={{ marginTop: 50, marginBottom: 50 }}>
                  <Video
                    useNativeControls
                    resizeMode={"cover"}
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    source={{ uri: item.item.uri }}
                  />
                </View>
              );
            }

            if (item.item.type === "image") {
              return (
                <ImageBackground
                  source={{ uri: item.item.uri }}
                  imageStyle={{ resizeMode: "contain" }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              );
            }
          }}
        />
      </View>
    </BasicBottomSheet>
  );
};
