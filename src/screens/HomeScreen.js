import React, { useState } from 'react';
import { StyleSheet, View, SectionList, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";
import data from "../constants/demo-data";

import Header from "../components/Header";
import TextBox from "../components/TextBox";
import ListItem from "../components/ListItem";
import InterText from '../components/InterText';
import LocationModal from "../components/LocationModal";

import {
    getCheckedInLocations,
    getPinnedNotCheckedInLocations,
    getNotPinnedNotCheckedInLocations,
    addLocation,
    getLocations
} from "../store/locations";

export default (props) => {
    const [locationMenuItem, setLocationMenuItem] = useState({ });
    const [locationMenuVisible, setLocationMenuVisible] = useState(false);

    const dispatch = useDispatch();

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
                data: checkedInLocations.sort((a, b) => {
                    if (a.pinned && b.pinned) return 0;
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                })
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

    const addClementiMall = () => {
        dispatch(addLocation("Clementi Mall Test", "aksfj", false));
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

                <Button title="Hello" onPress={addClementiMall} />

                <SectionList
                    sections={fetchLocations()}
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