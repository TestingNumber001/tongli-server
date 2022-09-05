import * as React from "react";
import { useApis } from "../apis";
import { AccountInfo, ExternalLink, SignInForm } from "../components/settings-components";

export const Settings: React.FunctionComponent<React.PropsWithChildren> = function Settings(props) {
    return (
        <div id="settings" className="main">
            <div className="page">
                {props.children}
            </div>
        </div>
    );
};

export const Accout: React.FunctionComponent = function Accout() {

    const { useCurrentUser } = useApis();
    const user = useCurrentUser();

    const loginState = !(user?.isAnonymous ?? true);

    return (
        <React.Fragment>
            {loginState ? <AccountInfo />: <SignInForm />}
            <div className="setting-block">
                <h5>為什麼我需要登入？</h5>
                <p>由於東立電子書應用程式介面之權杖請求規則，所有被規類為限制級之書藉不得以訪客身份閱讀。若欲閱讀限制級之書藉，則應登入東立帳戶。</p>
            </div>
            <div className="setting-block">
                <h5>可以用 Google 或 Facebook 登入嗎？</h5>
                <p>本軟體目前僅提供電子郵件及密碼的登入方式，第三方帳戶的登入方式目前尚未實裝。</p>
            </div>
            <div className="setting-block">
                <h5>登入後為什麼我無法閱讀作品？</h5>
                <p>若所有作品皆無法閱讀，可能因使用者於超過5部設備上登入帳號，導致應用程式介面回報錯誤。若僅有限制級書藉無法閱讀，可能是使用者年齡仍未滿18歲，應用程式介面為限制使用者閱讀而禁止。若部份作品無法閱讀，可能是使用者所在地區不在授權範圍中。</p>
            </div>
            <div className="setting-block">
                <h5>我可以在這裡更改我的帳戶資訊嗎？</h5>
                <p>本軟體並沒有提供任何更改帳戶資訊的功能，若有需要，請至官方網站 <ExternalLink href="https://ebook.tongli.com.tw/" /> 進行更改。</p>
            </div>
            <div className="setting-block">
                <h5>登入帳號會被盜取嗎？</h5>
                <p>本軟體保證並不會記錄或以任何方式盜取帳號或取得個人資訊，但本軟體不能保證其他有心人士不能透過本軟體盜取帳號。登入前請再三權衡。</p>
            </div>
        </React.Fragment>
    );
};

export const Looks: React.FunctionComponent = function Looks() {
    return (
        <React.Fragment>
            Looks
        </React.Fragment>
    );
};

export const Comics: React.FunctionComponent = function Comics() {
    return (
        <React.Fragment>
            Comics
        </React.Fragment>
    );
};