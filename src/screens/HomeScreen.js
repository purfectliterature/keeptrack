import React, { useState } from 'react';
import { StyleSheet, View, SectionList, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import Header from "../components/Header";
import TextBox from "../components/TextBox";
import ListItem from "../components/ListItem";
import InterText from '../components/InterText';
import LocationModal from "../components/LocationModal";

import {
    getCheckedInLocations,
    getPinnedNotCheckedInLocations,
    getNotPinnedNotCheckedInLocations
} from "../store/locations";

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

    const fetchLocations = () => {
        const checkedInLocations = useSelector(getCheckedInLocations);
        const pinnedLocations = useSelector(getPinnedNotCheckedInLocations);
        const otherLocations = useSelector(getNotPinnedNotCheckedInLocations);
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

            <LocationModal
                visible={locationMenuVisible}
                item={locationMenuItem}
                dismissMe={() => setLocationMenuVisible(false)}
            />

            <View style={styles.container}>
                <TextBox placeholder={Strings.searchHere} style={styles.searchBox} />

                <SectionList
                    sections={fetchLocations()}
                    keyExtractor={item => item.id}
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