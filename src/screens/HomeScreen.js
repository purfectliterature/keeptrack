import React, { useState } from 'react';
import { StyleSheet, View, SectionList, ToastAndroid, Platform, Keyboard } from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import Colors from "../constants/colors";
import Strings from "../constants/strings";

import Header from "../components/Header";
import TextBox from "../components/TextBox";
import ListItem from "../components/ListItem";
import InterText from '../components/InterText';
import LocationModal from "../components/LocationModal";

import {
    getCheckedInLocations,
    getPinnedNotCheckedInLocations,
    getNotPinnedNotCheckedInLocations,
    getLocations
} from "../store/locations";

const renderListSectionHeader = ({ section: { title, data } }) => (
    <InterText flavor="semibold" size={15} style={styles.listSectionHeader}>{`${title} (${data.length})`}</InterText>
);

export default (props) => {
    const [locationMenuItem, setLocationMenuItem] = useState({ });
    const [locationMenuVisible, setLocationMenuVisible] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const savedLocations = useSelector(getLocations);
    const checkedInLocations = useSelector(getCheckedInLocations);
    const pinnedLocations = useSelector(getPinnedNotCheckedInLocations);
    const otherLocations = useSelector(getNotPinnedNotCheckedInLocations);

    const fetchDisplayedLocations = () => {
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

    const fetchLocations = () => {
        if (searchKeyword === "") {
            return fetchDisplayedLocations();
        } else {
            return [{
                title: "Search results",
                data: savedLocations.filter(location => location.location.toLowerCase().includes(searchKeyword.toLowerCase()))
            }];
        }
    }

    const handleLocationMenu = (item) => {
        setLocationMenuItem(item);
        setLocationMenuVisible(true);
    };

    const handleRescanQrCode = (id, location) => {
        setLocationMenuVisible(false);
        props.navigation.navigate("Scanner", {
            method: "update",
            id,
            location
        });
    };

    const handleCheckInOut = (item) => {
        if (item.url === undefined || item.url === "") {
            return (Platform.OS === "android") ? ToastAndroid.show(Strings.warningNoUrl, ToastAndroid.LONG) : null;
        }

        if (item.id === undefined || item.id === "") {
            return (Platform.OS === "android") ? ToastAndroid.show(Strings.warningNoId, ToastAndroid.LONG) : null;
        }

        props.navigation.navigate("WebView", {
            method: "list",
            location: item.location,
            url: item.url,
            id: item.id
        });
    }

    const renderListItem = ({ item, index, section, separators }) => (
        <ListItem item={item} onLongPress={() => handleLocationMenu(item)} onPress={() => handleCheckInOut(item)}/>
    );

    return (
        <View style={styles.screen}>
            <Header title={Strings.appName} />

            <LocationModal
                visible={locationMenuVisible}
                item={locationMenuItem}
                dismissMe={() => setLocationMenuVisible(false)}
                navigator={props.navigation}
                onRescanQrCode={handleRescanQrCode}
            />

            <View style={styles.container}>
                <SectionList
                    sections={fetchLocations()}
                    keyExtractor={item => item.id}
                    renderItem={renderListItem}
                    renderSectionHeader={renderListSectionHeader}
                    ListEmptyComponent={
                        <View style={styles.emptyLocationsText}>
                            <Icon name="filter-center-focus" size={50} color={Colors.grey4} style={{marginBottom: 20}} />
                            <InterText flavor="medium" color={Colors.grey4} size={23} style={{textAlign: "center"}}>{Strings.scanToAddNewLocation}</InterText>
                        </View>
                    }
                    ListFooterComponent={
                        <View style={{height: 100}} />
                    }
                    ListHeaderComponent={
                        <TextBox
                            placeholder={Strings.searchHere}
                            style={styles.searchBox}
                            returnKeyType="search"
                            onChangeText={(text) => setSearchKeyword(text)}
                        />
                    }
                    keyboardShouldPersistTaps="always"
                    //keyboardDismissMode="on-drag" does not work as of RN 0.62
                    onScrollBeginDrag={Keyboard.dismiss}
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

    searchBox: {
        marginTop: 20,
        marginHorizontal: 30
    },

    listSectionHeader: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 30
    },
    
    emptyLocationsText: {
//        backgroundColor: "red",
        marginHorizontal: 50,
        marginTop: 40,
        alignItems: "center"
    }
});