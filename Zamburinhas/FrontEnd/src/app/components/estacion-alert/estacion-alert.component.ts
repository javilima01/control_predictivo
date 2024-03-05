import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { BackendService } from 'src/app/services/backend.service';
import { DatosNivelDia } from 'src/app/services/DatosNivelDia';

@Component({
  selector: 'app-estacion-alert',
  templateUrl: './estacion-alert.component.html',
  styleUrls: ['./estacion-alert.component.css']
})
export class EstacionAlertComponent implements OnInit {
  estacion: any = [];
  estacionNiveles: any = [];
  estacionPrediccion: any = [];
  estacionReales: any = [];
  Id: any = [];
  verificar: string = '';
  indexInicio: any;
  fechaInicio: any;
  error: any;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private backendService: BackendService) { }

  ngOnInit(): void {
    (<HTMLElement>document.getElementById("barra")).style.display = "flex";
    this.Id = this.route.snapshot.paramMap.get('_id');
    this.loading = true;
    this.verificar = this.route.snapshot.queryParams["verificar"];
    this.indexInicio = this.route.snapshot.queryParams["fechaInicio"];

    this.backendService.getEstacion(this.Id).subscribe((res: any) => {
      this.estacion = res;
      this.backendService.getEstacionNivel(this.estacion.idEstacionNivel).subscribe((res) => {
        this.estacionNiveles = res;
        this.fechaInicio = this.estacionNiveles.datos[this.indexInicio*7].fecha.substring(0, 10);
      });

      const nombre = this.estacion.nombre;
      let nuevoNombre = nombre.split(' ').filter((palabra: any) => palabra !== 'Central' && palabra !== 'de').join('_');
      nuevoNombre = nuevoNombre.replace("í", "i").replace("á", "a").replace("é", "e");
      this.backendService.getPrediccion(nuevoNombre, this.indexInicio).subscribe((res: any) => {
        this.estacionPrediccion = res.prediccion;
        this.arregloDatos();
        this.loading = false;
        this.comparacion();

      });


    });

  }

  arregloDatos() {
    const maximo = this.estacionNiveles.maximo;
    const fechaInicio = new Date(this.fechaInicio);
    const fechaSeisMesesDespues = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 6, fechaInicio.getDate());

    const datos6meses = this.estacionNiveles.datos.filter((dato: DatosNivelDia) => {
      const fechaDato = new Date(dato.fecha);
      return fechaDato >= fechaInicio && fechaDato <= fechaSeisMesesDespues;
    });

    const datosReales: any = [];
    const datosPrediccion: any = [];
    let i = 0;
    let semana = 0;
    let suma = 0;
    datos6meses.forEach((dato: DatosNivelDia) => {
      suma += dato.reserva;
      i++;
      if (i == 7) {
        const dataDate = new Date(datos6meses[7 * semana].fecha);
        datosReales.push({
          x: dataDate,
          y: (suma / 7),
        });
        datosPrediccion.push({
          x: dataDate,
          y: this.estacionPrediccion[semana],
        });
        semana++;
        suma = 0;
        i = 0;
      }
    });

    this.estacionReales = datosReales;
    this.estacionPrediccion = datosPrediccion;
  }

  comparacion() {
    let dataPrediccion = this.estacionPrediccion;
    let dataReal = this.estacionReales;

    if (this.verificar == '2 meses') {
      dataPrediccion = this.estacionPrediccion.slice(0, 7);
      dataReal = this.estacionReales.slice(0, 7);
    }

    let total = 0;
    for (let i = 0; i < dataReal.length; i++) {
      total = total + Math.abs((dataReal[i].y - dataPrediccion[i].y));
    }
    const avg = total / dataReal.length;
    this.error = ((avg / this.estacionNiveles.maximo) * 100).toFixed(2);

    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'container',
        type: 'line',
      },
      title: {
        text: 'Comparación datos históricos vs predicción (hm3)',
        style: { "font-size": "20px" },
      },
      subtitle:{
        text: 'Error: ' +this.error + '%',
        style: { "font-size": "15px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Nivel de reserva',
        },
      },
      series: [
        {
          name: 'Reserva',
          type: 'line',
          data: dataReal,
        },
        {
          name: 'Predicción',
          type: 'line',
          data: dataPrediccion,
        },
      ],
      credits: {
        enabled: false
      }
    });
  }


}
