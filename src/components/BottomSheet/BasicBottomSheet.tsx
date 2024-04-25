import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  BottomSheetMethods,
  BottomSheetModalMethods,
} from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface BasicBottomSheetProps {
  children: React.ReactNode;
  _snapPoints: string[];
  detached?: boolean;
  bottomInset?: number;
  handleOnChange?: (index: number) => void;
  style?: any;
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
    } = props;
    const snapPoints = useMemo(() => [..._snapPoints], []);

    return (
      <BottomSheetModal
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
