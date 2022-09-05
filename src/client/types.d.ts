interface Book { // 生成連結所需要最低限度的資訊
    CoverURL: string;
    BookGroupID: string;
    Title: string;
    Vol?: string;
    IsSerial: boolean;
    IsSubscribe: boolean;
}

interface Author { // 作者
    ID: number;
    Name: string;
}

interface BookGroupInfo extends Book {
    Authors: Author[];
    BookID?: string;
    BookGroupID: string;
    Grade18: boolean;
    Introduction: string;
    IsFree: boolean;
    IsFreeTrial: boolean;
    IsUpcoming: boolean;
    Vols: BookVol[];
    Tags: Tag[];
    MutualsLike: BookSet;
    Related: BookSet;
}

interface BookVolInfo extends Book {
    Authors: Author[];
    BookID: string;
    BookGroupID: string;
    Grade18: boolean;
    Introduction: string;
    IsFree: boolean;
    IsFreeTrial: boolean;
    IsUpcoming: boolean;
    PrevVol: BookVol;
    NextVol: BookVol;
}

//https://api.tongli.tw/Book?[bookGroupID=<BookGroupID>|bookID=<BookID>]&isSerial=<isSerial>

// https://api.tongli.tw/Book/BookVol/<BookGroupID>?bookID=<BookID>&isSerial=<isSerial>
interface BookVol {
    BookID: string;
    IsFree: boolean;
    IsUpcoming: boolean;
    Vol: string;
}

//https://api.tongli.tw/Tag/List/<BookGroupID>&isSerial=<isSerial>
interface Tag {
    Count: number;
    ID: string;
    Name: string;
}

//其他人也購買的推薦書單 https://api.tongli.tw/Book/MutualsLike/<BookGroupID>
//推薦書籍 https://api.tongli.tw/Book/Related/<BookGroupID>

interface BookSet {
    Name?: string;
    BookSetID?: string;
    Books: Book[]
}

interface Page {
    Height: number;
    Width: number;
    Image: Uint8Array;
    PageNumber: number;
}

interface UserInfo {
    Email: string;
    NickName: string;
}