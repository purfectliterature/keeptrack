import React from 'react';
import { StyleSheet, View, SectionList, Button } from "react-native";

export default (props) => {
    return (
        <View style={styles.screen}>
            <WebView source={{ uri: props.url }} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1
    }
});