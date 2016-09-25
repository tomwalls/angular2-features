import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    
    _apiURI : string;
    _bettingApiURI : string;
    _betfairApiURI : string;

    constructor() {
        this._apiURI = 'http://localhost:8153/api/';
        this._bettingApiURI = 'http://localhost:8153/api/';
        this._betfairApiURI = 'http://localhost:54241/api/';
     }

     getApiURI() {
         return this._apiURI;
     }

     getApiHost() {
         return this._apiURI.replace('api/','');
     }

     getBettingApiURI() {
         return this._bettingApiURI;
     }

      getBettingApiHost() {
         return this._bettingApiURI.replace('api/','');
     }

     
      getBetfairApiHost() {
         return this._betfairApiURI.replace('api/','');
     }
}