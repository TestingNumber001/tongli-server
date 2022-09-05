import * as React from "react";
import { useModal } from "../apis";

export const Modal: React.FunctionComponent = function Modal() {

    const [isShowing, setShowingState] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('漫畫載入錯誤');
    const [message, setMessage] = React.useState<string>('test');
    const modal = useModal();

    React.useEffect(function () {
        function listener(message: string): void
        function listener(title: string, message: string): void
        function listener(...args: string[]): void {
            const [title, message] = args.length === 1 ? ['', args[0]]: args;
            setShowingState(true);
            setTitle(title);
            setMessage(message);
        }

        modal.addListener('modal-show', listener);
        return function () {
            modal.removeListener('modal-show', listener)
        }
    }, []);

    function close(event: React.MouseEvent) {
        event.stopPropagation();
        setShowingState(false);
        modal.emit('modal-close');
    }

    return (
        <div id="modal" className={isShowing ? 'show': undefined}>
            <div className="modal-content">
                {Boolean(title) && <div className="modal-header">{title}</div>}
                <div className="modal-body">{message}</div>
                <div className="modal-footer">
                    <button className="modal-confirm-button" onClick={close}>確定</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={close}></div>
        </div>
    );
}