import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApis } from "../apis";
import { ReaderPanel, Reader, ReaderSwiper, LoadingProgress } from "../components/bookshelf-components";

export const BookShelf: React.FunctionComponent<React.PropsWithChildren> = function BookShelf(props) {
    return (
        <div id="bookshelf" className="main">
            <div className="page">
                {props.children}
            </div>
        </div>
    );
};

export const History: React.FunctionComponent = function History() {
    return (
        <React.Fragment>
            History
        </React.Fragment>
    );
};

export const Favorite: React.FunctionComponent = function Favorite() {
    return (
        <React.Fragment>
            Favorite
        </React.Fragment>
    );
};

export const BookReader: React.FunctionComponent = function BookReader() {
    const { BookId, IsFree } = useParams();
    const { getBookPages, getVolInfo, alert } = useApis();
    const [bookPages, setBookPages] = React.useState<Page[]>([]);
    const [progress, setProgress] = React.useState<number>(0);
    const [page, setPage] = React.useState<number[]>([1]);
    const [VolInfo, setVolInfo] = React.useState<Promise<BookVolInfo> | BookVolInfo>(getVolInfo(BookId));
    const navigate = useNavigate();

    React.useEffect(function () {
        setBookPages([]);
        setProgress(0);
        setPage([1]);
    }, [BookId, IsFree]);

    React.useEffect(function () {
        getBookPages(BookId, JSON.parse(IsFree), function (pages, progress) {
            if (pages[0] && !bookPages[0]) setBookPages(pages);
            setProgress(progress)
        }).then(function (pages) {
            setBookPages(pages.slice());
            setProgress(1);
        }).catch(function (reason) {
            alert('漫畫載入失敗', reason.Error.replace('\u3002\u3002', '\u3002'))
            return (VolInfo instanceof Promise ? VolInfo : Promise.resolve(VolInfo)).then(function (info) {
                navigate(`/browse/${info.BookGroupID}.${info.IsSerial}`);
            });
        });
    }, [BookId, IsFree]);

    React.useEffect(function () {
        setVolInfo(
            getVolInfo(BookId).then(function (info) {
                setVolInfo(info);
                return info;
            })
        );
    }, [BookId, IsFree]);

    return (
        <Reader>
            <ReaderSwiper pageNumbers={page} pages={bookPages} />
            {(VolInfo instanceof Promise || progress === 0) || <ReaderPanel VolInfo={VolInfo} totalPage={bookPages.length} pageNumbers={page} setPage={setPage} />}
            {(progress !== 1 || !(VolInfo instanceof Promise)) && <LoadingProgress progress={progress} />}
        </Reader>
    );
};