import * as React from "react";

export const DefaultLayout: React.FunctionComponent<React.PropsWithChildren> = function Layout (props) {
    return (
        <div className="layout default">
            {props.children}
        </div>
    );
};

export const SettingsLayout: React.FunctionComponent<React.PropsWithChildren> = function Layout (props) {
    return (
        <div className="layout settings">
            {props.children}
        </div>
    );
};

export const Container: React.FunctionComponent<React.PropsWithChildren> = function Container (props) {
    return (
        <div className="container">
            {props.children}
        </div>
    );
};