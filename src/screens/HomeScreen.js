import React, { useState } from 'react';
import { StyleSheet, View, SectionList } from "react-native";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";
import data from "../constants/demo-data";

import Header from "../components/Header";
import TextBox from "../components/TextBox";
import ListItem from "../components/ListItem";
import InterText from '../components/InterText';
import LocationModal from "../components/LocationModal";

export default (props) => {
    const [locationMenuItem, setLocationMenuItem] = useState({ });
    const [locationMenuVisible, setLocationMenuVisible] = useState(false);

    const handleLocationMenu = (item) => {
        setLocationMenuItem(item);
        setLocationMenuVisible(true);
    };

    const renderListSectionHeader = ({ section: { title } }) => (
        <InterText flavor="semibold" size={15} style={styles.listSectionHeader}>{title}</InterText>
    );

    const renderListItem = ({ item, index, section, separators }) => (
        <ListItem item={item} onLongPress={() => handleLocationMenu(item)} />
    );

    const sectionData = (data) => {
        const checkedInLocations = data.filter(item => item.checkedIn);
        const pinnedLocations = data.filter(item => !item.checkedIn).filter(item => item.pinned);
        const otherLocations = data.filter(item => !item.checkedIn && !item.pinned);
        const arrayToDisplay = [];

        if (checkedInLocations.length > 0) {
            arrayToDisplay.push({
                title: Strings.checkedInPlaces,
                data: checkedInLocations
            });
        }
        
        if (pinnedLocations.length > 0) {
            arrayToDisplay.push({
                title: Strings.pinnedLocations,
                data: pinnedLocations
            });
        }

        if (otherLocations.length > 0) {
            arrayToDisplay.push({
                title: Strings.yourLocations,
                data: otherLocations
            });
        }

        return arrayToDisplay;
    };

    return (
        <View style={styles.screen}>
            <Header title={Strings.appName} />

            <LocationModal visible={locationMenuVisible} item={locationMenuItem} onTouchOutside={() => setLocationMenuVisible(false)}/>

            <View style={styles.container}>
                <TextBox placeholder={Strings.searchHere} style={styles.searchBox} />

                <SectionList
                    sections={sectionData(data)}
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