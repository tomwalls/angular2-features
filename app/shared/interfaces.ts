export interface ISelection {
     id: number;
     system: string;
     subSystem: string;
     date: Date;
     course: string;
     horse: string;
     stake: number;
     odds: number;
     result: string;
     profit: number;
}

export interface IDashboard {
     
     system: string;
     selections: number;
     wins: number;
     seconds: number;
     secondsProfit: number;
     thirds: number;
     thirdsProfit: number;
     losses: number;
     strikeRate: number;
     staked: number;
     return: number;
     profit: number;
     yield: number;
     commission: number;
     selectionList: ISelection[];
     graphData: IGraphData;
     timeStart: string;
     timeEnd: string;
}

export interface IGraphData {

    months: string[];
    returns: number[];
}

export interface ISelectionDetails {
     /*id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: IUser[];
     statuses: string[];
     types: string[];*/
}

export interface IBetfairResult{

    eventTypeId: number,
    eventType: number,
    marketId: number,
    selectionId: number,
    handicap: number,
    betId: number,
    placedDate: Date,
    persistenceType: string,
    orderType: string,
    side: string,
    itemDescription: {
      eventTypeDesc: string,
      eventDesc: string,
      marketDesc: string,
      marketType: string,
      marketStartTime: Date,
      runnerDesc: string,
      numberOfWinners: number,
      eachWayDivisor: number
    },
    betOutcome: string,
    price: number,
    settledDate: Date,
    lastMatchedDate: Date,
    betCount: number,
    commission: number,
    priceMatched: number,
    priceReduced: boolean,
    sizeSettled: number,
    profit: number,
    sizeCancelled: number,
    system: string,
    subSystem: string
}

export interface IUser {
    id: number;
    name: string;
    avatar: string;
    profession: string;
    schedulesCreated: number;
}

export interface ISchedule {
     id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: number[];
}

export interface IScheduleDetails {
     id: number;
     title: string;
     description: string;
     timeStart: Date;
     timeEnd: Date;
     location: string;
     type: string;
     status: string;
     dateCreated: Date;
     dateUpdated: Date;
     creator: string;
     creatorId: number;
     attendees: IUser[];
     statuses: string[];
     types: string[];
}

export interface Pagination {
    CurrentPage : number;
    ItemsPerPage : number;
    TotalItems : number;
    TotalPages: number;
}

export class PaginatedResult<T> {
    result :  T;
    pagination : Pagination;
}

export interface Predicate<T> {
    (item: T): boolean
}