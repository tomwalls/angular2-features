import { Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition } from '@angular/core';

import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import { DataService } from '../shared/services/data.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { IDashboard, IBetfairResult, ISelection, ISelectionDetails, Pagination, PaginatedResult } from '../shared/interfaces';

@Component({
    moduleId: module.id,
    selector: 'app-betfair',
    templateUrl: 'betfair-list.component.html',
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class BetfairListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    betfairResults: IBetfairResult[];
    dashboard: IDashboard;
    apiHost: string;
    systems: string[];

    public itemsPerPage: number = 50;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedbetfairId: number;
    //scheduleDetails: IbetfairDetails;
    selectedScheduleLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    options: Object;

    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private loadingBarService:SlimLoadingBarService) { }

    ngOnInit() {
       
        console.log(this.options);
        this.apiHost = this.configService.getBettingApiHost();
        this.loadBetfairResults();
    }


    loadBetfairResults()
    {
        this.dataService.getBetfairResults()
            .subscribe((res: IBetfairResult[]) => {
                this.betfairResults = res;// schedules;
                console.log('betfair object');
                console.log(this.betfairResults);

            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load system names. ' + error);
            });
    }
}