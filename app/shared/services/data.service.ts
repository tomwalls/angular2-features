import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IUser, ISchedule, IScheduleDetails, IBetfairResult, IDashboard, ISelection, ISelectionDetails, Pagination, PaginatedResult } from '../interfaces';
import { ItemsService } from '../utils/items.service';
import { ConfigService } from '../utils/config.service';

@Injectable()
export class DataService {

    _baseUrl: string = '';
    _baseBettingUrl: string = '';
    _baseBetfairUrl: string = '';

    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
        this._baseBettingUrl = configService.getBettingApiURI();
        this._baseBetfairUrl = configService.getBettingApiURI();
    }

    getSystemNames()
    {
        var result: IDashboard;
        let headers = new Headers();
        
        return this.http.get(this._baseBettingUrl + 'dashboard/systems', {
            headers: headers
        })
            .map((res: Response) => {
                console.log('headers');
                console.log(res.headers.keys());
                console.log(res.json());
                return res.json();
            })
            .catch(this.handleError);
    }

    getDashboardData(systemName: string): Observable<IDashboard>
    {
        var result: IDashboard;
        let headers = new Headers();
        if (systemName != null) {
            headers.append('SystemName', systemName);
        }
        
        return this.http.get(this._baseBettingUrl + 'dashboard', {
            headers: headers
        })
            .map((res: Response) => {
                console.log('headers');
                console.log(res.headers.keys());
                console.log(res.json());
                return res.json();
            })
            .catch(this.handleError);
    }

    getSelections(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ISelection[]>> {
        var peginatedResult: PaginatedResult<ISelection[]> = new PaginatedResult<ISelection[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseBettingUrl + 'selections', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    getBetfairResults(): Observable<IBetfairResult[]>
    {
        let headers = new Headers();
        //if (systemName != null) {
            //headers.append('Content-Type', 'TOMTEST');
        //}
        
        //return this.http.get(this._baseBetfairUrl + '/Betting/BetfairResults', {
        return this.http.get('http://localhost:54241/Betting/BetfairResults?StartDate=2016-09-25&EndDate=2016-09-26', {
            headers: headers
        })
            .map((res: Response) => {
                console.log('headers');
                console.log(res.headers.keys());
                console.log(res.json());
                return res.json();
            })
            .catch(this.handleError);
    }

    getSystemSelections(id: string, page?: number, itemsPerPage?: number): Observable<PaginatedResult<ISelection[]>> {
        var peginatedResult: PaginatedResult<ISelection[]> = new PaginatedResult<ISelection[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseBettingUrl + 'selections/' + id + '/record', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    getBetfairResultDetails(id: string): Observable<IBetfairResult> {
        console.log(id);

            return this.http.get('http://localhost:54241/Betting/BetfairResult?Id='+id)
                .map((res: Response) => {
                    return res.json();
                })
                .catch(this.handleError);
     }

     saveBetfairResultAsSelection(selection: ISelection): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        return this.http.post(this._baseUrl + 'selections/', JSON.stringify(selection), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
     }


    createBetfairResult(betfairResult: IBetfairResult): Observable<IBetfairResult>
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log('data service - createBetfairResult')
        console.log(betfairResult);

       return this.http.post(this._baseBettingUrl + 'selections/', JSON.stringify(betfairResult), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    

    getSelectionDetails(id: number): Observable<ISelectionDetails> {
        return this.http.get(this._baseBettingUrl + 'selections/' + id + '/record')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getUsers(): Observable<IUser[]> {
        return this.http.get(this._baseUrl + 'users')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getUserSchedules(id: number): Observable<ISchedule[]> {
        return this.http.get(this._baseUrl + 'users/' + id + '/schedules')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    createUser(user: IUser): Observable<IUser> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'users/', JSON.stringify(user), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateUser(user: IUser): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'users/' + user.id, JSON.stringify(user), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'users/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }
    /*
    getSchedules(page?: number, itemsPerPage?: number): Observable<ISchedule[]> {
        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'schedules', {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    */

    getSchedules(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ISchedule[]>> {
        var peginatedResult: PaginatedResult<ISchedule[]> = new PaginatedResult<ISchedule[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'schedules', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    getSchedule(id: number): Observable<ISchedule> {
        return this.http.get(this._baseUrl + 'schedules/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getScheduleDetails(id: number): Observable<IScheduleDetails> {
        return this.http.get(this._baseUrl + 'schedules/' + id + '/details')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateSchedule(schedule: ISchedule): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'schedules/' + schedule.id, JSON.stringify(schedule), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteSchedule(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'schedules/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteScheduleAttendee(id: number, attendee: number) {

        return this.http.delete(this._baseUrl + 'schedules/' + id + '/removeattendee/' + attendee)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            console.log(serverError);
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}