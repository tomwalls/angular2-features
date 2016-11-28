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
import { IDashboard, IGraphData, ISelection, ISelectionDetails, Pagination, PaginatedResult } from '../shared/interfaces';
import * as moment from 'moment';


@Component({
    moduleId: module.id,
    selector: 'app-selections',
    templateUrl: 'selection-list.component.html',
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
export class SelectionListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    selections: ISelection[];
    dashboard: IDashboard;
    apiHost: string;
    systems: string[];
    selectedSystems: string[] = [];
    startDate: string = '';
    endDate: string = '';
    classList = ["btn-primary", "btn-danger"];

    public itemsPerPage: number = 50;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedSelectionId: number;
    scheduleDetails: ISelectionDetails;
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

        //this.dashboard.timeStart = moment('2016-04-01').format();
        //this.dashboard.timeEnd = moment('2016-10-30').format();

        this.startDate = moment('2016-11-01').format();
        this.endDate = moment('2016-11-30').format();
        this.loadDashboard(['All']);
        this.loadSystemNames();
    }

    loadSelections() {
        this.loadingBarService.start();

        this.dataService.getSelections(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<ISelection[]>) => {
                this.selections = res.result;// schedules;
                console.log(this.selections);
                this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load selections. ' + error);
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

    loadDashboard(selectedSystems: string[]) {
        this.loadingBarService.start();

        this.dataService.getDashboardData(selectedSystems, moment(this.startDate).format(), moment(this.endDate).format())
            .subscribe((res: IDashboard) => {
                this.dashboard = res;// schedules;
                
                console.log('dashboard object');
                console.log(res);
                console.log(this.dashboard.graphData.months);
                
                Highcharts.chart('container', {
                    title: {
                        text: 'Records'
                    },
                    xAxis: {
                        categories: this.dashboard.graphData.months
                    },
                    series: [{
                        data: this.dashboard.graphData.returns
                    }]
                });


                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load selections. ' + error);
            });
    }

    updateFinishingPositions() {
        this.loadingBarService.start();

        this.dataService.updateFinishingPositionsThenGetDashboardData(moment(this.startDate).format(), moment(this.endDate).format())
            .subscribe((res: IDashboard) => {
                this.dashboard = res;// schedules;
                
                console.log('dashboard object');
                console.log(res);
                console.log(this.dashboard.graphData.months);
                
                Highcharts.chart('container', {
                    title: {
                        text: 'Records'
                    },
                    xAxis: {
                        categories: this.dashboard.graphData.months
                    },
                    series: [{
                        data: this.dashboard.graphData.returns
                    }]
                });


                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load selections. ' + error);
            });
    }

    loadSystemSelections(system: string)
    {
        this.loadingBarService.start();

        this.dataService.getSystemSelections(system, this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<ISelection[]>) => {
                console.log(this.itemsPerPage)
                this.selections = res.result;// selections;
                this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load selections. ' + error);
            });
    }

    addSystemToSelectedSystems(system: string)
    {
        console.log('selected system')
        console.log(system);
        if(system == 'All')
        {
            this.selectedSystems = ['All'];
        }
        else
        {
            var index = this.selectedSystems.indexOf(system, 0);
            if (index > -1) {
                this.selectedSystems.splice(index, 1);
            }
            else
            {
                this.selectedSystems.push(system)
            }

        }

            console.log(this.selectedSystems);
            this.loadDashboard(this.selectedSystems);
    }


    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadSelections();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };

    removeSelection(selection: ISelection) {
        this.notificationService.openConfirmationDialog('Are you sure you want to delete this selection?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteSchedule(selection.id)
                    .subscribe(() => {
                        this.itemsService.removeItemFromArray<ISelection>(this.selections, selection);
                        this.notificationService.printSuccessMessage(selection.horse + ' has been deleted.');
                        this.loadingBarService.complete();
                    },
                    error => {
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Failed to delete ' + selection.horse + ' ' + error);
                    });
            });
    }

    viewSelectionDetails(id: number) {
        this.selectedSelectionId = id;

        this.dataService.getSelectionDetails(this.selectedSelectionId)
            .subscribe((schedule: ISelectionDetails) => {
                this.scheduleDetails = this.itemsService.getSerialized<ISelectionDetails>(schedule);
                // Convert date times to readable format
                /*this.scheduleDetails.timeStart = new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.scheduleDetails.timeEnd = new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.loadingBarService.complete();
                this.selectedScheduleLoaded = true;
                this.childModal.show();//.open('lg');*/
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load selection. ' + error);
            });
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }
}