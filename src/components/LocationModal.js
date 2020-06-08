import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableHighlight } from "react-native";
import Modal, { ModalContent } from "react-native-modals";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";
import Strings from "../constants/strings";

import InterText from "./InterText";

export default (props) => {
    const { id, location, checkedIn, pinned, lastVisited, url } = props.item;
    const rootDispatch = useDispatch();
    const dispatch = (actionCreator) => {
        rootDispatch(actionCreator);
        props.dismissMe();
    }

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
            id: "mark",
            toggled: true,
            toggleCriteria: checkedIn,  // render 1 if false, 2 if true
            caption1: Strings.markCheckedIn,
            caption2: Strings.markCheckedOut,
            onPress1: () => alert("Check in"),
            onPress2: () => alert("Check out"),
            icon1: <Icon name="check" size={Dimens.glyphSize} />,
            icon2: <MaterialIcon name="exit-run" size={Dimens.glyphSize} />
        },
        {
            id: "pin",
            toggled: true,
            toggleCriteria: pinned, // render 1 if false, 2 if true
            caption1: Strings.pinLocation,
            caption2: Strings.unpinLocation,
            onPress1: () => alert("pin"),
            onPress2: () => alert("unpin"),
            icon1: <MaterialIcon name="pin" size={Dimens.glyphSize} />,
            icon2: <MaterialIcon name="pin-off" size={Dimens.glyphSize} />
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

    const renderMenuItem = ({ item, index, separator }) => {
        if (item.toggled) {
            if (item.toggleCriteria) {
                return (
                    <TouchableHighlight 
                        underlayColor={Colors.black}
                        activeOpacity={0.95}
                        onPress={item.onPress2}
                    ><View style={styles.menuItem}>
                        <View style={{width: 50}}>{item.icon2}</View>
                        <InterText size={17} numberOfLines={2} color={item.captionColor2 ? item.captionColor2 : Colors.black}>{item.caption2}</InterText>
                    </View></TouchableHighlight>
                );
            } else {
                return (
                    <TouchableHighlight 
                        underlayColor={Colors.black}
                        activeOpacity={0.95}
                        onPress={item.onPress1}
                    ><View style={styles.menuItem}>
                        <View style={{width: 50}}>{item.icon1}</View>
                        <InterText size={17} numberOfLines={2} color={item.captionColor1 ? item.captionColor1 : Colors.black}>{item.caption1}</InterText>
                    </View></TouchableHighlight>
                );
            }
        } else {
            return (
                <TouchableHighlight 
                    underlayColor={Colors.black}
                    activeOpacity={0.95}
                    onPress={item.onPress}
                ><View style={styles.menuItem}>
                    <View style={{width: 50}}>{item.icon}</View>
                    <InterText size={17} numberOfLines={2} color={item.captionColor ? item.captionColor : Colors.black}>{item.caption}</InterText>
                </View></TouchableHighlight>
            );
        }
    };

    return (
        <Modal
            visible={props.visible}
            modalTitle={
                <View style={styles.header}>
                    <View style={{flex: 1}}>
                        <InterText flavor="semibold" size={Dimens.fontSizeLarge} numberOfLines={3}>{location}</InterText>
                    </View>

                    {checkedIn ?
                        <View style={{width: 40, flexDirection: "row", justifyContent: "flex-end", height: "100%"}}>
                            <Icon name="check" color={Colors.secondaryLighter} size={Dimens.glyphSize} />
                        </View>
                    : null}
                </View>
            }
            width={Dimensions.get("window").width - 70}
            onTouchOutside={props.dismissMe}
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