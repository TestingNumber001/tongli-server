import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { ApisProvider } from "./apis";
import { Titlebar } from "./components/titlebar";
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'; 
import { MenuCaption, MenuDivider, SidebarIconButton, SidebarIconLink, SidebarButton, SidebarMenu, SidebarLink, MenuInfo } from "./components/sidebar-menu";
import { DefaultLayout, SettingsLayout } from "./components/layout";
import { BookInfo, Browse, Homepage, Search } from "./pages/browse";
import { BookShelf, Favorite, History, BookReader } from "./pages/bookshelf";
import { Accout, Comics, Looks, Settings } from "./pages/settings";
import { BrowseNav } from "./components/browse-components";
import { Modal } from "./components/modal";

const root = ReactDOMClient.createRoot(
    document.getElementById('root')
);

root.render( 
    <React.StrictMode>
        <ApisProvider>
            <Titlebar />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <DefaultLayout>
                            <SidebarMenu>
                                <SidebarIconButton label="書櫃" showLabelOnHover path="/bookshelf">&#xEAA5;</SidebarIconButton>
                                <SidebarIconButton label="瀏覽" showLabelOnHover path="/browse">&#xEA6D;</SidebarIconButton>
                                <MenuDivider height="100%" />
                                <SidebarIconLink label="設定" path="/settings/account">&#xEb51;</SidebarIconLink>
                            </SidebarMenu>
                            <Outlet />
                        </DefaultLayout>
                    }>
                        <Route path="/bookshelf" element={
                            <Outlet />
                        }>
                            <Route path="/bookshelf/" element={
                                <BookShelf>
                                    <Outlet />
                                </BookShelf>
                            }>
                                <Route path="/bookshelf/" element={<Favorite />} />
                                <Route path="/bookshelf/history" element={<History />} />
                            </Route>
                            <Route path="/bookshelf/:BookId.:IsFree" element={<BookReader />} />
                        </Route>
                        <Route path="/browse" element={
                            <Browse>
                                <BrowseNav />
                                <Outlet />
                            </Browse>
                        }>
                            <Route path="/browse" element={<Homepage />} />
                            <Route path="/browse/:BookGroupID.:IsSerial" element={<BookInfo />} />
                            <Route path="/browse/search" element={<Search />} />
                        </Route>
                    </Route>
                    <Route path="/settings" element={
                        <SettingsLayout>
                            <SidebarMenu>
                                <MenuDivider height="2rem"/>
                                <MenuCaption>使用者</MenuCaption>
                                <SidebarButton path="/settings/account">我的帳戶</SidebarButton>
                                <MenuDivider displayDivider/>
                                <MenuCaption>應用程式</MenuCaption>
                                <SidebarButton path="/settings/looks">外觀</SidebarButton>
                                <SidebarButton path="/settings/comics">漫畫載入</SidebarButton>
                                <MenuDivider displayDivider/>
                                <SidebarLink path="/browse">回到主頁</SidebarLink>
                                <MenuInfo>
                                    Tongli Ebooks Reader @ v0.0.1 {}
                                    Copyright &copy; 2022
                                </MenuInfo>
                            </SidebarMenu>
                            <Settings>
                                <Outlet />
                            </Settings>
                        </SettingsLayout>
                    }>
                        <Route path="/settings/account" element={<Accout />}/>
                        <Route path="/settings/looks" element={<Looks />}/>
                        <Route path="/settings/comics" element={<Comics />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            <Modal />
        </ApisProvider>
    </React.StrictMode>
)