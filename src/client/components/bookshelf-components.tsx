import * as React from "react";
import { Buffer } from "buffer";
import { useApis } from "../apis";
import { useNavigate } from "react-router-dom";

export const Reader: React.FunctionComponent<React.PropsWithChildren> = function (props) {
    return (
        <div id="book-reader" className="main">
            {props.children}
        </div>
    );
};

interface IReaderSwiperProps {
    pageNumbers: number[];
    pages: Page[];
}
export const ReaderSwiper: React.FunctionComponent<IReaderSwiperProps> = function ReaderSwiper(props) {
    const [isPending, startTransition] = React.useTransition();
    const [pageData, setPages] = React.useState<string[]>([]);

    React.useEffect(function () {
        startTransition(function () {
            setPages(
                props.pages.map(function (page, index) {
                    if (pageData[index]) return pageData[index];
                    const image = new Image(0, 0);
                    const url = URL.createObjectURL(new Blob([page.Image.buffer]))
                    image.classList.add('image-preload');
                    document.body.appendChild(image)
                    image.src = url;
                    image.onload = () => image.remove();
                    return url;
                })
            )
        });
    }, [props.pages]);

    const pages = props.pageNumbers.map(function (number) {
        return props.pages[number - 1] && pageData[number - 1] ? (
            <img
                className="reader-page"
                src={pageData[number - 1]}
                alt={`page-${number}`}
                key={`page-${number}`}
                style={{
                    aspectRatio: (props.pages[number].Width / props.pages[number].Height).toString()
                }}
            />
        ) : (
            null
        );
    });

    return (
        <div className="reader-swiper">
            {pages}
        </div>
    );
};

interface IReaderPanelProps {
    VolInfo: BookVolInfo;
    totalPage: number;
    pageNumbers: number[];
    setPage: React.Dispatch<React.SetStateAction<number[]>>
}
export const ReaderPanel: React.FunctionComponent<IReaderPanelProps> = function ReaderPanel(props) {
    const { getVolInfo } = useApis();
    const { VolInfo, totalPage, pageNumbers, setPage } = props;
    const navigate = useNavigate();

    function prevPage() {
        if (pageNumbers[0] === 1) return;
        setPage(pageNumbers[0] === 2 ? [1] : [pageNumbers[0] - 2, pageNumbers[0] - 1])
    }

    function nextPage() {
        if (pageNumbers[pageNumbers.length - 1] === totalPage) return;
        setPage(pageNumbers[pageNumbers.length - 1] === totalPage - 1 ? [totalPage] : [pageNumbers[pageNumbers.length - 1] + 1, pageNumbers[pageNumbers.length - 1] + 2])
    }

    function prevVol() {
        if (!VolInfo.PrevVol.BookID) return;
        navigate(`/bookshelf/${VolInfo.PrevVol.BookID}.${VolInfo.PrevVol.IsFree}`);
    }

    function nextVol() {
        if (!VolInfo.NextVol.BookID) return;
        navigate(`/bookshelf/${VolInfo.NextVol.BookID}.${VolInfo.NextVol.IsFree}`);
    }

    function BookDetails() {
        navigate(`/browse/${VolInfo.BookGroupID}.${VolInfo.IsSerial}`);
    }

    function touchPanel(event: React.MouseEvent) {
        if (event.button == 0) return nextPage();
        if (event.button == 2) return prevPage();
    }

    return (
        <>
            <div className="touch" onClick={touchPanel} onContextMenu={touchPanel}></div>
            <div className="panel">
                <div className="chapter-name">
                    <button className="chapter-button" onClick={BookDetails}>&#xEA37; {VolInfo?.Title} {VolInfo?.Vol}</button>
                </div>
                <div className="page-spinner">
                    <button type="button" className="control-button control-icon-with-label show-label-on-hover" disabled={pageNumbers[0] === 1} onClick={prevPage}>
                        &#xEB6F;
                        <span className="sidebar-icon-label">上一頁</span>
                    </button>
                    <div className="page-number">第 {pageNumbers.join(' - ')} 頁</div>
                    <button type="button" className="control-button control-icon-with-label show-label-on-hover" disabled={pageNumbers[pageNumbers.length - 1] === totalPage} onClick={nextPage}>
                        &#xEB70;
                        <span className="sidebar-icon-label">下一頁</span>
                    </button>
                </div>
                <div className="change-vol">
                    <button type="button" className="control-button control-icon-with-label show-label-on-hover" disabled={!VolInfo?.PrevVol?.BookID} onClick={VolInfo?.PrevVol?.BookID && prevVol}>
                        &#xE830;
                        <span className="sidebar-icon-label">上一話</span>
                    </button>
                    <button type="button" className="control-button control-icon-with-label show-label-on-hover" disabled={!VolInfo?.NextVol?.BookID} onClick={nextVol}>
                        &#xEA47;
                        <span className="sidebar-icon-label">下一話</span>
                    </button>
                </div>
            </div>
        </>
    );
};
interface ILoadingProgressProps {
    progress: number;
}
export const LoadingProgress: React.FunctionComponent<ILoadingProgressProps> = function LoadingProgress(props) {
    return (
        <div className="loading-progress-container">
            <div className="loading-progress">
                <span className="loading-progress-label">載入中…{Boolean(props.progress) && (props.progress * 100).toFixed(2) + '%'}</span>
                <progress className="loading-progress-bar" max={1} value={props.progress} />
            </div>
        </div>
    );
};