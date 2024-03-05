import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstacionDetailsComponent } from './components/estacion-details/estacion-details.component';
import { HomeComponent } from './components/home/home.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { EstacionAlertComponent } from './components/estacion-alert/estacion-alert.component';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ToastNotificationsModule } from "ngx-toast-notifications";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EstacionDetailsComponent,
    EstacionAlertComponent,
    WeatherDetailsComponent,
    LoadingComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
    ToastNotificationsModule.forRoot({
      autoClose: false,
      preventDuplicates: true,
      position: 'top-right',
    }),
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }