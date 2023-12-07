import {StyleSheet, Text, View} from 'react-native';
import GymScreen from "./src/screens/GymScreen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from "@gorhom/bottom-sheet";
import React, {useCallback, useMemo, useRef} from "react";
import GymAvatarDetails from "./src/features/gym/components/GymAvatarDetails";

export default function App() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['96%'], []);
    const handleSheetChanges = useCallback((index: number) => {
    }, []);

    const openBottomSheet = () => {
        bottomSheetRef.current.expand()
    }
  return (
      <GestureHandlerRootView style={{flex: 1}}>
          <View style={styles.container}>
              <GymScreen openBottomSheet={openBottomSheet}/>
          </View>
          <BottomSheet
              index={-1}
              enablePanDownToClose
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
          >
              <GymAvatarDetails/>
          </BottomSheet>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
});
