import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApis } from "../apis";
import { BookDetails, BookSet, BookVols } from "../components/browse-components";
import { Loading, LoadingBookDetails, LoadingBookSet } from "../components/loading";

export const Browse: React.FunctionComponent<React.PropsWithChildren> = function Browse(props) {
    return (
        <div id="browse" className="main">
            <div className="page">
                {props.children}
            </div>
        </div>
    );
};

export const Homepage: React.FunctionComponent = function Homepage() {

    const api = useApis();
    const [BookSets, setBookSets] = React.useState<BookSet[]>(null);

    React.useEffect(function () {
        api.getHomepageContent().then(function (data) {
            return setBookSets(data);
        });
    }, []);

    const content = BookSets && BookSets.map(function (bookSet, index) {
        return <BookSet key={index} bookSet={bookSet} />;
    });

    return content ? (
        <> {content} </>
    ) : (
        <Loading>
            <LoadingBookSet count={4} />
            <LoadingBookSet />
        </Loading>
    );
};

export const Search: React.FunctionComponent = function Search() {

    const [searchParams] = useSearchParams();
    const [searchResult, setResult] = React.useState<Book[]>();
    const searchStr = searchParams.get('searchStr');
    const { search } = useApis();
    const navigate = useNavigate()

    React.useEffect(function () {
        if (!searchStr) return navigate('/broswer')
        return void search(searchStr).then(function (data: Book[]) {
            return setResult(data);
        });
    }, [searchStr]);

    return searchResult ? (
        <BookSet alwaysDisplay bookSet={{ Name: `「${searchStr}」的搜尋結果：共 ${searchResult.length} 筆`, Books: searchResult }} />
    ) : (
        <LoadingBookSet />
    );
};

export const BookInfo: React.FunctionComponent = function BookInfo() {
    const { BookGroupID, IsSerial } = useParams()
    const [BookGroupInfo, setInfo] = React.useState<BookGroupInfo>(null);
    const { getBookGroupInfo } = useApis();

    React.useEffect(function () {
        if (BookGroupInfo?.BookGroupID === BookGroupID && String(BookGroupInfo?.IsSerial) === IsSerial) return;
        setInfo(null);
        getBookGroupInfo(BookGroupID, IsSerial).then(function (data) {
            setInfo(data);
        });
    }, [BookGroupID, IsSerial, BookGroupInfo]);

    return BookGroupInfo ? (
        <React.Fragment>
            <BookDetails bookGroup={BookGroupInfo}>
                <BookVols vols={BookGroupInfo.Vols} />
            </BookDetails>
            <BookSet bookSet={BookGroupInfo.Related} />
            <BookSet bookSet={BookGroupInfo.MutualsLike} />
        </React.Fragment>
    ) : (
        <Loading>
            <LoadingBookDetails />
            <LoadingBookSet />
        </Loading>
    );
};