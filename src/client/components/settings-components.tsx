import * as React from "react";
import { useApis } from "../apis";

export const SignInForm: React.FunctionComponent = function SignInForm() {

    const { signIn } = useApis();
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [errorCode, setError] = React.useState<number>(0);

    function onEmailInput(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        if (event.target.value && errorCode & 1) setError(errorCode - 1);
    }

    function onPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        if (event.target.value && errorCode & 2) setError(errorCode - 2);
    }

    function submitHandler(event: React.FormEvent) {
        event.preventDefault();
        let error = 0
        if (!email) error += 1;
        if (!password) error += 2;
        if (error) return setError(error);

        signIn(email, password).catch(function () {
            return setError(4);
        });
    }

    const usernameProps: ITextBoxProps = {
        name: 'username',
        placeholder: '使用者帳號 / 電子郵件',
        autoComplete: 'off',
        onChange: onEmailInput,
        error: errorCode & 1 && 'error-require'
    };

    const passwordProps: ITextBoxProps = {
        name: 'password',
        type: 'password',
        placeholder: '登入密碼',
        autoComplete: 'off',
        onChange: onPasswordInput,
        error: errorCode & 2 && 'error-require'
    };

    const errorMsg = errorCode !== 4 ? errorCode === 0 ? false : '請輸入帳號及密碼' : '帳號或密碼錯誤'

    return (
        <form className="account-sign-in form" onSubmit={submitHandler}>
            <h6 className="form-caption">登入資訊</h6>
            <TextBox name="username" {...usernameProps} />
            <TextBox name="password" {...passwordProps} />
            <div>
                <small className="link">註冊帳號 / 忘記密碼</small>
            </div>
            <div className="button-group button-group-fill">
                <button className="button" type="submit">登入</button>
            </div>
            {errorMsg && <small className="error-message">{errorMsg}</small>}
        </form>
    );
};

export const AccountInfo: React.FunctionComponent = function AccountInfo() {

    const { getUserInfo, signOut } = useApis();
    const [userInfo, setInfo] = React.useState<UserInfo>(null);

    React.useEffect(function () {
        getUserInfo().then(function (info) {
            return setInfo(info);
        }).catch(function (reason) {
            return setInfo({NickName: '無法載入個人資訊', Email: ''})
        });
    }, []);

    return userInfo ? (
        <div className="account-info">
            <div className="user-avatar"></div>
            <div className="user-detail">
                <div className="user-info">
                    <div className="user-nickname">{userInfo.NickName}</div>
                    <div className="user-account">{userInfo.Email}</div>
                </div>
                <button className="button" onClick={signOut}>登出</button>
            </div>
        </div>
    ) : (
        <div className="loading-account-info shimmer">
            <div className="loading-user-avatar">
                <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
            </div>
            <div className="loading-user-detail">
                <div className="loading-gap"></div>
                <div className="loading-user-nickname">
                    <div className="loading-text">
                        <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                        <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                        <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                        <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                    </div>
                    <div className="loading-gap"></div>
                </div>
                <div className="loading-user-account">
                    <div className="loading-text">
                        <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                        <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                        <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                        <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                    </div>
                    <div className="loading-gap"></div>
                </div>
                <div className="loading-gap"></div>
            </div>
        </div>
    );
};

interface IInputProps<T extends HTMLElement = HTMLElement> {
    name: string;
    onChange?: React.ChangeEventHandler;
    ref?: React.RefCallback<T>;
    error?: string;
}

interface ITextBoxProps extends IInputProps<HTMLInputElement> {
    type?: 'text' | 'password' | 'email';
    placeholder?: string;
    autoComplete?: 'on' | 'off';
}
export const TextBox: React.FunctionComponent<ITextBoxProps> = function TextBox(props) {

    const id = React.useId();

    const textBoxProps: React.HTMLAttributes<HTMLDivElement> = {
        className: ['text-box', props.error].filter(Boolean).join(' ')
    }

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement> = {
        className: 'text-box-input',
        id: id + props.name,
        name: props.name,
        placeholder: props.placeholder,
        autoComplete: props.autoComplete,
        type: props.type ?? 'text',
        onChange: props.onChange,
        ref: props.ref
    };

    const labelProps: React.LabelHTMLAttributes<HTMLLabelElement> = {
        className: 'text-box-placeholder',
        htmlFor: id + props.name
    }

    return (
        <div {...textBoxProps}>
            <input {...inputProps} />
            <label {...labelProps}>{props.placeholder}</label>
        </div>
    );
};

interface ILinkProps {
    href: string;
    label?: string;
}
export const ExternalLink: React.FunctionComponent<ILinkProps> = function (props) {
    const apis = useApis();
    return (
        <span className="link" onClick={() => apis.openExternal(props.href)}>{props.label ?? props.href}</span>
    );
};