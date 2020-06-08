import React from 'react';
import { StyleSheet, View, TouchableHighlight } from "react-native";

import Colors from "../constants/colors";

import InterText from "./InterText";

export default (props) => {
    return (
        <TouchableHighlight
            activeOpacity={0.9}
            underlayColor={Colors.black}
            onPress={props.onPress}
            style={{borderRadius: 100}}
        ><View style={styles.button}>
            <InterText flavor="semibold" size={17} color={Colors.white}>{props.caption}</InterText>
        </View></TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primaryLighter,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        shadowColor: Colors.primaryLighter,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    }
});