import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SectionList } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import Header from "../components/Header";
import InterText from "../components/InterText";
import Button from "../components/Button";

export default (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const askForPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    // Wrap askForPermission() inside curly braces so that the Promise won't be returned
    useEffect(() => { askForPermission() }, []);

    const handleBarCodeScan = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    const renderBody = () => {
        if (hasPermission === true) {
            return (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
                    style={styles.barCodeScanner}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                />
            );
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
            {renderBody()}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1
    },

    container: {
        flex: 1,
        paddingTop: 20
    },

    barCodeScanner: {
        flex: 1
    },

    noPermissionWarning: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 50
    }
});