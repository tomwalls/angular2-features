import './rxjs-operators';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ProgressbarModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SlimLoadingBarService, SlimLoadingBarComponent } from 'ng2-slim-loading-bar';
import { TimepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent }   from './app.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { HomeComponent } from './home/home.component';
import { MobileHideDirective } from './shared/directives/mobile-hide.directive';
import { ScheduleEditComponent } from './schedules/schedule-edit.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';
import { SelectionListComponent } from './selections/selection-list.component';
import { QualifiersListComponent } from './qualifiers/qualifiers-list.component';
import { BetfairListComponent } from './betfairResults/betfair-list.component';
import { BetfairEditComponent } from './betfairResults/betfair-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserCardComponent } from './users/user-card.component';
import { UserListComponent } from './users/user-list.component';
import { routing } from './app.routes';
import { UPLOAD_DIRECTIVES, NgFileDropDirective } from 'ng2-uploader';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

import { DataService } from './shared/services/data.service';
import { ConfigService } from './shared/utils/config.service';
import { ItemsService } from './shared/utils/items.service';
import { MappingService } from './shared/utils/mapping.service';
import { NotificationService } from './shared/utils/notification.service';

@NgModule({
    imports: [
        BrowserModule,
        DatepickerModule,
        FormsModule,
        HttpModule,
        Ng2BootstrapModule,
        ModalModule,
        ProgressbarModule,
        PaginationModule,
        routing,
        TimepickerModule
    ],
    declarations: [
        AppComponent,
        DateFormatPipe,
        HighlightDirective,
        HomeComponent,
        MobileHideDirective,
        ScheduleEditComponent,
        ScheduleListComponent,
        SelectionListComponent,
        QualifiersListComponent,
        BetfairListComponent,
        BetfairEditComponent,
        SlimLoadingBarComponent,
        UserCardComponent,
        UserListComponent,
        UPLOAD_DIRECTIVES,
        NgFileDropDirective,
        FileDropDirective,
        FileSelectDirective,
        DashboardComponent
    ],
    providers: [
        ConfigService,
        DataService,
        ItemsService,
        MappingService,
        NotificationService,
        SlimLoadingBarService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
