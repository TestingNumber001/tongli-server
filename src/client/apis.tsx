import * as React from "react";
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence, setPersistence, signInAnonymously, signInWithEmailAndPassword, User } from 'firebase/auth';
import * as EventEmitter from "events";

declare const port: {
    addListener(subject: string, callback: (...content: any[]) => any, options?: { once?: boolean }): void
    removeListener(subject: string): void;
    removeListener(subject: string, callback: (...content: any[]) => any): void;
    postMessage(subject: string, ...content: any[]): void;
};

type Apis = {
    isRenderer: boolean,
    controlWindow(method: string): void;
    useWindowState(): { isFullscreen: boolean; isMaximize: boolean; isMinimize: boolean; };
    useCurrentUser(): User | null;
    getUserInfo(): Promise<UserInfo>;
    signIn(email: string, password: string): Promise<void>;
    signOut(): Promise<void>;
    search(searchString: string): Promise<any[]>;
    getHomepageContent(): Promise<BookSet[]>;
    getBookGroupInfo(BookGroupID: string, IsSerial: string): Promise<BookGroupInfo>;
    getVolInfo(BookID: string): Promise<BookVolInfo>;
    getBookPages(BookID: string, IsFree: boolean, callback: (pages: Page[], progress: number) => any): Promise<Page[]>;
    openExternal(href: string): void;
    alert(message: string): Promise<void>;
    alert(title: string, message: string): Promise<void>;
};

const ApisContext: React.Context<Apis> = React.createContext<Apis>(null);
ApisContext.displayName = 'Apis';

const modal = new EventEmitter;
const ModalContext: React.Context<EventEmitter> = React.createContext<EventEmitter>(modal);
ModalContext.displayName = 'Modal';

function getApis(): Apis {
    const app = getApps().length ? getApp() : initializeApp({
        apiKey: "AIzaSyAJbYmo7KyhM_7CDXjjFXnp8bdRTNgbUIE",
        authDomain: "tongli-book.firebaseapp.com",
        databaseURL: "https://tongli-book.firebaseio.com",
        projectId: "tongli-book",
        storageBucket: "tongli-book.appspot.com",
        messagingSenderId: "1066510659255",
        appId: 'tongli-book'
    });

    const auth = getAuth(app);

    const windowState = {
        isFullscreen: false,
        isMaximize: false,
        isMinimize: false
    };

    return {
        isRenderer: (window.process as any)?.type === 'renderer',

        controlWindow(method) {
            return port.postMessage('window-control', method);
        },

        useWindowState() {
            const [state, setState] = React.useState(windowState);

            React.useEffect(function () {
                port.addListener('window-state', function (state) {
                    setState(state);
                    Object.assign(windowState, state);
                });
            }, []);

            return state;
        },

        useCurrentUser() {
            const [user, setUser] = React.useState<User>(auth.currentUser);

            React.useEffect(function () {
                auth.onAuthStateChanged(function (user) {
                    setUser(user);
                    console.log(user)
                });
            }, []);

            return user;
        },

        getUserInfo() {
            const user = auth.currentUser;
            return new Promise(function (resolve, reject) {
                if (!user) return reject();
                return user.getIdToken(true).then(function (token) {
                    function listener(result: any) {
                        port.removeListener('user-info', listener);
                        resolve(result);
                    }
                    port.postMessage('user-info', token);
                    return port.addListener('user-info', listener);
                }).catch(function (reason) {
                    return reject(reason);
                });
            });
        },

        signIn(email, password) {
            return new Promise(function (resolve, reject) {
                return signInWithEmailAndPassword(auth, email, password).then(function () {
                    return setPersistence(auth, indexedDBLocalPersistence);
                }).then(function () {
                    return resolve();
                }).catch(function () {
                    return reject();
                });
            });
        },

        signOut() {
            return auth.signOut();
        },

        search(searchString) {
            return new Promise(function (resolve) {
                function listener(result: any) {
                    port.removeListener('search', listener);
                    resolve(result);
                }
                port.postMessage('search', searchString);
                return port.addListener('search', listener);
            });
        },

        getHomepageContent() {
            return new Promise(function (resolve) {
                function listener(result: any) {
                    port.removeListener('homepage', listener);
                    resolve(result);
                }
                port.postMessage('homepage');
                return port.addListener('homepage', listener);
            });
        },

        getBookGroupInfo(BookGroupID, IsSerial) {
            return new Promise(function (resolve) {
                function listener(result: any) {
                    port.removeListener('book-group-info', listener);
                    resolve(result);
                }
                port.postMessage('book-group-info', {
                    BookGroupID, IsSerial
                });
                return port.addListener('book-group-info', listener);
            });
        },

        getVolInfo(BookID) {
            return new Promise(function (resolve) {
                function listener(result: any) {
                    port.removeListener('book-vol-info', listener);
                    resolve(result);
                }
                port.postMessage('book-vol-info', BookID);
                return port.addListener('book-vol-info', listener);
            });
        },


        getBookPages(BookID, IsFree, callback) {
            return new Promise(function (resolve, reject) {
                const user = auth.currentUser?.isAnonymous ?? true ? signInAnonymously(auth).then(() => auth.currentUser) : Promise.resolve(auth.currentUser);
                return user.then(user => user.getIdToken(true)).then(function (token) {
                    if (auth.currentUser?.isAnonymous) auth.signOut();
                    const pages: Page[] = [];
                    function listener(result: Page[] | {}, progress: number, end: boolean) {
                        if (result === null) {
                            resolve(pages);
                            port.removeListener(`book-pages:${BookID}`, listener);
                        } else if (result instanceof Array) {
                            result.forEach(function (page) {
                                pages[page.PageNumber - 1] = page;
                            });
                            callback(pages, progress);

                            if (end) {
                                resolve(pages);
                                port.removeListener(`book-pages:${BookID}`, listener);
                            };
                        } else {
                            reject(result);
                            port.removeListener(`book-pages:${BookID}`, listener);
                        }
                    }
                    port.postMessage('book-pages', {
                        BookID, IsFree, token
                    });
                    return port.addListener(`book-pages:${BookID}`, listener);
                });
            });
        },

        openExternal(href) {
            return port.postMessage('open-external', href);
        },

        alert(...args: string[]): Promise<void> {
            return new Promise(function (resolve) {
                function listener() {
                    modal.removeListener('modal-close', listener);
                    resolve(void 0);
                }
                modal.emit('modal-show', ...args);
                return modal.addListener('modal-close', listener);
            });
        }
    }
}

export const ApisProvider: React.FunctionComponent<React.PropsWithChildren> = function ApisProvider(props) {
    const apis = getApis();

    return (
        <ModalContext.Provider value={modal}>
            <ApisContext.Provider value={apis}>
                {props.children}
            </ApisContext.Provider>
        </ModalContext.Provider>
    );
};

export function useApis(): Apis {
    return React.useContext(ApisContext);
}

export function useModal(): EventEmitter {
    return React.useContext(ModalContext);
}