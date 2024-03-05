import { Component, OnInit } from '@angular/core';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  estaciones : any = [];
  hidroelectricas : any = [];
  embalses : any = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    (<HTMLElement>document.getElementById("barra")).style.display = "none";
    this.backendService.getEstaciones().subscribe(res => {
      this.estaciones = res;
  
      this.estaciones.forEach((estacion : any) => {
        if (estacion.tipo === 'hidroeléctrica') {
          this.hidroelectricas.push(estacion);
        } else if (estacion.tipo === 'embalse') {
          this.embalses.push(estacion);
          
        }
      });
    });
  }
}