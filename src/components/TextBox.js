import React from 'react';
import { StyleSheet, TextInput } from "react-native";

import Colors from '../constants/colors';
import Dimens from '../constants/dimens';

export default function TextBox(props) {
    return (
        <TextInput
            placeholderTextColor={Colors.grey4}
            multiline={false}
            selectionColor={Colors.secondaryLighter}
            {...props}
            style={{...styles.textInput, ...props.style}}
        />
    );
}

const styles = StyleSheet.create({
    textInput: {
        fontFamily: "inter-medium",
        fontSize: Dimens.textBoxTextSize,
        color: Colors.black,
        backgroundColor: Colors.grey2,
        paddingVertical: Dimens.textBoxPaddingVertical,
        paddingHorizontal: Dimens.textBoxPaddingHorizontal,
        borderRadius: Dimens.textBoxBorderRadius,
        height: 50
    }
});