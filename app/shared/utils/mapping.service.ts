import { Injectable } from '@angular/core';

import { ISchedule, IScheduleDetails, IUser, ISelection, IBetfairResult } from '../interfaces';
import  { ItemsService } from './items.service'

@Injectable()
export class MappingService {

    constructor(private itemsService : ItemsService) { }

    mapScheduleDetailsToSchedule(scheduleDetails: IScheduleDetails): ISchedule {
        var schedule: ISchedule = {
            id: scheduleDetails.id,
            title: scheduleDetails.title,
            description: scheduleDetails.description,
            timeStart: scheduleDetails.timeStart,
            timeEnd: scheduleDetails.timeEnd,
            location: scheduleDetails.location,
            type: scheduleDetails.type,
            status: scheduleDetails.status,
            dateCreated: scheduleDetails.dateCreated,
            dateUpdated: scheduleDetails.dateUpdated,
            creator: scheduleDetails.creator,
            creatorId: scheduleDetails.creatorId,
            attendees: this.itemsService.getPropertyValues<IUser, number[]>(scheduleDetails.attendees, 'id')
        }

        return schedule;
    }

    mapBetfairResultDetailsToSelection(betfairResultDetails: IBetfairResult): ISelection {
        var selection: ISelection = {
            id: betfairResultDetails.betId,

            system: betfairResultDetails.system,
            subSystem: '',
            date: betfairResultDetails.settledDate,
            course: '',
            horse: betfairResultDetails.itemDescription.runnerDesc,
            stake: betfairResultDetails.sizeSettled,
            odds: betfairResultDetails.priceMatched,
            result: betfairResultDetails.betOutcome,
            profit: betfairResultDetails.profit

        }

        return selection;
    }

}