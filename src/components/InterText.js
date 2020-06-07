import React from 'react';
import { Text } from "react-native";

// InterText props: flavor, size, color

export default (props) => {    
    return (
        <Text
            {...props}
            style={{
                fontFamily: `inter${props.flavor ? `-${props.flavor}` : ""}`,
                fontSize: props.size,
                color: props.color,
                ...props.style
            }}
        >
            {props.children}
        </Text>
    );
};