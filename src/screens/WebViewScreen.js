import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";

import Header from "../components/Header";
import InterText from "../components/InterText";
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
    checkInLocation,
    checkOutLocation
} from "../store/locations";

export default (props) => {
    const { navigation, route: { params } } = props;
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const handleCheckInOut = () => {
        if (params.checkedIn) {
            dispatch(checkOutLocation(params.id));
        } else {
            dispatch(checkInLocation(params.id));
        }
        navigation.goBack()
    };

    const renderLeftFragment = () => (
        <ActivityIndicator size={Dimens.glyphSize} color={Colors.secondaryLighter} animating={loading} />
    );

    const renderRightFragment = () => (
        <TouchableOpacity onPress={handleCheckInOut}>
            <InterText flavor="medium" size={17} color={Colors.secondaryLighter}>Done</InterText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.screen}>
            <Header title={params.location} renderRightFragment={renderRightFragment} renderLeftFragment={renderLeftFragment} />

            <WebView
                source={{ uri: params.url }}
                onLoad={() => setLoading(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1
    }
});