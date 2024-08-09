import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Chart, { ChartData, ChartType } from 'chart.js/auto';
import { ThemeService } from '../../services/theme/theme.service';
import { KeyChartColor, KeyChartData } from '../../types/chart.type';

@Component({
  selector: 'key-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {
  public chart!: Chart;
  public chartId!: string;

  private chartData: ChartData = {
    labels: ["ردیف", "ردیف", 'ردیف', 'ردیف', 'ردیف'],
    datasets: []
  };

  @Input("type")
  public chartType: ChartType = 'line';


  @Input("labels")
  public set chartLabels(value: string[] | 'months' | 'weekdays') {
    if (value === 'months') {
      this.chartData.labels = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    }
    else if (value === 'weekdays') {
      this.chartData.labels = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    }
    else {
      this.chartData.labels = value;
    }
  };

  @Input("dataSets")
  public set dataSets(inputDataSets: KeyChartData[]) {
    const chartColors: KeyChartColor[] = [
      {
        borderColor: this.themeService.variable("--chart-border-color-1"),
        backgroundColor: this.themeService.variable("--chart-background-color-1")
      },
      {
        borderColor: this.themeService.variable("--chart-border-color-2"),
        backgroundColor: this.themeService.variable("--chart-background-color-2")
      },
      {
        borderColor: this.themeService.variable("--chart-border-color-3"),
        backgroundColor: this.themeService.variable("--chart-background-color-3")
      },
      {
        borderColor: this.themeService.variable("--chart-border-color-4"),
        backgroundColor: this.themeService.variable("--chart-background-color-4")
      },
    ]

    for (let i = 0; i < inputDataSets.length; i++) {
      const dataSet = inputDataSets[i];

      this.chartData.datasets.push({
        fill: false,
        borderColor: chartColors[i % chartColors.length].borderColor,
        backgroundColor: chartColors[i % chartColors.length].backgroundColor,
        ...dataSet
      });
    }
  };

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    Chart.defaults.font.family = "Vazirmatn";
    Chart.defaults.borderColor = this.themeService.variable("--border-color-medium");
    Chart.defaults.color = this.themeService.variable("--text-secondary-color");

    this.chartId = crypto.randomUUID();
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(
      this.chartId,
      {
        type: this.chartType,
        data: this.chartData,
        options: {
          layout: {
            padding: 20
          }
        }
      }
    );
  }
}
