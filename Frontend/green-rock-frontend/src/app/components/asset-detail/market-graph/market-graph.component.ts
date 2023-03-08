import {AfterViewInit, Component, Input} from '@angular/core';
import {MarketService} from "../../../services/market-service/market.service";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-market-graph',
  templateUrl: './market-graph.component.html',
  styleUrls: ['./market-graph.component.css']
})
export class MarketGraphComponent implements AfterViewInit {
  @Input() assetTicker !: string;
  @Input() gameId !: string;
  @Input() showButtons : boolean = false;

  chart: Chart | undefined;

  viewingWindowInTicks: number = 128;
  numberOfEntries: number = 0;

  constructor(
    private marketService: MarketService
  ) {}

  ngAfterViewInit(): void {
    const red = '#ef4444';
    const green = '#22c55e';
    const chartName = "Asset value over time";

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: chartName,
            data: [],
            backgroundColor: function(context) {
              const index = context.dataIndex;
              const prev: number = (context.dataset.data[index-1] ?? 0) as number;
              const value: number = (context.dataset.data[index] ?? 0) as number;
              if (value < 0) return '#00000000' // Hide negative stock values because those are dummy values
              return (value - prev) > 0 ? green : red;
            },
            pointStyle: 'rect',
            segment: {
              borderColor: function(context) {
                const prev: number = context.p0.parsed.y;
                const value: number = context.p1.parsed.y;
                if (prev < 0) return '#00000000' // Hide negative stock values because those are dummy values
                return (value - prev) > 0 ? green : red;
              },
              borderWidth: 2,
              borderCapStyle: 'round'
            }
          },
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 3,
        scales: {
          x: {
            display: false // Hide X axis labels
          },
          y: {
            min: 0
          }
        },
        animation: false,
        elements: {
          point: {
            radius: 5,
            hoverRadius: 10
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF',
              font: {
                size: 16
              },
              boxWidth: 0,
              boxHeight: 0
            }
          }
        }
      },
    });

    this.marketService.getMarketObservable(this.assetTicker)?.subscribe({
      next: market => {
        this.numberOfEntries = market.length;
        if (this.chart){
          this.chart.data.labels = this.restrictPointsToWindow(market.map(val => val.tick))
          this.chart.data.datasets[0].data = this.restrictPointsToWindow(market.map(val => val.value))
          this.chart.update();
        }
      }
    })
  }

  private restrictPointsToWindow(array: number[]): number[] {
    const numberOfPointsToDisplay = 100;

    // If we want to show all history, simply select numberOfPointsToDisplay values equally distributed
    if (this.viewingWindowInTicks < 0){
      const delta = Math.floor( array.length / numberOfPointsToDisplay );
      const compressedArray: number[] = [];
      for (let i = 0; i < array.length; i += delta){
        compressedArray.push(array[i])
      }
      return compressedArray;
    }

    // TODO : remove dead code if the current method works
    // const compressedArray: number[] = [];
    // for (let i = 0; i < array.length; i += delta){
    //   compressedArray.push(array[i])
    // }

    // Delta is the space to have between each point in the viewingWindowInTicks to select numberOfPointsToDisplay points that are equally distributed
    const delta = Math.floor( this.viewingWindowInTicks / numberOfPointsToDisplay );

    /*
     * Sample numberOfPointsToDisplay points from the end of the array
     */
    let sampledPoints = [];
    for (let i = array.length - (array.length % delta) - 1; i >= 0 && sampledPoints.length < numberOfPointsToDisplay; i -= delta){
      sampledPoints.push(array[i]);
    }
    sampledPoints.reverse();

    // If we don't have enough points, fill with dummy values to attain numberOfPointsToDisplay points
    const fillArray : number[] = [];
    for (let i = 0; i < numberOfPointsToDisplay - sampledPoints.length; i++){
      fillArray.push(-100);
    }

    // Concatenate the two arrays
    return fillArray.concat(sampledPoints)//arrayToRestrict.slice(-numberOfPointsToDisplay);
  }

  setViewingWindow(length: number): void {
    this.viewingWindowInTicks = length;
    this.chart?.update();
  }
}
