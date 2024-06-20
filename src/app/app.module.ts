import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { AvatarModule } from 'ngx-avatar';
import { HttpClientModule  } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

/* import { environment } from '../environments/environment'; */
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { CreateCustomerComponent } from './pages/create-customer/create-customer.component';
import { CustomerService } from './providers/customer.service';
import { AddCustomerComponent } from './pages/add-customer/add-customer.component';

import { MatTableModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HelperServiceService } from './providers/helper-service.service';
import { SearchCustomerComponent } from './pages/search-customer/search-customer.component';
import { ViewCustomerComponent } from './pages/view-customer/view-customer.component';
import { UpdateCustomerComponent } from './pages/update-customer/update-customer.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BranchService } from './providers/branch.service';
import { SpinnerService } from './providers/spinner.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';
import { ToastService } from './providers/toast.service';
import { MessageService } from './providers/message.service';
import { DialogConfirmComponent } from './pages/dialog-confirm/dialog-confirm.component';
import { ReportComponent } from './pages/report/report.component';
import { CountService } from './providers/count.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    CreateCustomerComponent,
    AddCustomerComponent,
    SearchCustomerComponent,
    ViewCustomerComponent,
    UpdateCustomerComponent,
    PaymentComponent,
    DialogConfirmComponent,
    ReportComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(
      {positionClass: 'toast-bottom-right'}
    ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase, 'ImanIslamicAssociation'),
    AngularFirestoreModule,
    AvatarModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  providers: [
    CustomerService,
    CountService,
    HelperServiceService,
    BranchService,
    SpinnerService,
    ToastService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
