import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";
import { useState } from "react";
import useProfileStore from "../../../stores/profileStore.ts";
import { supabase } from "../../../services/supabase.ts";
import * as FileSystem from "expo-file-system";

//TODO: Rename shit because this is used to upload videos as well lmao
export const useUploadPostImage = () => {
  const {
    data: { me },
    operations: { reloadProfile },
  } = useProfileStore();

  const [photos, setPhotos] = useState<ImagePickerAsset[]>([]);

  const addPhoto = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      // Pick an asset
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsMultipleSelection: true,
      });

      // Add an index to these assets
      if (!result.canceled) {
        if (photos.length >= 5) {
          Alert.alert(
            "Max file count exceeded!",
            "You may only attach 5 files in a post.",
          );
          return;
        }

        const mappedResults = result.assets.map((asset) => {
          asset.index = photos.length + 1 - 1;
          return asset;
        });

        setPhotos((prev) => [...prev, ...mappedResults]);
      }
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong uploading attachments");
      console.error(e);
    }
  };

  const removePhoto = (uri) => {
    // const filteredPhotos = photos.filter((photo) => photo.uri !== uri);
    const filteredPhotos = photos
      .map((photo, i) => {
        if (photo.uri !== uri) {
          photo.index = i === 0 ? 0 : i - 1;
          return photo;
        }

        return null;
      })
      .filter((item) => item !== null);

    setPhotos(filteredPhotos);
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const uploadAllAssets = async () => {
    try {
      const requests = photos.map((asset) => uploadAsset(asset));

      return await Promise.all(requests);
    } catch (e) {
      console.error(e);
      Alert.alert("Oops!", "Something went wrong uploading the assets!");
    }
  };

  const uploadAsset = async (asset: ImagePickerAsset) => {
    try {
      // Create a unique filename
      const fileType = asset.type;
      const fileExtension = asset.type === "image" ? "jpg" : "mp4";
      const fileName = `${me.id}-${Date.now()}.${fileExtension}`;
      const imagekitParams = fileType === "image" ? "?tr=h-500,w-500" : "";

      const fileBodyPromise =
        fileType === "image"
          ? Promise.resolve(decode(asset.base64))
          : FileSystem.readAsStringAsync(asset.uri, {
              encoding: "base64",
            }).then((base64) => decode(base64));

      return fileBodyPromise
        .then((fileBody) => {
          // Upload image to Supabase storage
          return supabase.storage
            .from("assets") // Replace with your bucket name
            .upload(fileName, fileBody, {
              contentType: fileType === "image" ? "image/jpeg" : "video/mp4",
            });
        })
        .then((res) => {
          if (res.error) {
            Alert.alert(
              "Oops!",
              "Something went wrong uploading an asset",
              res.error.message,
            );
            return null;
          }

          return {
            type: fileType,
            uri: `https://ik.imagekit.io/kapaii/assets/${fileName}${imagekitParams}`,
          };
        });
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  return {
    data: {
      photos,
    },
    operations: {
      addPhoto,
      removePhoto,
      clearPhotos,
      uploadAllAssets,
    },
  };
};
