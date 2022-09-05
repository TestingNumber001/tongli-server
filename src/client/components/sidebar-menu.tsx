import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SidebarMenu: React.FunctionComponent<React.PropsWithChildren> = function SidebarMenu(props) {
    return (
        <div className="sidebar-menu">
            {props.children}
        </div>
    );
};

interface ISidebarButtonProps extends React.PropsWithChildren {
    path?: string;
    test?: string | RegExp;
    disabledWhenActive?: boolean
}

export const SidebarButton: React.FunctionComponent<ISidebarButtonProps> = function SidebarButton(props) {
    const { pathname } = useLocation();
    const pathTest = props.test ?? props.path
    const isActive = pathTest && pathname.match(pathTest)
    const navigate = useNavigate();

    const buttonProps: React.ButtonHTMLAttributes<{}> = {
        className: ['sidebar-button', isActive && 'active'].filter(Boolean).join(' '),
        type: 'button',
        onClick() {
            return isActive && props.disabledWhenActive || navigate(props.path);
        }
    }

    return (
        <button {...buttonProps}>{props.children}</button>
    )
};

export const SidebarLink: React.FunctionComponent<ISidebarButtonProps> = function SidebarLink(props) {
    const { pathname } = useLocation();
    const pathTest = props.test ?? props.path
    const isActive = pathTest && pathname.match(pathTest)
    const navigate = useNavigate();

    const buttonProps: React.ButtonHTMLAttributes<{}> = {
        className: ['sidebar-link', isActive && 'active'].filter(Boolean).join(' '),
        type: 'button',
        onClick() {
            return isActive && props.disabledWhenActive || navigate(props.path);
        }
    }

    return (
        <button {...buttonProps}>{props.children}</button>
    )
};

interface ISidebarIconButtonProps extends ISidebarButtonProps {
    label?: string;
    showLabelOnHover?: boolean;
}
export const SidebarIconButton: React.FunctionComponent<ISidebarIconButtonProps> = function SidebarButton(props) {
    const { pathname } = useLocation();
    const pathTest = props.test ?? props.path
    const isActive = pathTest && pathname.match(pathTest)
    const navigate = useNavigate();

    const buttonProps: React.ButtonHTMLAttributes<{}> = {
        className: ['sidebar-icon-button', isActive && 'active', props.label && 'sidebar-icon-with-label', props.label && props.showLabelOnHover && 'show-label-on-hover' ].filter(Boolean).join(' '),
        type: 'button',
        onClick() {
            return isActive && props.disabledWhenActive || navigate(props.path);
        }
    }

    return (
        <button {...buttonProps}>
            {props.children}
            {Boolean(props.label) && <span className="sidebar-icon-label">{props.label}</span>}
        </button>
    );
};

export const SidebarIconLink: React.FunctionComponent<ISidebarIconButtonProps> = function SidebarLink(props) {
    const { pathname } = useLocation();
    const pathTest = props.test ?? props.path
    const isActive = pathTest && pathname.match(pathTest)
    const navigate = useNavigate();

    const buttonProps: React.ButtonHTMLAttributes<{}> = {
        className: ['sidebar-icon-link', isActive && 'active', props.label && 'sidebar-icon-with-label'].filter(Boolean).join(' '),
        type: 'button',
        onClick() {
            return isActive && props.disabledWhenActive || navigate(props.path);
        }
    }

    return (
        <button {...buttonProps}>
            {props.children}
            {Boolean(props.label) && <span className="sidebar-icon-label">{props.label}</span>}
        </button>
    );
};

interface IDividerProps {
    displayDivider?: boolean
    height?: string | number;
}

export const MenuDivider: React.FunctionComponent<IDividerProps> = function MenuDivider(props) {
    const divideProps = {
        className: ['menu-divider', props.displayDivider && 'display-divider'].filter(Boolean).join(' '),
        style: props.height && {
            flexBasis: props.height
        }
    }
    return (
        <div {...divideProps}/>
    );
};

export const MenuCaption: React.FunctionComponent<React.PropsWithChildren> = function MenuCaption(props) {
    return (
        <div className="menu-caption">
            {props.children}
        </div>
    );
};

export const MenuInfo: React.FunctionComponent<React.PropsWithChildren> = function MenuInfo(props) {
    const children = Array().concat(props.children);
    return (
        <div className="menu-info">
            {props.children && children.join('\n')}
        </div>
    );
};