import React from 'react';
import { StyleSheet, View, SectionList } from "react-native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";
import sampleData from "../constants/demo-data";

import Header from "../components/Header";
import TextBox from "../components/TextBox";
import ListItem from "../components/ListItem";
import InterText from '../components/InterText';

export default (props) => {
    const renderListSectionHeader = ({ section: { title } }) => (
        <InterText flavor="medium" size={15} style={styles.listSectionHeader}>{title}</InterText>
    );

    const renderListItem = ({ item, index, section, separators }) => (
        <ListItem item={item} />
    );

    const sampleSectionedData = (data) => {
        const checkedInLocations = data.filter(item => item.checkedIn);
        if (checkedInLocations.length > 0) {
            return [
                {
                    title: Strings.checkedInPlaces,
                    data: checkedInLocations
                },
                {
                    title: Strings.yourLocations,
                    data: data.filter(item => !item.checkedIn)
                }
            ];
        } else {
            return [
                {
                    title: Strings.yourLocations,
                    data: data.filter(item => !item.checkedIn)
                }
            ]
        }
    };

    return (
        <View style={styles.screen}>
            <Header title={Strings.appName} />

            <View style={styles.container}>
                <TextBox placeholder={Strings.searchHere} style={styles.searchBox} />

                <SectionList
                    sections={sampleSectionedData(sampleData)}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderListItem}
                    renderSectionHeader={renderListSectionHeader}
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
        flex: 1,
        paddingTop: 20
    },

    searchBox: {
        marginHorizontal: 30
    },

    listSectionHeader: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 30
    }
});