import React, { useState } from 'react';
import { StyleSheet, View, SectionList, TouchableHighlight } from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import Header from "../components/Header";
import InterText from "../components/InterText";
import Prompt from "../components/Prompt";

import {
    resetLocations
} from "../store/locations";

const renderListItem = ({ item, index, section, separators }) => (
    <TouchableHighlight activeOpacity={0.95} underlayColor={Colors.black} onPress={item.onPress}><View style={styles.menuItem}>
        <InterText size={17}>{item.label}</InterText>
    </View></TouchableHighlight>
);

const renderListSectionHeader = ({ section: { title } }) => (
    <InterText flavor="semibold" size={15} style={styles.listSectionHeader}>{title}</InterText>
);

export default (props) => {
    const dispatch = useDispatch();
    const [deleteLocationsPromptVisible, setDeleteLocationsPromptVisible] = useState(false);

    const settings = [
        {
            title: "Satu",
            data: [
                {
                    id: "resetLocations",
                    label: "Erase all locations",
                    onPress: () => setDeleteLocationsPromptVisible(true)
                },
                {
                    id: "resetApp",
                    label: "Reset application state",
                    onPress: () => alert("helo")
                },
            ]
        }
    ];

    return (
        <View style={styles.screen}>
            <Header title="Settings" />

            <Prompt
                visible={deleteLocationsPromptVisible}
                dismissMe={() => setDeleteLocationsPromptVisible(false)}
                title="Sure you want to erase all locations?"
                message="Once the locations are deleted, they cannot be retrieved ever again."
                onYes={() => {
                    dispatch(resetLocations());
                    setDeleteLocationsPromptVisible(false);
                }}
                onNo={() => setDeleteLocationsPromptVisible(false)}
                yesCaption="Delete"
                yesColor="red"
                noCaption="Cancel"
            />

            <View style={styles.container}>
                <SectionList
                    sections={settings}
                    renderItem={renderListItem}
                    renderSectionHeader={renderListSectionHeader}
                    ItemSeparatorComponent={
                        ({ highlighted, leadingItem }) => (
                            <View style={styles.menuItemSeparator}>
                                <View style={{backgroundColor: Colors.white, width: 30, height: 1}} />
                            </View>
                        )
                    }
                    ListFooterComponent={
                        <View style={{height: 100}} />
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.grey1
    },

    container: {
        flex: 1
    },

    menuItem: {
        height: 50,
        backgroundColor: Colors.white,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 30
    },

    listSectionHeader: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 30
    },

    menuItemSeparator: {
        height: 1,
        backgroundColor: Colors.grey1
    }
});