import React, { useState } from 'react';
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Colors from "./src/constants/colors";
import Dimens from "./src/constants/dimens";

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import InterText from './src/components/InterText';

import configureStore from "./src/store/configureStore";

const fetchFonts = () => {
    return Font.loadAsync({
        "inter": require("./assets/fonts/Inter-Regular.otf"),
        "inter-bold": require("./assets/fonts/Inter-Bold.otf"),
        "inter-semibold": require("./assets/fonts/Inter-SemiBold.otf"),
        "inter-medium": require("./assets/fonts/Inter-Medium.otf")
    });
};

const { store, persistor } = configureStore();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
            case "Home":
                iconName = "format-list-bulleted";
                break;
            case "Scan":
                iconName = "filter-center-focus";
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
            case "Scan":
                label = "Scan";
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

export default function App() {
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    if (!assetsLoaded) {
        // TODO: Modify AppLoading screen
        return <AppLoading startAsync={fetchFonts} onFinish={() => setAssetsLoaded(true)} />
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={screenOptions}
                        tabBarOptions={tabBarOptions}
                        backBehavior="none"
                    >
                        <Tab.Screen name="Home" component={HomeScreen} />
                        <Tab.Screen name="Scan" component={ScanScreen} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
        
    );
}
