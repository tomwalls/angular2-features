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
    url: 'http://localhost:8153/api/qualifiers/import'
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

    this.loadQualifers();
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

    public uploader:FileUploader = new FileUploader({url: URL});
    public hasAnotherDropZoneOver:boolean = false;
    
    public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
    }

    @ViewChild('childModal') public childModal: ModalDirective;
    qualifiers: ISelection[];
    dashboard: IDashboard;
    apiHost: string;
    systems: string[];
    @Output() qualifierCreated = new EventEmitter();

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
       
        //console.log(this.options);
        this.apiHost = this.configService.getBettingApiHost();
        //this.loadDashboard(null);
        //this.loadSystemNames();
        this.loadQualifers();
    }

    loadQualifers() {
        this.loadingBarService.start();

        this.dataService.getQualifiers()
             .subscribe((res: ISelection[]) => {
                this.qualifiers = res;// schedules;
               // console.log(this.selections);
                //this.totalItems = res.pagination.TotalItems;
                console.log(this.qualifiers)
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load qualifiers. ' + error);
            });
    }

    createQualifier(qualifier: ISelection) {
            //this.slimLoader.start();
            console.log('creating qualifier');
            console.log(qualifier);
            this.dataService.createQualifier(qualifier)
                .subscribe((qualifierCreated) => {
                   // this.user = this.itemsService.getSerialized<IUser>(userCreated);
                    //this.edittedUser = this.itemsService.getSerialized<IUser>(this.user);
                   // this.onEdit = false;

                    this.qualifierCreated.emit({ value: qualifierCreated });
                    //this.slimLoader.complete();
                },
                error => {
                    this.notificationService.printErrorMessage('Failed to created user');
                    this.notificationService.printErrorMessage(error);
                    //this.slimLoader.complete();
                });
        }
    
    deleteQualifier(qualifier: ISelection) {
            //this.slimLoader.start();
            console.log('deleting qualifier');
            console.log(qualifier);
            this.dataService.deleteQualifier(qualifier)
                .subscribe((qualifierCreated) => {
                   // this.user = this.itemsService.getSerialized<IUser>(userCreated);
                    //this.edittedUser = this.itemsService.getSerialized<IUser>(this.user);
                   // this.onEdit = false;

                    this.qualifierCreated.emit({ value: qualifierCreated });
                    //this.slimLoader.complete();
                },
                error => {
                    this.notificationService.printErrorMessage('Failed to created user');
                    this.notificationService.printErrorMessage(error);
                    //this.slimLoader.complete();
                });
        }
}