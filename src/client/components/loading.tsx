import * as React from "react";

export const Loading: React.FunctionComponent<React.PropsWithChildren> = function Loading(props) {
    return (
        <div className="loading">
            {props.children}
        </div>
    );
};

interface IBookSetProps {
    count?: number
}
export const LoadingBookSet: React.FunctionComponent<IBookSetProps> = function BookSet(props) {
    const children = Array(6).fill(0).map(function (element, index) {
        return index < (props.count ?? 6) ? (
            <React.Fragment key={index}>
                <LoadingBook />
                <div className="loading-bookset-gap"></div>
            </React.Fragment>
        ) : (
            <React.Fragment key={index}>
                <div className="loading-bookset-gap"></div>
                <div className="loading-bookset-gap"></div>
            </React.Fragment>
        );
    });

    return (
        <div className="loading loading-bookset">
            <div className="loading-bookset-container shimmer">
                <div className="loading-bookset-name">
                    <div className="loading-bookset-text">
                        <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                        <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                        <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                        <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                    </div>
                </div>
                <div className="loading-bookset-list-container">
                    <div className="loading-bookset-list">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LoadingBook: React.FunctionComponent = function Book() {
    return (
        <div className="loading loading-book">
            <div className="loading-book-img">
                <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
            </div>
            <div className="loading-book-heading">
                <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
            </div>
        </div>
    );
};


export const LoadingBookDetails: React.FunctionComponent = function BookDetails() {
    return (
        <div className="loading-book-details">
            <div className="loading-book-details-container shimmer">
                <div className="loading-book-cover">
                    <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                    <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                    <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                    <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                </div>
                <div className="loading-book-info">
                    <div className="loading-book-title">
                        <div className="loading-book-text">
                            <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                            <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                            <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                            <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                        </div>
                    </div>
                    <div className="loading-book-authors">
                        <div className="loading-book-author">
                            <div className="loading-book-text">
                                <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                                <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                                <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                                <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div className="loading-book-intro">
                        <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                        <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                        <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                        <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                    </div>
                    <div className="loading-book-vols">
                        <div className="loading-book-vols-header">
                            <div className="loading-book-text">
                                <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                                <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                                <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                                <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                            </div>
                        </div>
                        <div className="loading-book-vols-list">
                            <svg className="shimmer-top-left-corner" viewBox="0 0 4 4"><path d="M0 4 A 4 4, 0, 0, 1, 4 0 L 0 0 Z"></path></svg>
                            <svg className="shimmer-top-right-corner" viewBox="0 0 4 4"><path d="M0 0 A 4 4, 0, 0, 1, 4 4 L 4 0 Z"></path></svg>
                            <svg className="shimmer-bottom-left-corner" viewBox="0 0 4 4"><path d="M4 4 A 4 4, 0, 0, 1, 0 0 L 0 4 Z"></path></svg>
                            <svg className="shimmer-bottom-right-corner" viewBox="0 0 4 4"><path d="M4 0 A 4 4, 0, 0, 1, 0 4 L 4 4 Z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};