// angular import
import { Component, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';
import { ProductSaleComponent } from './product-sale/product-sale.component';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';
import { Card, Dashboard } from 'src/app/core/models/interface/Dashboard';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, Observable } from 'rxjs';
import { PaginationResponse, Response } from 'src/app/core/models/generic/Response';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  theme: ApexTheme;
};

@Component({
  selector: 'app-dash-analytics',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, ProductSaleComponent],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export default class DashAnalyticsComponent {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('customerChart') customerChart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  chartOptions_1!: Partial<ChartOptions>;
  chartOptions_2!: Partial<ChartOptions>;
  chartOptions_3!: Partial<ChartOptions>;
  cards: Card[] = []
  dashboard: Dashboard;
  // constructor

  ngOnInit(){
    this.getDashboard()
  }

  constructor(
    private dashboardService: DashboardService,
    private nzMessageService: NzMessageService
  ) {
    this.dashboard = {
      totalOrders: 0,
      totalProducts: 0,
      totalRevenue: 0
    },
    this.cards = [
      {
        background: 'bg-c-blue',
        title: 'Tổng số đơn hàng',
        icon: 'icon-shopping-cart',
        text: 'Tổng số đơn hàng',
        number: this.dashboard.totalOrders.toString(),
      },
      {
        background: 'bg-c-green',
        title: 'Tổng số sản phẩm',
        icon: 'icon-tag',
        text: 'Tổng số sản phẩm',
        number: this.dashboard.totalProducts.toString(),
      },
      {
        background: 'bg-c-yellow',
        title: 'Doanh thu',
        icon: 'icon-repeat',
        text: 'Doanh thu',
        number: this.dashboard.totalRevenue.toString(),
      }
    ];
  };


  getDashboard(){
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.dashboardService.getDashboard().pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<Dashboard>>
      })
    ).subscribe({
      next: (response: Response<Dashboard>) => {
        this.dashboard = response.data as Dashboard
        this.cards[0].number = this.dashboard.totalOrders.toString();
        this.cards[1].number = this.dashboard.totalProducts.toString();
        const formattedPrice = this.dashboard.totalRevenue.toLocaleString('vi-VN');
        this.cards[2].number = formattedPrice.concat(' đ');
      }
    })
  }

  images = [
    {
      src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
      title: 'Old Scooter',
      size: 'PNG-100KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
      title: 'Wall Art',
      size: 'PNG-150KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
      title: 'Microphone',
      size: 'PNG-150KB'
    }
  ];
}
