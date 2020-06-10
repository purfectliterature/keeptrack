import React from 'react';
import { StyleSheet, View, Dimensions, TouchableHighlight } from "react-native";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";

import InterText from "./InterText";

export default (props) => {
    return (
        <Modal
            visible={props.visible}
            modalTitle={
                <View style={styles.header}>
                    <InterText flavor="semibold" size={Dimens.fontSizeLarge} numberOfLines={3}>{props.title}</InterText>
                </View>
            }
            width={Dimensions.get("window").width - 70}
            onTouchOutside={props.dismissMe}
            modalStyle={styles.modal}
            modalAnimation={new SlideAnimation({
                initialValue: 10,
                slideFrom: "top",
                useNativeDriver: true
            })}
            onHardwareBackPress={() => {props.dismissMe(); return true;}}
        >
            <ModalContent style={styles.content}>
                {props.message ? 
                    <View style={styles.message}>
                        <InterText size={17}>{props.message}</InterText>
                    </View>
                : null}

                <View style={styles.buttons}>
                    <TouchableHighlight
                        underlayColor={Colors.black}
                        activeOpacity={0.95}
                        onPress={props.onYes}
                        style={{
                            ...styles.touchableButton,
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: props.noCaption ? 0 : 15
                        }}
                    ><View style={{
                        ...styles.button,
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: props.noCaption ? 0 : 15
                    }}>
                        <InterText flavor="medium" size={17} color={props.yesColor ? props.yesColor : Colors.black}>{props.yesCaption}</InterText>
                    </View></TouchableHighlight>

                    {props.noCaption ? 
                        <TouchableHighlight
                            underlayColor={Colors.black}
                            activeOpacity={0.95}
                            onPress={props.onNo}
                            style={{...styles.touchableButton, borderBottomRightRadius: 15}}
                        ><View style={{...styles.button, borderBottomRightRadius: 15}}>
                            <InterText flavor="medium" size={17} color={props.noColor ? props.noColor : Colors.black}>{props.noCaption}</InterText>
                        </View></TouchableHighlight>
                    : null}
                </View>
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
        paddingBottom: 0
    },

    message: {
        paddingHorizontal: 25,
        paddingBottom: 10
    },

    buttons: {
        flexDirection: "row"
    },

    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: Colors.white,
    },

    touchableButton: {
        flex: 1
    }
});