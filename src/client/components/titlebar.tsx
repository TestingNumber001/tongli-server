import * as React from "react";
import { useApis } from "../apis";

export const Titlebar: React.FunctionComponent = function () {

    const apis = useApis();
    const windowState = apis.useWindowState();

    const minimizeButtonProps = {
        children: '\uEABA',
        onClick() {
            apis.controlWindow('minimize');
        }
    };

    const maximizeButtonProps = {
        children: windowState.isMaximize ? '\uEABB' : '\uEAB9',
        onClick() {
            apis.controlWindow(windowState.isMaximize ? 'unmaximize' : 'maximize');
        }
    };

    const closeButtonProps = {
        children: '\uEAB8',
        onClick() {
            apis.controlWindow('close');
        }
    };

    return (
        <div id="titlebar">
            <div className="title">
                <span>Tongli Ebooks Reader</span>
            </div>
            <div className="window-controls">
                <button className="control-button" tabIndex={-1} type="button" {...minimizeButtonProps} />
                <button className="control-button" tabIndex={-1} type="button" {...maximizeButtonProps} />
                <button className="control-button" tabIndex={-1} type="button" {...closeButtonProps} />
            </div>
        </div>
    )
};