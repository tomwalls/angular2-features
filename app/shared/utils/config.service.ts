import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    
    _apiURI : string;
    _bettingApiURI : string;

    constructor() {
        this._apiURI = 'http://localhost:8153/api/';
        this._bettingApiURI = 'http://localhost:8153/api/';
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
}