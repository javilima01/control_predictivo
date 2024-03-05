import { Component, OnInit, NgModule } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import * as Highcharts from "highcharts/highmaps";
import { Niveles } from 'src/app/services/Niveles';

declare module 'highcharts' {
  interface PointOptionsObject {
    url?: string;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  estacionNivel: any = null;
  gauge: Highcharts.Chart | undefined;
  Highcharts = Highcharts;

  estaciones: any = [];
  hidroelectricas: any = [];
  embalses: any = [];
  niveles: any = [];
  nivel1: any = [];
  nivel2: any = [];
  nivel3: any = [];
  nivel4: any = [];

  fechaInicio: any;
  fechaFin: any;
  minDate: any = [];
  maxDate: any = [];
  j: any;

  dato: any;
  capacidad: any;
  fecha: any;
  index: any;

  estacionNivel2: Niveles[] = [];

  loading: boolean = true;

  constructor(private backendService: BackendService/* , private toaster: Toaster */) { }

  ngOnInit() {
    (<HTMLElement>document.getElementById("barra")).style.display = "flex";
    this.loading = true;
    this.backendService.getEstacionesNiveles().subscribe(res => {
      this.niveles = res;

      this.niveles.forEach((nivel: any) => {
        this.minDate = nivel.datos[3].fecha.substring(0, 10);
        this.maxDate = nivel.datos[nivel.datos.length - 1].fecha.substring(0, 10);
        
        this.fechaInicio = nivel.datos[3].fecha.substring(0, 10);
        this.setFechaFin();

        const startDate = Date.parse(this.fechaInicio);
        const endDate = Date.parse(this.fechaFin);

        this.hallarFecha(nivel, startDate);

      });

      this.createChart();
      this.prepararChart2();

    });


  }

  prepararChart2() {
    this.backendService.getEstacionesNiveles().subscribe((res: any) => {
      this.estacionNivel = res;
      var data: Array<[string, number, number]> = res.map((estacion: any) => {
        var Dato = estacion.datos[this.j];
        return [estacion.nombre, Dato.reserva];
      });

      this.createChart2(data);
      this.loading = false;
    });
  }

  convertDateFormat(string: any) {
    var info = string.split('-').reverse().join('/');
    return info;
  }

  hallarFecha(nivel: any, startDate: any) {

    this.j = 0;
    var dataDate;

    for (let i = 0; i < nivel.datos.length; i++) {
      dataDate = Date.parse(nivel.datos[i].fecha.substring(0, 10));
      if (dataDate === startDate) break;
      else this.j++;
    }

    this.j = this.j == nivel.datos.length ? this.j-1 : this.j;
    
    this.nivel1.push(nivel.datos[this.j].reserva);
    this.nivel2.push(nivel.datos[(this.j) - 1].reserva);
    this.nivel3.push(nivel.datos[(this.j) - 2].reserva);
    this.nivel4.push(nivel.datos[(this.j) - 3].reserva);
  }

  onFechaInicioChange() {
    this.loading = true;

    this.nivel1 = [];
    this.nivel2 = [];
    this.nivel3 = [];
    this.nivel4 = [];

    this.setFechaFin();

    this.niveles.forEach((nivel: any) => {
      const startDate = Date.parse(this.fechaInicio);
      this.hallarFecha(nivel, startDate);

    });

    this.prepararChart2();
  }

  setFechaFin() {
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(fechaInicio.setFullYear(fechaInicio.getFullYear() + 1));
    const maxDate = new Date(this.maxDate);
    this.fechaFin = fechaFin < maxDate ? fechaFin.toISOString().substring(0, 10) : this.maxDate.toISOString().substring(0, 10);
  }

  createChart() {

    (async () => {

      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/es/es-all.topo.json'
      ).then(response => response.json());

      const data = [];

      // Create the chart
      // @ts-ignore
      Highcharts.mapChart('container', {
        chart: {
          map: topology,
          // height: (9 / 16 * 100) + '%' // 16:9 ratio
        },

        title: {
          text: 'Ubicación centrales y embalses'
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom',
            align: 'left'
          }
        },

        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>';
          }
        },

        credits: {
          enabled: false
        },

        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function () {
                  location.href = this.options.url!;
                }
              }
            }
          }
        },

        colorAxis: {
          visible: false,
        },

        series: [{
          mapData: topology,
          name: 'Basemap',
          borderColor: '#A0A0A0',
          nullColor: 'rgba(200, 200, 200, 0.3)',
          showInLegend: false,
          states: {
            hover: {
              color: '#BADA55'
            }
          }
        },
        {
          type: 'mappoint',
          colorKey: 'nivelembalse',
          color: '#333',
          enableMouseTracking: true,
          dataLabels: {
            format: '<b>{point.name}</b>',
            verticalAlign: 'middle'
          },
          data: [
            {
              name: 'Central de Aldeadávila',
              lat: 41.21211159893668,
              lon: -6.685594897938708,
              url: "/estacion/641c9cba1d4389fc22b372b6",
              dataLabels: {
                align: 'right'
              }
            },
            {
              name: 'Cedillo',
              lat: 39.66779396509576,
              lon: -7.539474589040334,
              url: "/estacion/641c9dce1d4389fc22b3826a",
              dataLabels: {
                align: 'right'
              }
            },
            {
              name: 'Central de Aguayo',
              lat: 43.097493232291775,
              lon: -3.9998186165069036,
              url: "/estacion/641c9f881d4389fc22b3fff9",
              dataLabels: {
                align: 'up'
              }
            },
            {
              name: 'Central de Saucelle',
              lat: 41.03809694749071,
              lon: -6.802881200882077,
              url: "/estacion/641ca3771d4389fc22b48d36",
              dataLabels: {
                align: 'left',
                verticalAlign: 'top'
              }
            },
            {
              name: 'Central de Villarino',
              lat: 41.26547534089663,
              lon: -6.495000406071093,
              url: "/estacion/641ca38c1d4389fc22b49cea",
              dataLabels: {
                align: 'left',
                verticalAlign: 'bottom'
              }
            },
            {
              name: 'Central José María de Oriol',
              lat: 39.729256026713024,
              lon: -6.885491270171535,
              url: "/estacion/641ca3b41d4389fc22b4bc52",
              dataLabels: {
                align: 'left'
              }
            },
            {
              name: 'Mequinenza',
              lat: 41.36934224588879,
              lon: 0.2742791636874091,
              url: "/estacion/641ca3c41d4389fc22b4cc06",
              dataLabels: {
                align: 'right'
              }
            }
          ],
        }
        ]
      });

    })();
  }

  createChart2(data: [string, number, number][]) {
    this.gauge = this.Highcharts.chart({
      chart: {
        renderTo: 'container2',
        type: 'piechart'
      },
      title: {
        text: 'Contribución de cada embalse al volumen total',
        style: {
          color: '#333',
          fontWeight: 'bold'
        },
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Datos',
        type: 'pie',
        data: data
      }]
    });
  }
}