import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { MappingService } from '../shared/utils/mapping.service';
import { IBetfairResult, ISchedule, IScheduleDetails, IUser } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

@Component({
    moduleId: module.id,
    selector: 'app-betfair-edit',
    templateUrl: 'betfair-edit.component.html'
})
export class BetfairEditComponent implements OnInit {
    apiHost: string;
    id: string;
    betfairResult: IBetfairResult;
    betfairResultLoaded: boolean = false;
    statuses: string[];
    types: string[];
    systemName: string;
    private sub: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private mappingService: MappingService,
        private loadingBarService:SlimLoadingBarService) { }

    ngOnInit() {
        // (+) converts string 'id' to a number
	    this.id = this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadBetfairResultDetails();
    }

    loadBetfairResultDetails() {
        this.loadingBarService.start();
        this.dataService.getBetfairResultDetails(this.id)
            .subscribe((betfairResult: IBetfairResult) => {
                this.betfairResult = this.itemsService.getSerialized<IBetfairResult>(betfairResult[0]);
                console.log(this.betfairResult);
                console.log('result returned');
                this.betfairResultLoaded = true;
                // Convert date times to readable format
               // this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
               // this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
               // this.statuses = this.schedule.statuses;
               // this.types = this.schedule.types;
                this.systemName = '';
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load result. ' + error);
            });
    }

    updateBetfairResult(editBetfairResultForm: NgForm) {
        console.log(editBetfairResultForm.value);

        var betfairResultMapped = this.mappingService.mapBetfairResultDetailsToSelection(this.betfairResult);

        console.log(betfairResultMapped);

        this.loadingBarService.start();
        this.dataService.saveBetfairResultAsSelection(betfairResultMapped)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Schedule has been updated');
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
            });
    }

    /*removeAttendee(attendee: IUser) {
        this.notificationService.openConfirmationDialog('Are you sure you want to remove '
            + attendee.name + ' from this schedule?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteScheduleAttendee(this.schedule.id, attendee.id)
                    .subscribe(() => {
                        this.itemsService.removeItemFromArray<IUser>(this.schedule.attendees, attendee);
                        this.notificationService.printSuccessMessage(attendee.name + ' will not attend the schedule.');
                        this.loadingBarService.complete();
                    },
                    error => {
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Failed to remove ' + attendee.name + ' ' + error);
                    });
            });
    }*/

    back() {
        this.router.navigate(['/betfair']);
    }

}