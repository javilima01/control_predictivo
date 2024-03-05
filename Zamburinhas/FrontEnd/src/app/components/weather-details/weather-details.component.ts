import { Component, Input } from '@angular/core';
import { DatosTemp } from 'src/app/services/DatosTemp';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent {

  @Input() temperaturas_semana: any = [];

  
  constructor() { }

  resolverImagen(datosTemperaturas: DatosTemp): string {
    const temperatura = datosTemperaturas.t2m;
    const humedad = datosTemperaturas.rh2m;
    const precipitacion = datosTemperaturas.prectotcorr;
    const viento = datosTemperaturas.ts;

    if (temperatura >= 35) {
      // Muy caliente
      return 'assets/clear.png';
    } else if (temperatura >= 25 && temperatura < 35) {
      // Caliente
      if (precipitacion > 0) {
        // Lluvia con calor
        return 'assets/cloudy.png';
      } else {
        return 'assets/clear.png';
      }
    } else if (temperatura >= 15 && temperatura < 25) {
      // Agradable
      if (humedad > 60) {
        // Clima nublado
        return 'assets/mcloudy.png';
      } else {
        return 'assets/clear.png';
      }
    } else if (temperatura >= 5 && temperatura < 15) {
      // Fresco
      if (viento > 10) {
        // Clima con viento
        return 'assets/ishower.png';
      } else {
        return 'assets/cloudy.png';
      }
    } else {
      // Muy frío
      if (precipitacion > 0) {
        // Clima de nieve
        return 'assets/snow.png';
      } else {
        return 'assets/mcloudy.png';
      }
    }
  }


}
