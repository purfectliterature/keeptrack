import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Button, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";

import Header from "../components/Header";
import InterText from "../components/InterText";
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
    checkInLocation,
    checkOutLocation,
    visitLocation
} from "../store/locations";

export default (props) => {
    const { navigation, route: { params } } = props;
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("");
    const [checkedIn, setCheckedIn] = useState(null);
    const dispatch = useDispatch();

    const handleDone = () => {
        if (checkedIn !== null) {
            if (checkedIn === false) {
                dispatch(checkOutLocation(params.id));
            } else {
                dispatch(checkInLocation(params.id));
            }
            dispatch(visitLocation(params.id));
        }
        navigation.goBack()
    };

    useFocusEffect(React.useCallback(() => {
        const onBackPress = () => {
            handleDone();
            return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }), []);

    const renderLeftFragment = () => (
        <ActivityIndicator size={Dimens.glyphSize} color={Colors.secondaryLighter} animating={loading} />
    );

    const renderRightFragment = () => (
        <TouchableOpacity onPress={handleDone}>
            <InterText flavor="medium" size={17} color={Colors.secondaryLighter}>
                {checkedIn === null ? "Cancel" : "Done"}
            </InterText>
        </TouchableOpacity>
    );

    let webRef = null;

    const injectionConfig = {
        locationTextObjectId: "location-text",
        locationNameToken: "SVELN",
        checkInObjectClassName: "success-text",
        checkInMessageToken: "SVECI",
        delimiter: "#"
    };

    const injectedGetLocation = `
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!mutation.addedNodes) return;

                mutation.addedNodes.forEach(node => {
                    let locationTextObject = document.getElementById("${injectionConfig.locationTextObjectId}");
                    if (locationTextObject) window.ReactNativeWebView.postMessage("${injectionConfig.locationNameToken + injectionConfig.delimiter}" + locationTextObject.innerHTML);
                });
            });
        }).observe(document.body, {subtree: true, childList: true});
    `;

    const injectedGetCheckInOut = `
        const wait = () => window.setTimeout(() => {
            let checkInObject = document.getElementsByClassName("${injectionConfig.checkInObjectClassName}");
            if (checkInObject.length === 1) {
                window.ReactNativeWebView.postMessage("${injectionConfig.checkInMessageToken + injectionConfig.delimiter}" + checkInObject[0].innerHTML);
            } else {
                wait();
            }
        }, 100);

        wait();
    `;

    return (
        <View style={styles.screen}>
            <Header title={locationName} renderRightFragment={renderRightFragment} renderLeftFragment={renderLeftFragment} />

            <WebView
                ref={ref => (webRef = ref)}
                source={{ uri: params.url }}
                onLoadEnd={() => {
                    webRef.injectJavaScript(injectedGetLocation);
                    setLoading(false);
                }}
                onLoadProgress={() => setLoading(true)}
                onNavigationStateChange={({ url }) => {
                    console.log(url);
                    if (url.includes("/complete/")) webRef.injectJavaScript(injectedGetCheckInOut)
                }}
                onMessage={({ nativeEvent: { data }}) => {
                    const message = data.split(injectionConfig.delimiter);
                    const token = message[0];
                    const payload = message[1];
                    switch (token) {
                        case injectionConfig.locationNameToken:
                            setLocationName(payload);
                            break;
                        case injectionConfig.checkInMessageToken:
                            if (payload.includes("in")) {
                                setCheckedIn(true);
                            } else if (payload.includes("out")) {
                                setCheckedIn(false);
                            }
                            break;
                        default:
                            console.log(data);
                    }
                }}
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