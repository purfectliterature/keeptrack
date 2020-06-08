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
        <InterText size={17} color={item.disabled ? Colors.grey4 : Colors.black} numberOfLines={1}>{item.label}</InterText>
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
            title: "",
            data: [
                {
                    id: "showIntro",
                    label: Strings.showIntroductoryMessages,
                    onPress: () => {}
                },
                {
                    id: "openSafeEntry",
                    label: Strings.readMoreAboutSafeEntry,
                    onPress: () => {}
                }
            ]
        },
        {
            title: "",
            data: [
                {
                    id: "resetLocations",
                    label: Strings.eraseAllLocations,
                    onPress: () => setDeleteLocationsPromptVisible(true)
                },
                {
                    id: "resetApp",
                    label: Strings.resetApplication,
                    onPress: () => alert("helo")
                },
            ]
        },
        {
            title: Strings.developerOptions,
            data: [
                {
                    id: "loadDemoData",
                    label: Strings.loadDemoData,
                    onPress: () => alert("haha")
                },
                {
                    id: "addCustomLocation",
                    label: Strings.addCustomLocation,
                    onPress: () => alert("hahe")
                }
            ]
        },
        {
            title: Strings.userTestingOptions,
            data: [
                {
                    id: "feedback",
                    label: Strings.submitAFeedback,
                    onPress: () => alert("asjf")
                },
                {
                    id: "emailMe",
                    label: Strings.emailMe,
                    onPress: () => {}
                }
            ]
        }
    ];

    return (
        <View style={styles.screen}>
            <Header title={Strings.settings} />

            <Prompt
                visible={deleteLocationsPromptVisible}
                dismissMe={() => setDeleteLocationsPromptVisible(false)}
                title={Strings.areYouSureToDeleteAllLocations}
                message={Strings.onceDeletedCannotUndo}
                onYes={() => {
                    dispatch(resetLocations());
                    setDeleteLocationsPromptVisible(false);
                }}
                onNo={() => setDeleteLocationsPromptVisible(false)}
                yesCaption={Strings.delete}
                yesColor="red"
                noCaption={Strings.cancel}
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
                        <View style={{height: 100}}>
                            <InterText flavor="medium" size={14} style={styles.listSectionHeader} color={Colors.grey4}>
                                {Strings.settingsFooterText}
                            </InterText>
                        </View>
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