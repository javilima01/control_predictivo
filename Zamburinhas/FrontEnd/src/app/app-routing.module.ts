import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstacionDetailsComponent } from './components/estacion-details/estacion-details.component';
import { EstacionAlertComponent } from './components/estacion-alert/estacion-alert.component';
import { HomeComponent } from './components/home/home.component';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' }, // redirigir a página de inicio
  { path: '', component: InicioComponent }, // componente para página de inicio
  { path: 'home', component: HomeComponent }, // componente para página de inicio
  { path: 'estacion/:_id', component: EstacionDetailsComponent },
  { path: 'estacion/alert/:_id', component: EstacionAlertComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }