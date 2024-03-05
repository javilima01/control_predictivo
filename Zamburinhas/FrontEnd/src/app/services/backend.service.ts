import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Niveles } from './Niveles';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  REST_API: string = 'http://localhost:4000';

  PREDICT_API : string = 'http://localhost:8080';

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  options = { headers: this.headers };


  constructor(private httpClient: HttpClient) { }

  getEstaciones() {
    return this.httpClient.get(`${this.REST_API}/getEstaciones`);
  }

  getEstacion(id: any) {
    return this.httpClient.get(`${this.REST_API}/getEstacion/${id}`);
  }

  getEstacionesNiveles(): Observable<Niveles[]> {
    return this.httpClient.get<Niveles[]>(`${this.REST_API}/getEstacionesNivel/`);
  }

  getEstacionNivel(id: any) {
    return this.httpClient.get(`${this.REST_API}/getEstacionNivel/${id}`);
  }

  getEstacionTemp(id: any) {
    return this.httpClient.get(`${this.REST_API}/getEstacionTemp/${id}`);
  }

  getPrediccion(nombre:any, indice:any): Observable<any>{
    return this.httpClient.get(`${this.PREDICT_API}/prediccion?central=${nombre}&fecha=${indice}`);
  }
}