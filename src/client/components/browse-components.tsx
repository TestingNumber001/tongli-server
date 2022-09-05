import * as React from "react";
import { createSearchParams, useLinkClickHandler, useNavigate } from "react-router-dom";

export const BrowseNav: React.FunctionComponent = function BrowseNav () {

    const [ searchBox, setSearchBoxElement ] = React.useState<HTMLInputElement>(null)
    const navigate = useNavigate();

    function toHomepage () {
        return navigate('/browse');
    }

    function submitHandler ( event: React.FormEvent ) {
        event.preventDefault();
        if ( !searchBox ) return;
        const searchParams = createSearchParams({
            searchStr: searchBox.value
        });

        return navigate({
            pathname: '/browse/search',
            search: searchParams.toString()
        });
    }

    return (
        <div className="browse-nav">
            <button type="button" className="nav-button nav-icon-with-label show-label-on-hover" onClick={toHomepage}>
                &#xE80F;
                <span className="sidebar-icon-label">首頁</span>
            </button>
            <form className="search-bar" onSubmit={submitHandler}>
                <input type="text" className="search-box" name="search" autoComplete="off" placeholder="搜尋書名、作者、標籤請加「#」" ref={setSearchBoxElement} />
                <button className="search-btn" type="submit">&#xEA6D;</button>
            </form>
        </div>
    )
};

interface IBookSetProps {
    bookSet: BookSet;
    alwaysDisplay?: boolean;
}
export const BookSet: React.FunctionComponent<IBookSetProps> = function BookSet(props) {

    const { Books, Name, BookSetID } = props.bookSet;
    const BookNodes = Books.map(function (book, index) {
        return (
            <Book key={index} book={book} />
        );
    });

    return Books.length || props.alwaysDisplay ? (
        <div className="bookset">
            {Name && <div className="bookset-name">{Name}</div>}
            <div className="bookset-list">
                {BookNodes}
            </div>
        </div>
    ) : (
        null
    );
};

interface IBookProps {
    book: Book & { Rank?: number };
}
export const Book: React.FunctionComponent<IBookProps> = function Book(props) {
    const { book } = props;
    return (
        <div className="book" onClick={useLinkClickHandler(`/browse/${book.BookGroupID}.${book.IsSerial}`)}>
            <img className="book-img" src={book.CoverURL} />
            <div className="book-heading">
                {book.Rank && <div className="book-rank">{book.Rank}</div>}
                <div className="book-title">{book.Title}</div>
            </div>
            {book.IsSubscribe && <div className="book-tag favorite"></div>}
        </div>
    );
};

interface IBookDetailsProps {
    bookGroup: BookGroupInfo;
    children?: React.ReactNode;
}
export const BookDetails: React.FunctionComponent<IBookDetailsProps> = function BookDetails(props) {
    const { bookGroup } = props;
    const authors = bookGroup.Authors.map( function (author, index) {
        return (
            <div className="book-author" key={index}>
                { author.Name }
            </div>
        );
    });
    return (
        <div className="book-details">
            <img className="book-cover" src={bookGroup.CoverURL} />
            <div className="book-info">
                <h2 className="book-title">{bookGroup.Title}</h2>
                <div className="book-authors">{authors}</div>
                { bookGroup.Introduction && (
                    <blockquote className="book-intro">
                        <span>書本簡介</span>
                        {bookGroup.Introduction}
                    </blockquote>
                )}
                {props.children}
            </div>
        </div>
    );
};

interface IBookVolsProps {
    vols: BookVol[]
}
export const BookVols: React.FunctionComponent<IBookVolsProps> = function BookDetails(props) {
    const { vols } = props;
    const navigate = useNavigate();
    const bookVols = vols.map(function (vol, index) {
        const props: React.ButtonHTMLAttributes<HTMLButtonElement> = {
            className: 'book-vol',
            type: 'button',
            onClick () {
                return navigate(`/bookshelf/${vol.BookID}.${vol.IsFree}`)
            }
        };
        return (
            <button key={index} {...props}>{vol.Vol}</button>
        );
    })
    return (
        <div className="book-vols">
            <div className="book-vols-header">
                <div className="book-vols-caption">
                    章節列表
                </div>
                <div className="book-vols-functions">
                    <button type="button" className="vols-function-button"><span>&#xE896;</span>下載</button>
                    <button type="button" className="vols-function-button"><span>&#xEDFF;</span>加入最愛</button>
                </div>
            </div>
            <div className="book-vols-list">
                {bookVols}
            </div>
        </div>
    );
};