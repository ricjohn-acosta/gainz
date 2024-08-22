import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";

interface BasicBottomSheetProps {
  children: React.ReactNode;
  _snapPoints: string[];
  detached?: boolean;
  bottomInset?: number;
  handleOnChange?: (index: number) => void;
  style?: any;
  onDismiss?: any;
  enablePanDownToClose?: false;
  handleComponent?: any;
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
}

const BasicBottomSheet = forwardRef(
  (
    props: BasicBottomSheetProps,
    ref: React.MutableRefObject<BottomSheetModalMethods | any>,
  ) => {
    const {
      children,
      _snapPoints,
      detached,
      bottomInset,
      handleOnChange,
      style,
      onDismiss,
      enablePanDownToClose,
      handleIndicatorStyle,
      backgroundStyle
    } = props;
    const snapPoints = useMemo(() => [..._snapPoints], []);

    return (
      <BottomSheetModal
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        // handleComponent={() => handleComponent ?? null}
        keyboardBehavior={"interactive"}
        keyboardBlurBehavior={"restore"}
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose={enablePanDownToClose}
        // disable this in android bc weird shit happens
        enableContentPanningGesture={Platform.OS !== "android"}
        onDismiss={onDismiss}
        style={style}
        onChange={handleOnChange}
        detached={detached}
        bottomInset={bottomInset}
        ref={ref}
        index={0}
        snapPoints={snapPoints}
      >
        <View style={styles.container}>{children}</View>
      </BottomSheetModal>
    );
  },
);

export default BasicBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
