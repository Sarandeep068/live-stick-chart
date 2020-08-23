import React, { Component} from 'react';
import io from 'socket.io-client';

import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class LiveScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPoints: []
        }
        this.clientSocket = null;
    }
    componentDidMount() {
        if(window.navigator.onLine) {
            this.clientSocket = io.connect(`http://kaboom.rksv.net/watch`, {
                transports: ['websocket', 'polling'],
                forceNew: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity
            });
            this.clientSocket.on('connect', () => {
                this.clientSocket.on('data', (data, ack) => {
                    this.setState(prevState => {
                        const splitString = data.split(",");
                        const dataPoints = [...prevState.dataPoints];
                        dataPoints.push({
                            x: new Date(parseInt(splitString[0], 10)).getTime(),
                            y: [
                                parseFloat(splitString[1]),
                                parseFloat(splitString[2]),
                                parseFloat(splitString[3]), 
                                parseFloat(splitString[4]),
                            ]
                        })
                        return { dataPoints };
                    })
                    ack(1);
                });
            });
            this.clientSocket.on('disconnect', function () {
                console.log('disconnected from server');
            });
            this.clientSocket.on('error', (err) => {
                console.log(err);
            });
            this.clientSocket.emit('sub', {
                state: true
            });
        }  else {
            const dataPoints = JSON.parse(localStorage.getItem("liveScreen"));
            this.setState({ dataPoints })
        }

        window.onbeforeunload = () => {
            this.setLocalstorageData();
        }
    }

    componentWillUnmount () {
        if(window.navigator.onLine) {
            this.clientSocket.emit('unsub', {
                state: false
            });
        }
        this.setLocalstorageData();
    }

    setLocalstorageData = () => {
        window.localStorage.setItem("liveScreen", JSON.stringify(this.state.dataPoints));
    }

    render() {
        const options = {
			exportEnabled: true,
			title: {
				text: `Stock Price - ${new Date().toDateString()}`
			},
			axisX: {
			    intervalType : "time"
			},
			axisY: {
				title: "Price",
				prefix: "₹"
            },
            zoomEnabled: true,
			data: [{
				type: "candlestick",
				showInLegend: true,
				yValueFormatString: "₹0.00",
				xValueType: "dateTime",
				dataPoints: this.state.dataPoints
			}]
		}
       return (
          <div className="live-screen-container">
            <CanvasJSChart options = {options} />
          </div>
        );
      }
}