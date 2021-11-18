import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    console.log("Navigating to: ", name);
    console.log("Parameters are: ", params);
    navigationRef.current?.navigate(name, params);
}
