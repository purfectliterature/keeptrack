import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ToastAndroid, BackHandler, Platform, TouchableOpacity, Button } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";

import Header from "../components/Header";
import InterText from "../components/InterText";

import {
    checkInLocation,
    checkOutLocation,
    visitLocation,
    addLocation,
    getLocations,
    updateLocationUrl
} from "../store/locations";

export default (props) => {
    const { navigation, route: { params } } = props;
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("");
    const [checkedIn, setCheckedIn] = useState(null);
    const dispatch = useDispatch();
    const savedLocations = useSelector(getLocations);

    const dispatchCheckInOut = (id) => {
        if (checkedIn === false) {
            dispatch(checkOutLocation(id));
        } else {
            dispatch(checkInLocation(id));
        }
        dispatch(visitLocation(id));
    };

    const handleDone = () => {        
        switch (params.method) {
            case "list":
                // require id
                if (checkedIn !== null) {
                    dispatchCheckInOut(params.id);
                }
                break;
            case "new":
                if (checkedIn !== null) {
                    const locationWithSameUrl = savedLocations.filter(location => location.url === params.url);
                    if (locationWithSameUrl.length === 1) {
                        dispatchCheckInOut(locationWithSameUrl[0].id);
                    } else {
                        const locationWithSameActualName = savedLocations.filter(location => location.actualName === locationName);
                        if (locationWithSameActualName.length === 1) {
                            const locationWithSameActualNameId = locationWithSameActualName[0].id;
                            dispatch(updateLocationUrl(locationWithSameActualNameId, params.url));
                            if (Platform.OS === "android") {
                                ToastAndroid.show(`${params.location ? params.location : locationName}${Strings.safeEntryLinkUpdate}`, ToastAndroid.LONG);
                            }
                            dispatchCheckInOut(locationWithSameActualNameId);
                        } else {
                            dispatch(addLocation(locationName, params.url, checkedIn, false));
                        }
                    }
                }
                break;
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
            <InterText
                size={17}
                {...(checkedIn === null ? null : {flavor: "semibold"})}
                color={checkedIn === null ? Colors.primaryDarker : (checkedIn ? Colors.safeEntryGreen : Colors.safeEntryBlue)}>
                {checkedIn === null ? "Cancel" : "Done"}
            </InterText>
        </TouchableOpacity>
    );

    let webRef = null;

    const injectionConfig = {
        locationTextObjectId: "location-text",
        locationNameToken: "SVELN",
        checkInObjectClassName: "success-text",
        buildingNameObjectClassName: "building-name",
        checkInMessageToken: "SVECI",
        delimiter: "#"
    };

    const injectedJavaScript = `
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!mutation.addedNodes) return;

                mutation.addedNodes.forEach(node => {
                    let locationTextObject = document.getElementById("${injectionConfig.locationTextObjectId}");
                    if (locationTextObject) window.ReactNativeWebView.postMessage("${injectionConfig.locationNameToken + injectionConfig.delimiter}" + locationTextObject.innerHTML);

                    if (node.innerHTML.includes("success-text")) window.ReactNativeWebView.postMessage("${injectionConfig.checkInMessageToken + injectionConfig.delimiter}" + document.getElementsByClassName("${injectionConfig.checkInObjectClassName}")[0].innerHTML);
                    if (node.innerHTML.includes("building-name")) window.ReactNativeWebView.postMessage("${injectionConfig.locationNameToken + injectionConfig.delimiter}" + document.getElementsByClassName("${injectionConfig.buildingNameObjectClassName}")[0].innerHTML);
                });
            });
        }).observe(document.body, {subtree: true, childList: true});
    `;

    return (
        <View style={styles.screen}>
            <Header title={params.location ? params.location : locationName} renderRightFragment={renderRightFragment} renderLeftFragment={renderLeftFragment} />

            <WebView
                ref={ref => (webRef = ref)}
                source={{ uri: params.url }}
                onLoadEnd={() => {
                    webRef.injectJavaScript(injectedJavaScript);
                    setLoading(false);
                }}
                onLoadProgress={() => setLoading(true)}
                onMessage={({ nativeEvent: { data }}) => {
                    const message = data.split(injectionConfig.delimiter);
                    const token = message[0];
                    const payload = message[1];
                    switch (token) {
                        case injectionConfig.locationNameToken:
                            setLocationName(payload.trim());
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