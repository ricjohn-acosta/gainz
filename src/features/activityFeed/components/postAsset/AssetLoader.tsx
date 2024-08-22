import React, { FC, useCallback, useRef, useState, useEffect } from "react";
import { Image, ListRenderItem, TouchableOpacity, View } from "react-native";
import { styles as s } from "./style.ts";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import { Video } from "expo-av";
import { ImageGalleryModal } from "../../../uploaders/uploadImagesForPost/ImageGalleryModal.tsx";
import { supabase } from "../../../../services/supabase.ts";
import assets from "../../../../../assets/index.ts";

export type AssetDetail = {
  type: string;
  uri: string;
};

interface AssetLoaderProps {
  postId: string;
}

export const AssetLoader: FC<AssetLoaderProps> = (props) => {
  const { postId } = props;

  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [assetUri, setAssetUri] = useState<any>(null);

  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);
  const videoRef = useRef<any>(null);

  const isMultipleAssets = assetUri && assetUri.length > 1;

  useEffect(() => {
    if (!postId) return;
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("post_id", postId);

    setAssetUri(data[0].media);
  };

  const renderItem: ListRenderItem<AssetDetail> = useCallback(
    ({ item: asset }) => {
      if (asset.type === "video") {
        return (
          <View>
            <Video
              posterSource={assets.placeholderVideo}
              ref={videoRef}
              isLooping
              useNativeControls
              resizeMode={"contain"}
              source={{ uri: asset.uri }}
              style={{ width: 300, height: 300 }}
            />
          </View>
        );
      }

      if (asset.type === "image") {
        return (
          <View>
            <Image
              style={{ width: 300, height: 300 }}
              source={{ uri: asset.uri }}
            />
          </View>
        );
      }
    },
    [postId, assetUri],
  );

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  if (!assetUri) return null;

  return (
    <View style={s.container}>
      <TouchableOpacity
        style={s.multipleAssetsIndicator}
        onPress={() => setShowImageGallery(true)}
      >
        <FontAwesome6 name="expand" size={16} color="#1f30fb" />
      </TouchableOpacity>
      <Carousel
        enabled={isMultipleAssets}
        ref={ref}
        loop={false}
        width={300}
        data={assetUri ?? []}
        renderItem={renderItem}
        pagingEnabled
        onProgressChange={progress}
      />
      {isMultipleAssets && (
        <View style={s.paginationContainer}>
          <Pagination.Basic
            progress={progress}
            data={[...assetUri]}
            dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 25 }}
            activeDotStyle={{ backgroundColor: "#f2f4ff" }}
            containerStyle={{ gap: 5, marginBottom: 10 }}
            onPress={onPressPagination}
          />
        </View>
      )}
      <ImageGalleryModal
        open={showImageGallery}
        onDismiss={() => setShowImageGallery(false)}
        assets={assetUri}
        initialIndex={0}
      />
    </View>
  );
};
