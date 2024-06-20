import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { CreateCustomerComponent } from './pages/create-customer/create-customer.component';
import { ReportComponent } from './pages/report/report.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-customer', component: CreateCustomerComponent },
  { path: 'report', component: ReportComponent },
  { path: '', component: HomeComponent },

  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
  { path: 'page-not-found', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
