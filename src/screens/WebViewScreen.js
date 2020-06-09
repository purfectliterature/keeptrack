import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Button } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";

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

    const injectors = {
        locationObjectId: "location-text",
        locationNameToken: "SVELN",
        checkInObjectClass: "success-text",
        checkInMessageToken: "SVECI",
        delimiter: "#"
    };
    
    const getLocationNameFromWebView = `
        const wait = () => {
            window.setTimeout(() => {
                let element = document.getElementById("${injectors.locationObjectId}");
                if (element) {
                    window.ReactNativeWebView.postMessage("${injectors.locationNameToken + injectors.delimiter}" + element.innerHTML);
                } else {
                    wait();
                }
            }, 100);
        };

        wait();
    `;

    const verifyCheckInFromWebView = `
        const wait = () => {
            window.setTimeout(() => {
                let element2 = document.getElementsByClassName("${injectors.checkInObjectClass}");
                if (element2.length === 1) {
                    window.ReactNativeWebView.postMessage("${injectors.checkInMessageToken + injectors.delimiter}" + element2[0].innerHTML);
                } else {
                    wait();
                }
            }, 100);
        };

        wait();
    `;
   

    return (
        <View style={styles.screen}>
            <Header title={locationName} renderRightFragment={renderRightFragment} renderLeftFragment={renderLeftFragment} />

            <WebView
                ref={ref => (webRef = ref)}
                source={{ uri: params.url }}
                onLoadEnd={() => {
                    if (locationName === "") {
                        webRef.injectJavaScript(getLocationNameFromWebView);
                    }

                    if (checkedIn === null) {
                        webRef.injectJavaScript(verifyCheckInFromWebView);
                    }
                    setLoading(false);
                }}
                onLoadProgress={() => setLoading(true)}
                onNavigationStateChange={(state) => console.log(state.url)}
                onMessage={({ nativeEvent: { data }}) => {
                    const message = data.split(injectors.delimiter);
                    const token = message[0];
                    const payload = message[1];
                    switch (token) {
                        case injectors.locationNameToken:
                            setLocationName(payload);
                            break;
                        case injectors.checkInMessageToken:
                            if (payload.includes("in")) {
                                setCheckedIn(true);
                            } else if (payload.includes("out")) {
                                setCheckedIn(false);
                            }
                            break;
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