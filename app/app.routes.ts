import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';
import { SelectionListComponent } from './selections/selection-list.component';
import { BetfairListComponent } from './betfairResults/betfair-list.component';
import { BetfairEditComponent } from './betfairResults/betfair-edit.component';
import { QualifiersListComponent } from './qualifiers/qualifiers-list.component';
import { ScheduleEditComponent } from './schedules/schedule-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [
    { path: 'users', component: UserListComponent },
    { path: 'schedules', component: ScheduleListComponent },
    { path: 'schedules/:id/edit', component: ScheduleEditComponent },
    { path: 'selections', component: SelectionListComponent },
    { path: 'betfair', component: BetfairListComponent },
    { path: 'betfairResult/:id/edit', component: BetfairEditComponent },
    { path: 'qualifiers', component: QualifiersListComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);