import * as express from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as mimeTypes from 'mime-types';
import axios, { Axios, AxiosResponse } from 'axios';

const app = express();
const vols: {
    id: string;
    pages?: Buffer[];
    error?: any;
}[] = [];
const processing: {
    [BookID: string]: true
} = {};

app.use(function (req, res, next): void {
    const [dirname, basename]: [string, string] = [
        path.dirname(req.path),
        path.basename(req.path),
    ];

    const filePath = path.resolve('public', path.relative('/', dirname), basename);
    const usePublicFile = basename && fs.existsSync(filePath);

    if (!usePublicFile) {
        return next();
    }

    const stream = fs.createReadStream(filePath);

    const contentType = mimeTypes.contentType(basename);
    if (contentType) {
        res.setHeader('content-type', contentType)
        res.setHeader('x-content-type-options', 'no-sniff')
    }

    res.addListener('finish', function () {
        res.end();
    });

    return void stream.pipe(res);
});

app.all(
    ['/api/:name'],
    function (req, res): void {
        const { name } = req.params;

        if (name === 'search') {
            const { searchString } = req.query;
            res.setHeader('content-type', 'application/json');

            return void axios.request({
                url: 'https://api.tongli.tw/Search',
                method: 'post',
                headers: { 'content-type': 'multipart/form-data' },
                data: { SearchStr: searchString }
            }).then(function ({ data }) {
                return res.send(data);
            });
        }

        if (name === 'homepage') {
            res.setHeader('content-type', 'application/json');

            return void Promise.all([
                axios.request({
                    url: 'https://api.tongli.tw/SellShelf/0',
                    method: 'get'
                }),

                axios.request({
                    url: 'https://api.tongli.tw/SellRanking/1',
                    method: 'get'
                }),

                axios.request({
                    url: 'https://api.tongli.tw/SellRanking/2',
                    method: 'get'
                }),
            ]).then(function (responses) {
                const [booksets, rankingSerial, rankingComic] = responses.map(function (res) {
                    return res.data;
                });

                return res.send([
                    {
                        Books: rankingSerial.RankingSet[0].Month.map(function (book: any) {
                            const { BookCoverURL: CoverURL, BookGroupID, BookTitle: Title, IsSerial, IsSubscribe, Rank } = book
                            return {
                                CoverURL, BookGroupID, Title, IsSerial, IsSubscribe, Rank
                            };
                        }),
                        Name: rankingSerial.Title
                    },
                    {
                        Books: rankingComic.RankingSet[0].Month.map(function (book: any) {
                            const { BookCoverURL: CoverURL, BookGroupID, BookTitle: Title, IsSerial, IsSubscribe, Rank } = book
                            return {
                                CoverURL, BookGroupID, Title, IsSerial, IsSubscribe, Rank
                            };
                        }),
                        Name: rankingComic.Title
                    },
                    ...booksets
                ]);
            });
        }

        if (name === 'book-group-info') {
            const { BookGroupID, IsSerial } = req.query;
            res.setHeader('content-type', 'application/json');

            return void Promise.all([
                axios.request({
                    url: `https://api.tongli.tw/Book?bookGroupID=${BookGroupID}&isSerial=${IsSerial}`,
                    method: 'get'
                }),
                axios.request({
                    url: `https://api.tongli.tw/Book/BookVol/${BookGroupID}?isSerial=${IsSerial}`,
                    method: 'get'
                }),
                axios.request({
                    url: `https://api.tongli.tw/Tag/List/${BookGroupID}?isSerial=${IsSerial}`,
                    method: 'get'
                }),
                axios.request({
                    url: `https://api.tongli.tw/Book/MutualsLike/${BookGroupID}`,
                    method: 'get'
                }),
                axios.request({
                    url: `https://api.tongli.tw/Book/Related/${BookGroupID}`,
                    method: 'get'
                })
            ]).then(function (responses) {
                const [bookGroupInfo, Vols, Tags, MutualsLike, Related] = responses.map(function (res) {
                    return res.data;
                });

                return res.send({
                    Title: bookGroupInfo.Title,
                    BookGroupID: bookGroupInfo.BookGroupID,
                    CoverURL: bookGroupInfo.CoverURL,
                    Authors: bookGroupInfo.Authors,
                    IsFree: bookGroupInfo.IsFree,
                    Grade18: bookGroupInfo.IsFree,
                    Introduction: bookGroupInfo.Introduction,
                    IsSerial: bookGroupInfo.IsSerial,
                    IsSubscribe: bookGroupInfo.IsSubscribe,
                    IsUpcoming: bookGroupInfo.IsUpcoming,
                    OnShelfDate: bookGroupInfo.OnShelfDate,
                    Vols, Tags,
                    MutualsLike: {
                        Books: MutualsLike,
                        Name: '你可能也喜歡'
                    },
                    Related: {
                        Books: Related,
                        Name: '相關書籍'
                    }
                });
            });
        }

        if (name === 'book-pages') {
            const { token, BookID, IsFree } = req.query;
            res.setHeader('content-type', 'application/json');

            function getPages<T extends { Height: number, Width: number, Image: Buffer, PageNumber: number }>(list: T[]): Promise<T[]> {
                return axios.request({
                    url: `https://api.tongli.tw/Comic/sas/${BookID}${JSON.parse(IsFree.toString()) ? '' : '?freeTrialToken=free'}`,
                    method: 'get',
                    headers: { authorization: `bearer ${token}` }
                }).then(function ({ data }) {
                    console.log(BookID)
                    return Promise.allSettled([
                        data.Cover,
                        ...data.Pages
                    ].filter(function (_value, index) {
                        return !list[index];
                    }).map(function ({ Height, Width, ImageURL, PageNumber }: { Height: number, Width: number, ImageURL: string, PageNumber: number }) {
                        return Promise.all([
                            Height, Width, PageNumber,
                            axios.request({
                                url: ImageURL,
                                method: 'get',
                                responseType: 'arraybuffer'
                            }).then(function ({ data }: AxiosResponse<Buffer>) {
                                return data
                            })
                        ]);
                    })).then(function (results) {
                        return results.reduce(function (fullfilled: T[], result) {
                            if (result.status !== 'fulfilled') return fullfilled;
                            const [Height, Width, PageNumber, Data] = result.value;
                            fullfilled[PageNumber] = { Height, Width, PageNumber, Data } as unknown as T;
                            return fullfilled;
                        }, list);
                    }).then(function (pages) {
                        return pages.filter(Boolean).length === data.TotalPages + 1 ? pages : getPages(pages);
                    });
                });
            }

            console.log(processing[BookID.toString()])
            if (!processing[BookID.toString()]) {
                processing[BookID.toString()] = true;
                const a = [];
                getPages(a).then(console.log, console.log);
                console.log(a)
            }

            return void axios.request({
                url: `https://api.tongli.tw/Comic/sas/${BookID}${JSON.parse(IsFree.toString()) ? '' : '?freeTrialToken=free'}`,
                method: 'get',
                headers: { authorization: `bearer ${token}` }
            }).then(function ({ data }) {
                return res.send(data);
            }).catch(function (err) {
                return res.send(err.response.data);
            });
        }

        if (name === 'user-info') {
            const { token } = req.query;
            res.setHeader('content-type', 'application/json');

            return void axios.request({
                url: 'https://api.tongli.tw/Account/UserInfo',
                method: 'get',
                headers: { authorization: `bearer ${token}` }
            }).then(function ({ data }) {
                return res.send(data);
            });
        }
    }
);

app.all(
    ['/*'],
    function (req, res) {
        const isElectron = req.header('user-agent').indexOf('Electron') !== -1;

        const stream = ReactDOMServer.renderToPipeableStream(
            <html lang="zh-tw">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="theme" content="#ffffff" />
                    <title>Tongli Ebooks Reader</title>
                    <script src="/bundle.js" defer></script>
                    {/* {isElectron || <script src="/preload.js" defer></script>} */}
                    <link rel="stylesheet" href="/style/index.css" />
                </head>
                <body>
                    <div id="root"></div>
                </body>
            </html>
        );

        const contentType = mimeTypes.contentType('html');
        if (contentType) {
            res.setHeader('content-type', contentType)
            res.setHeader('x-content-type-options', 'no-sniff')
        }

        res.addListener('finish', function () {
            res.end();
        });

        return void stream.pipe(res);
    }
)

app.listen(3000, function () {
    console.log('Your app is listening at port: 3000.')
})