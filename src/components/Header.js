import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Dimensions } from "react-native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import InterText from "../components/InterText";

export default (props) => {
    return (
        <SafeAreaView style={styles.safeAreaView}><View style={styles.header}>
            <StatusBar barStyle="dark-content" backgroundColor={"rgba(0,0,0,0)"} translucent={true} />
            {props.renderLeftFragment ? 
                <View style={{...styles.fragment, flex: 0.25, justifyContent: "flex-start"}}>
                    {props.renderLeftFragment()}
                </View>
            : null}

            <View style={{...styles.fragment, flex: 1, justifyContent: "center"}}>
                <InterText flavor="semibold" size={Dimens.fontSizeLarge} numberOfLines={1}>{props.title}</InterText>
            </View>
            
            {props.renderRightFragment ? 
                <View style={{...styles.fragment, flex: 0.25, justifyContent: "flex-end"}}>
                    {props.renderRightFragment()}
                </View>
            : null}
        </View></SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: Colors.grey1,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        height: Dimens.headerHeight,
        paddingHorizontal: Dimens.headerPaddingHorizontal
    },

    fragment: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%"
    }
});