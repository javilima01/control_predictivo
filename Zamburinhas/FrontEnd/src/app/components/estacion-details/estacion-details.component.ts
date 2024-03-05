import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { Niveles } from 'src/app/services/Niveles';
import { DatosNivelDia } from 'src/app/services/DatosNivelDia';
import { DatosTemp } from 'src/app/services/DatosTemp';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";

@Component({
  selector: 'app-estacion-details',
  templateUrl: './estacion-details.component.html',
  styleUrls: ['./estacion-details.component.css']
})
export class EstacionDetailsComponent implements OnInit {
  estacion: any = [];
  id: any = [];
  estacionNiveles: any = [];
  fechaInicio: any;
  fechaFin: any;
  minDate: any;
  maxDate: any;
  maxDateLimit: any;
  estacionTemperaturas: any = [];
  estacionPrediccion: any = [];
  loading: boolean = true;
  index: number = 0;

  private types: Array<ToastType> = ['success', 'danger', 'warning', 'info', 'primary', 'secondary', 'dark', 'light'];
  constructor(private route: ActivatedRoute, private router: Router, private backendService: BackendService,private toaster: Toaster) { }

  ngOnInit() {
    (<HTMLElement>document.getElementById("barra")).style.display = "flex";
    this.id = this.route.snapshot.paramMap.get('_id');
    this.loading = true;
    //Niveles de la estacion
    this.backendService.getEstacion(this.id).subscribe((res) => {
      this.estacion = res;
      this.backendService.getEstacionNivel(this.estacion.idEstacionNivel).subscribe((res) => {
        this.estacionNiveles = res;


        this.minDate = this.estacionNiveles.datos[0].fecha.substring(0, 10);
        this.maxDate = this.estacionNiveles.datos[this.estacionNiveles.datos.length - 169].fecha.substring(0, 10);

        this.index = Math.floor((this.estacionNiveles.datos.length*0.8/7));

        this.fechaInicio = this.estacionNiveles.datos[this.index*7].fecha.substring(0, 10);
        this.setFechaFin();
        this.graficaEmbalse();
        this.prediccion();
      });

      this.backendService.getEstacionTemp(this.estacion.idEstacionTemp).subscribe((res) => {
        this.estacionTemperaturas = res;
        this.tiempo_semanal();
      });
    });
  }

  prediccion() {
    const nombre = this.estacion.nombre;
    let nuevoNombre = nombre.split(' ').filter((palabra: any) => palabra !== 'Central' && palabra !== 'de').join('_');
    nuevoNombre = nuevoNombre.replace("í","i").replace("á","a").replace("é","e");    
    
    for (let i = 0; i < this.estacionNiveles.datos.length; i++) {
      if (this.estacionNiveles.datos[i].fecha.substring(0, 10) == this.fechaInicio) {
        this.index = Math.floor(i/7);
        break;
      }
    }

    this.backendService.getPrediccion(nuevoNombre, this.index).subscribe((res: any) => {
      this.estacionPrediccion = res.prediccion;
      this.verificarEn2meses();
      this.verificarEn6meses();
      this.loading = false;
    });

  }

  async onFechaInicioChange() {
    this.loading = true;
    this.setFechaFin();
    this.graficaEmbalse();
    this.tiempo_semanal();
    this.prediccion();
  }

  setFechaFin() {
    const fechaInicio = new Date(this.fechaInicio);
    const fechaInicioParcial = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    const fechaFinParcial = new Date(fechaInicioParcial.setFullYear(fechaInicioParcial.getFullYear() + 1));
    if (fechaInicio > fechaFin || fechaFin > fechaFinParcial || isNaN(fechaFin.getTime())) {
      this.fechaFin = fechaFinParcial.toISOString().substring(0, 10);
    }
  }

  graficaEmbalse() {
    const data = [];
    const startDate = Date.parse(this.fechaInicio);
    const endDate = Date.parse(this.fechaFin);
    for (let i = 0; i < this.estacionNiveles.datos.length; i++) {
      const dataDate = Date.parse(this.estacionNiveles.datos[i].fecha);
      if (dataDate >= startDate && dataDate <= endDate) {
        data.push({
          x: dataDate,
          y: parseFloat(this.estacionNiveles.datos[i].reserva),
        });
      }
    }
    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'container',
        type: 'areaspline',
      },
      title: {
        text: 'Reserva (hm3)',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Reserva',
        },
      },
      series: [
        {
          name: 'Reserva',
          type: 'areaspline',
          data,
        },
      ],
      credits: {
        enabled: false
      }
    });
  }

  showToast(text: any, type: any) {
    const toast = this.toaster.open({
      text: text,
      caption: type.toUpperCase() + ' ALERT',
      type: type,
      // colors : "#FFFFFF"
    });
  }

  verificarEn2meses() {
    const maximaFecha = 7;
    const prediccion2meses = this.estacionPrediccion[maximaFecha];
    const maximo = this.estacionNiveles.maximo;
    var color = "#0099CC"
    if(this.estacionPrediccion[maximaFecha] / maximo <= 0.20){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 20% en 2 meses', 'danger');
      color = "#FF0000"
    }else if(this.estacionPrediccion[maximaFecha] / maximo <= 0.40){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 40% en 2 meses', 'warning');
      color = "#FFA500"
    }else if(this.estacionPrediccion[maximaFecha] / maximo <= 0.85){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 85% en 2 meses', 'info');
      color = "#0099CC"
    } else if(this.estacionPrediccion[maximaFecha] / maximo >= 0.85){
      color = "#008000"
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por encima del 85% en 2 meses', 'success');
    }
    
    this.graficaCircular(prediccion2meses, '2 meses', color);
  }

  verificarEn6meses() {
    const maximaFecha = 26;
    const prediccion6meses = this.estacionPrediccion[maximaFecha];
    const maximo = this.estacionNiveles.maximo;
    var color = "#0099CC"
    if(this.estacionPrediccion[maximaFecha] / maximo <= 0.20){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 20% en 6 meses', 'danger');
      color = "#FF0000"
    }else if(this.estacionPrediccion[maximaFecha] / maximo <= 0.40){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 40% en 6 meses', 'warning');
      color = "#FFA500"
    }else if(this.estacionPrediccion[maximaFecha] / maximo <= 0.85){
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por debajo del 85% en 6 meses', 'info');
      color = "#0099CC"
    }else {
      color = "#008000"
      this.showToast('La estación de ' +this.estacion.nombre + ' estará por encima del 85% en 6 meses', 'success');
    }
    this.graficaCircular(prediccion6meses, '6 meses', color);
  }

  graficaCircular(reserva: any, verificar: string, color_nivel:string) {
    const maximo = this.estacionNiveles.maximo;

    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: verificar,
        type: 'piechart',
        events: {
          click: (event: any) => {
            this.router.navigate(['/estacion/alert', this.estacion._id],
              { queryParams: { verificar, fechaInicio: this.index } });
          }
        }
      },
      title: {
        text: 'NIVEL DE EMBALSE EN ' + verificar.toUpperCase(),
      },
      subtitle: {
        text: ((reserva / maximo) * 100).toFixed(2).toString() + "%",
        style: { "font-size": "20px" },
        align: 'center',
        verticalAlign: 'middle'
      },
      plotOptions: {
        pie: {
          size: '100%',
          innerSize: '70%',
          dataLabels: {
            enabled: false
          },
          borderWidth: 0,
          colors: ['#0099CC', '#E0E0E0']
        }
      },
      series: [{
        name: 'Nivel del embalse',
        type: 'pie',
        data: [{
          name: 'Reserva',
          y: reserva / maximo,
          color: color_nivel
        }, {
          name: 'Máximo',
          y: 1 - reserva / maximo,
          color: '#E0E0E0'
        }]
      }],
      tooltip: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    });

  }

  //Tiempo
  temperaturas_semana = [];
  tiempo_semanal() {
    //Vamos a mostar solo el tiempo de esa semana
    const fechaInicio = new Date(this.fechaInicio);
    const fechaSemana = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate() + 8);
    this.temperaturas_semana = this.estacionTemperaturas.temperaturas.filter((dato: DatosTemp) => {
      const fecha = dato.year + "-" + dato.mo + "-" + dato.dy;
      const fechaDato = new Date(fecha);
      return fechaDato >= fechaInicio && fechaDato <= fechaSemana; // corregir la condición del filtro
    });
  }

}
