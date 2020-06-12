import React, { useState } from 'react';
import { StyleSheet, View, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicon from "react-native-vector-icons/Octicons";
import moment from "moment";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import InterText from "./InterText";

export default (props) => {
    const { location, checkedIn, pinned, lastVisited, url } = props.item;

    const renderSubcaption = () => {
        if (checkedIn) {
            return <InterText color={Colors.safeEntryGreen} size={15} numberOfLines={1}>{Strings.checkedIn} {moment(lastVisited).format("ddd MMM D, YYYY, H:m")}</InterText>
        } else {
            return <InterText color={Colors.grey3} size={15} numberOfLines={1}>{Strings.lastVisited} {moment(lastVisited).format("ddd MMM D, YYYY, H:m")}</InterText>
        }
    };
    
    const renderIcon = () => {
        if (checkedIn) {
            return <MaterialIcon name="exit-run" size={Dimens.glyphSize} color={Colors.safeEntryBlue} />
        } else {
            return <Icon name="arrow-forward" size={Dimens.glyphSize} color={Colors.primaryLighter} />
        }
    };

    return (
        <TouchableHighlight
            underlayColor={Colors.black}
            activeOpacity={0.95}
            onPress={() => requestAnimationFrame(props.onPress)}
            delayLongPress={100}
            onLongPress={props.onLongPress}
        ><View style={styles.listItem}>
            <View style={styles.leftFragment}>
                <InterText flavor="medium" size={17} numberOfLines={1}>{location}</InterText>
                {renderSubcaption()}
            </View>

            <View style={styles.rightFragment}>
                {pinned ? <Octicon name="pin" size={20} color={Colors.grey3} style={{marginRight: 10}} /> : null}
                {renderIcon()}
            </View>
        </View></TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: Colors.white,
        paddingHorizontal: 30,
        height: 70,
        flexDirection: "row"
    },

    leftFragment: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },

    rightFragment: {
        marginLeft: 10,
        flexDirection: "row",
        //backgroundColor: "red",
        justifyContent: "flex-end",
        alignItems: "center"
    }
});