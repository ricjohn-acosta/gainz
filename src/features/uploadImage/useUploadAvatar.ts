import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { supabase } from "../../services/supabase.ts";
import { decode } from "base64-arraybuffer";
import useProfileStore from "../../stores/profileStore.ts";

export const useUploadAvatar = () => {
  const {
    data: { me },
    operations: { reloadProfile },
  } = useProfileStore();

  const pickPhotoAndUploadAvatar = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        await uploadAvatar(result.assets[0].base64);
      }
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong changing your avatar");
      console.error(e);
    }
  };

  const takePhotoAndUploadAvatar = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      // Pick image
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        await uploadAvatar(result.assets[0].base64);
      }
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong changing your avatar");
      console.error(e);
    }
  };

  const uploadAvatar = async (base64Uri) => {
    try {
      // Create a unique filename
      const fileName = `${me.id}.jpg`;
      const fileBody = decode(base64Uri);

      // Upload image to Supabase storage
      const { error } = await supabase.storage
        .from("avatars") // Replace with your bucket name
        .upload(fileName, fileBody, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error || !me.id) {
        console.error("Error uploading image:", error.message);
      } else {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        const { error } = await supabase
          .from("profiles")
          .update({
            avatar_url: `${data.publicUrl}?time=${Date.now()}`,
          })
          .eq("id", me.id);

        if (error)
          Alert.alert("Oops!", "Something went wrong changing your avatar");

        reloadProfile();
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  return {
    operations: {
      pickPhotoAndUploadAvatar,
      takePhotoAndUploadAvatar,
    },
  };
};
