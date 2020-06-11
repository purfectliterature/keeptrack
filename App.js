import React, { useState } from 'react';
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import TabHomeScreen from "./src/screens/TabHomeScreen";
import WebViewScreen from './src/screens/WebViewScreen';
import ScanScreen from './src/screens/ScanScreen';

import configureStore from "./src/store/configureStore";

const fetchFonts = () => {
    return Font.loadAsync({
        "inter": require("./assets/fonts/Inter-Regular.otf"),
        "inter-semibold": require("./assets/fonts/Inter-SemiBold.otf"),
        "inter-medium": require("./assets/fonts/Inter-Medium.otf")
    });
};

const { store, persistor } = configureStore();

const Stack = createStackNavigator();

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
                    <Stack.Navigator initialRouteName="TabHome" headerMode="none">
                        <Stack.Screen name="TabHome" component={TabHomeScreen} />
                        <Stack.Screen name="WebView" component={WebViewScreen} />
                        <Stack.Screen name="Scanner" component={ScanScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
        
    );
}
