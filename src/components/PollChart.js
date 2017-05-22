import {h, Component} from 'preact';
import Chart from 'chart.js';

export default class extends Component {
  state = {
    labels: [],
    votes: []
  }

  renderChart = () => {
    window.chart = this.chart = new Chart(this.chartCanvas, {
      type: 'pie',
      data: {
        labels: this.state.labels,
        datasets: [{
          data: this.state.votes,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)'
          ]
        }]
      }
    });
  }

  componentWillUnmount = () => {
    window.setTimeout(() => this.chart.destroy(), 250);
  }

  componentDidUpdate = () => {
    if (!looseCompare(this.chart.data.datasets[0].data, this.state.votes)) {
      this.chart.data.datasets[0].data = this.state.votes;
      this.chart.update();
    }
  }

  render = ({options}, {}) => {
    if (options) {
      const labels = Object.keys(options);
      const votes = labels.map(label => {
        return options[label];
      });

      this.setState({
        labels,
        votes
      });

      if (!this.chart) {
        this.renderChart();
      }
    }

    return (
      <canvas
        ref={canvas => this.chartCanvas = canvas}
        width="400"
        height="400"
        style={{
          maxWidth: 400,
          maxHeight: 400,
          margin: 'auto'
        }}
      />
    );
  }
}

function looseCompare(arr, arr2) {
  if (JSON.stringify(arr) === JSON.stringify(arr2)) {
    return true;
  }

  return false;
}
