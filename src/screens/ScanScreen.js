import React, { useState, useEffect } from 'react';
import { StyleSheet, View, BackHandler, Dimensions, StatusBar, TouchableOpacity, ToastAndroid } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import Header from "../components/Header";
import Button from "../components/Button";
import InterText from "../components/InterText";

import {
    getLocations,
    updateLocationUrl
} from "../store/locations";

export default (props) => {
    const { navigation, route: { params } } = props;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [headerText, setHeaderText] = useState(Strings.pointYourCameraToScan);
    const dispatch = useDispatch();
    const savedLocations = useSelector(getLocations);

    const askForPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    // Wrap askForPermission() inside curly braces so that the Promise won't be returned
    useEffect(() => { askForPermission(); }, []);

    const handleBarCodeScan = ({ type, data }) => {
        setScanned(true);
        
        if (data.includes("temperaturepass.ndi-api.gov.sg") || data.includes("safeentry-qr.gov.sg") || data.toLowerCase().includes("safeentry")) {
            navigation.goBack();
            switch (params.method) {
                case "new":
                    navigation.navigate("WebView", {
                        method: params.method,
                        url: data
                    });
                    break;
                case "update":
                    const locationWithSameUrl = savedLocations.filter(location => location.url === data);
                    if (locationWithSameUrl.length === 1) {
                        if (Platform.OS === "android") {
                            ToastAndroid.show(`Existing location (${locationWithSameUrl[0].location})'s found. ${params.location}'s link was not updated`, ToastAndroid.LONG);
                        }
                    } else {
                        dispatch(updateLocationUrl(params.id, data));
                        if (Platform.OS === "android") {
                            ToastAndroid.show(`${params.location}${Strings.safeEntryLinkUpdate}`, ToastAndroid.LONG);
                        }
                    }
                    break;
            }
        } else {
            setHeaderText("Please scan a valid SafeEntry QR code");
            setScanned(false);
        }
    };

    const handleGoBack = () => {
        setFlashOn(false);
        navigation.goBack();
    };

    useFocusEffect(React.useCallback(() => {
        const onBackPress = () => {
            handleGoBack();
            return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }), []);

    const renderBody = () => {
        if (hasPermission === true) {
            return (<>
                <Camera
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
                    style={styles.camera}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                    }}
                    flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
                    ratio="4:3"
                />

                <View style={styles.cameraTop}>
                    <InterText flavor="medium" color={Colors.white} size={17} style={{textAlign: "center"}}>{headerText}</InterText>
                </View>

                <View style={styles.cameraBottom}>
                    <TouchableOpacity onPress={handleGoBack}><Icon name="close" size={50} color={Colors.white} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => setFlashOn(!flashOn)}><Icon name={flashOn ? "flash-on" : "flash-off"} size={50} color={Colors.white} /></TouchableOpacity>
                </View>
            </>);
        } else if (hasPermission === false) {
            return (
                <View style={styles.noPermissionWarning}>
                    <MaterialIcon name="camera-off" size={50}/>
                    <InterText flavor="semibold" size={23} style={{marginBottom: 20}}>{Strings.cannotAccessCamera}</InterText>
                    <InterText size={17} style={{textAlign: "center", marginBottom: 20}}>{Strings.youNeedToAllowPermission}</InterText>
                    <Button caption={Strings.grantAccess} onPress={askForPermission} />
                </View>
            );
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="rgba(0,0,0,0.2)" />
            {renderBody()}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1,
        justifyContent: "center",
        alignItems: "center"
    },

    container: {
        flex: 1,
        paddingTop: 20
    },

    camera: {
        width: Dimensions.get("screen").height * 3 / 4,
        height: Dimensions.get("screen").height
    },

    noPermissionWarning: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 50
    },

    cameraTop: {
        width: Dimensions.get("window").width,
        height: 120,
        position: "absolute",
        top: 0,
        backgroundColor: "rgba(0,0,0,0)",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 30
    },

    cameraBottom: {
        width: Dimensions.get("window").width,
        height: 120,
        position: "absolute",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0)",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "row"
    }
});