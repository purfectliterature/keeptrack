import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../constants/colors";
import Dimens from "../constants/dimens";

import HomeScreen from '../screens/HomeScreen';
import EmptyScreen from '../screens/EmptyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InterText from "../components/InterText";
import CircularButton from "../components/CircularButton";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
            case "Home":
                iconName = "format-list-bulleted";
                break;
            case "Settings":
                iconName = "settings";
                break;
        }

        return <Icon name={iconName} size={size} color={color} />;
    },

    tabBarLabel: ({ focused, color }) => {
        let label;

        switch (route.name) {
            case "Home":
                label = "Locations";
                break;
            case "Settings":
                label = "Settings";
                break;
        }

        return <InterText flavor="medium" color={color} size={12}>{label}</InterText>;
    }
});

const tabBarOptions = {
    activeTintColor: Colors.primaryLighter,
    inactiveTintColor: Colors.grey3,
    keyboardHidesTabBar: true,
    style: {
        elevation: 100
    }
};

export default (props) => {
    return (
        <Tab.Navigator
            screenOptions={screenOptions}
            tabBarOptions={tabBarOptions}
            backBehavior="none"
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="Scan" 
                component={EmptyScreen}
                options={{tabBarButton: () => (
                    <CircularButton
                        icon={<Icon name="filter-center-focus" size={40} color={Colors.white} />}
                        color={Colors.primaryLighter}
                        onPress={() => props.navigation.navigate("Scanner")}
                    />
                )}}
            />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};