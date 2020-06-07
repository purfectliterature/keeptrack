import React from 'react';
import { StyleSheet, View, SectionList } from "react-native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import Header from "../components/Header";

export default (props) => {
    return (
        <View style={styles.screen}>
            <Header title="Scan" />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1
    }
});