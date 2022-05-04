import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateRootComponent } from './candidate/candidate-root/candidate-root.component';
import { ListComponent } from './candidate/candidate-root/list/list.component';
import { FormComponent } from './candidate/candidate-root/form/form.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LogoComponent } from './layout/logo/logo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { CandidateModalComponent } from './candidate/candidate-root/candidate-modal/candidate-modal.component';
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
// import { ToastrModule } from 'ngx-toastr';
// import {TimeAgoPipe} from 'time-ago-pipe';
import { DaysAgoPipe } from './days-ago.pipe';
@NgModule({
  declarations: [
    AppComponent,
    CandidateRootComponent,
    ListComponent,
    FormComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    // TimeAgoPipe,
    LogoComponent,
    CandidateModalComponent,
    DaysAgoPipe
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    MatDividerModule,
    MatSortModule,
    // ToastrModule.forRoot(), 
    GooglePlaceModule,
    Ng2TelInputModule,
    NgxIntlTelInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
