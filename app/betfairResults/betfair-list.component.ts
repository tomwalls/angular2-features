import { Component, OnInit, ViewChild, Input, Output, EventEmitter,
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
     @Output() recordCreated = new EventEmitter();

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
    betfairResultDetails: IBetfairResult;
    selectedbetfairResultLoaded: boolean = false;
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
        this.loadSystemNames();
        this.loadBetfairResults();
    }

    createRecord(record: IBetfairResult) {
            //this.slimLoader.start();
            console.log('creating record');
            console.log(record);
            this.dataService.createBetfairResult(record)
                .subscribe((recordCreated) => {
                   // this.user = this.itemsService.getSerialized<IUser>(userCreated);
                    //this.edittedUser = this.itemsService.getSerialized<IUser>(this.user);
                   // this.onEdit = false;

                    this.recordCreated.emit({ value: recordCreated });
                    //this.slimLoader.complete();
                },
                error => {
                    this.notificationService.printErrorMessage('Failed to created user');
                    this.notificationService.printErrorMessage(error);
                    //this.slimLoader.complete();
                });
        }

    loadSystemNames()
    {
        this.dataService.getSystemNames()
            .subscribe((res: string[]) => {
                this.systems = res;// schedules;
                console.log('systems object');
                console.log(this.systems);

            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load system names. ' + error);
            });
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

    assignSystem(systemName: string)
    {

        this.betfairResultDetails.system = systemName;

        this.hideChildModal();  

        /*this.dataService.getScheduleDetails(this.selectedScheduleId)
            .subscribe((schedule: IScheduleDetails) => {
                this.scheduleDetails = this.itemsService.getSerialized<IScheduleDetails>(schedule);
                // Convert date times to readable format
                this.scheduleDetails.timeStart = new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.scheduleDetails.timeEnd = new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.loadingBarService.complete();
                this.selectedScheduleLoaded = true;
                this.childModal.show();//.open('lg');
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
            });*/
    }

    
    viewSystems(betFairResult: IBetfairResult)
    {
        this.loadSystemNames();

        this.betfairResultDetails = betFairResult;
        this.selectedbetfairResultLoaded = true;
        this.childModal.show();//.open('lg');   
    }

     public hideChildModal(): void {
        this.childModal.hide();
    }


    createBetfairResult(betFairResult: IBetfairResult) {
        console.log('createBetfairResult');

        this.notificationService.openConfirmationDialog('Are you sure you want to save this result?',
            () => {
                this.loadingBarService.start();
                this.dataService.createBetfairResult(betFairResult)
                    .subscribe(() => {
                        //this.itemsService.removeItemFromArray<ISchedule>(this.schedules, schedule);
                        this.notificationService.printSuccessMessage(betFairResult.itemDescription.runnerDesc + ' has been saved.');
                        this.loadingBarService.complete();
                    },
                    error => {
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Failed to delete ' + betFairResult.itemDescription.runnerDesc + ' ' + error);
                    });
            });

    }

}