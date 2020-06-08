import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableHighlight } from "react-native";
import Modal, { ModalContent } from "react-native-modals";
import Icon from "react-native-vector-icons/MaterialIcons";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import InterText from "./InterText";

export default (props) => {
    const { location, checkedIn, lastVisited, url } = props.item;

    const menu = [
        {
            id: "open",
            caption: Strings.openURL,
            onPress: () => alert("hello"),
            icon: <Icon name="arrow-forward" size={Dimens.glyphSize} />
        },
        {
            id: "rescan",
            caption: Strings.rescanQR,
            onPress: () => alert("hello"),
            icon: <Icon name="filter-center-focus" size={Dimens.glyphSize} />
        },
        {
            id: "rename",
            caption: Strings.rename,
            onPress: () => alert("hello"),
            icon: <Icon name="create" size={Dimens.glyphSize} />
        },
        {
            id: "delete",
            caption: Strings.deleteLocation,
            onPress: () => alert("hello"),
            icon: <Icon name="delete" size={Dimens.glyphSize} color="red" />,
            captionColor: "red"
        }
    ];

    const renderMenuItem = ({ item, index, separator }) => (
        <TouchableHighlight 
            underlayColor={Colors.black}
            activeOpacity={0.95}
            onPress={item.onPress}
        ><View style={styles.menuItem}>
            <View style={{width: 50}}>{item.icon}</View>
            <InterText size={17} numberOfLines={2} color={item.captionColor ? item.captionColor : Colors.black}>{item.caption}</InterText>
        </View></TouchableHighlight>
    );

    return (
        <Modal
            visible={props.visible}
            modalTitle={
                <View style={styles.header}>
                    <View style={{flex: 1}}>
                        <InterText flavor="semibold" size={Dimens.fontSizeLarge} numberOfLines={3}>{location}</InterText>
                    </View>

                    {checkedIn ?
                        <View style={{width: 100, flexDirection: "row", justifyContent: "flex-end"}}>
                            <InterText flavor="semibold" size={15} color={Colors.secondaryLighter} numberOfLines={1}>{Strings.checkedIn}</InterText>
                        </View>
                    : null}
                </View>
            }
            width={Dimensions.get("window").width - 70}
            onTouchOutside={props.onTouchOutside}
            modalStyle={styles.modal}
        >
            <ModalContent style={styles.content}>
                <FlatList
                    data={menu}
                    renderItem={renderMenuItem}
                />
            </ModalContent>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        borderRadius: 15,
        backgroundColor: Colors.white,
        overflow: "visible",
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.4,
        shadowRadius: 50.00,
        
        elevation: 40,
    },

    header: {
        //backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    
    content: {
        paddingHorizontal: 0,
        paddingBottom: 15
    },

    headerFragment: {
        flex: 1,
        height: "100%"
    },
    
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        height: 50,
        paddingHorizontal: 25
    }
});