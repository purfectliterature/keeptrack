import React from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";

export default (props) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}><View style={{
            ...styles.button,
            backgroundColor: props.color,
            shadowColor: props.color
        }}>
            {props.icon}
        </View></TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 90,
        height: 90,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        bottom: 25,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16.00,
        elevation: 25,
    }
});