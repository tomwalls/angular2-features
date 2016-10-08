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
import { FileUploader } from 'ng2-file-upload';
import { UPLOAD_DIRECTIVES } from 'ng2-uploader';

// upload url
const URL = 'http://localhost:8153/api/csv/import';

@Component({
    moduleId: module.id,
    selector: 'app-qualifiers',
    templateUrl: 'qualifiers-list.component.html',
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
export class QualifiersListComponent implements OnInit {

uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: Object = {
    url: 'http://localhost:8153/api/csv/import'
  };

  handleUpload(data): void {
      console.log("data");
      console.log(data);
      console.log(data.response);
    if (data && data.response) {
      console.log('inside the if')
      console.log(data);
      console.log(data.respone);
      data = JSON.parse(data.response);
      console.log(data);
      this.uploadFile = data;
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }


    public uploader:FileUploader = new FileUploader({url: URL});
    //public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;
    
    //public fileOverBase(e:any):void {
    //this.hasBaseDropZoneOver = e;
    //}
    
    public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
    }

    @ViewChild('childModal') public childModal: ModalDirective;
    selections: ISelection[];
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
    selectedSelectionId: number;
    scheduleDetails: ISelectionDetails;
    selectedScheduleLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    //options: Object;

    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private loadingBarService:SlimLoadingBarService) { }

    ngOnInit() {
       
        console.log(this.options);
        this.apiHost = this.configService.getBettingApiHost();
        //this.loadDashboard(null);
        //this.loadSystemNames();
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

    loadDashboard(systemName: string) {
        this.loadingBarService.start();

        this.dataService.getDashboardData(systemName)
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