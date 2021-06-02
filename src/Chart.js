/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import './App.css';
import { realTimeLineChart } from './lineChart';
import FilterPanel from './FilterPanel';
import _ from 'lodash';
// import { w3cwebsocket as WebSocket } from "websocket";
import { 
  STATS,
  FILTERS,
  LINE_DATA_LENGTH,
  DURATION,
  INITIAL_VALUES,
  OPTIONS,
} from './constants';

const URL = 'ws://localhost:8080';

// styled components

export const Panel = styled.div`
  margin: auto; 
  margin-top: 10px;
  border: 1px solid black;
  width: 1160px;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 10px;
`;

const Canvas = styled.div`
   margin: auto; 
   width: 1200px;
   height: 400px;
`;

const Title = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
 
const ChartComponent = () => { 
  const dataQueue = useRef();
  const lineData = useRef();
  const [selection, setSelection] = useState(INITIAL_VALUES);
  const interval= useRef(null);
  const connected = useRef(false);
  const chartRef = useRef(null) 
  const chart = useRef(null);
  const webSocket = useRef(null);
  const drawChart = useCallback(realTimeLineChart(d3.select(chartRef.current)), [chartRef.current]);
  
  const updateChart = () => {
    if (connected.current) {

      chart.current = d3.select(chartRef.current);   
      const formattedData = formatData(lineData.current, STATS);
      console.log('renders formatted', formattedData)
      chart.current.datum(formattedData).call(drawChart); 
    }
  };

  const handleChange = (event) => { 
    const { value, name } = event.target;
    if (name === FILTERS.district.name) {
      setSelection({ district: value, facility: 'all', wards: 'all' });
    }   
    if (name === FILTERS.facility.name) {
      setSelection({...selection, facility: value, wards: 'all' });
    } 
    if (name === FILTERS.wards.name) {
      setSelection({ ...selection,  wards: value });
    }
    if (webSocket.current) {
      webSocket.current.send(JSON.stringify({ type: 'change', payload: { filter: name, value: value } })); 
    }
  }

  useEffect(() => {
    if (!webSocket.current) {
      webSocket.current = new WebSocket(URL);
    }

    webSocket.current.onopen = () => {
      webSocket.current.send(JSON.stringify({type: 'open', payload: {filter: 'district', value: 'district1' } })); 
      connected.current = true;
    }

    webSocket.current.onmessage = (evt) => {
      let formattedData;  
      const data = JSON.parse(evt.data);
      switch(data.type) {
        case 'seed': 
          lineData.current = data.payload;
          clearInterval(interval.current);
          chart.current = d3.select(chartRef.current);
          formattedData = formatData(lineData.current, STATS);
          chart.current.datum(formattedData).call(drawChart);   
          interval.current = setInterval(updateChart, DURATION); 
          break;
        case 'update':   
          chart.current = d3.select(chartRef.current);    
          const newLineData = [...lineData.current, data.payload];    
          if (newLineData.length > LINE_DATA_LENGTH) {
            newLineData.shift();  
          } 
          console.log('renders line data', newLineData)
          lineData.current = newLineData;     
        break;
      default:
        console.log('ws message unhandled', evt);
      }   
    } 

    webSocket.current.onerror = (evt) => {
      console.log('websockets error', evt.message);  
      connected.current = false;
      webSocket.current.close();
      if (evt.code !== 1000) {
        webSocket.current = new WebSocket(URL);
        console.log('trying to reconnect to websocket'); 
      }
    }

    webSocket.current.onclose = (evt) => {
      connected.current = false;
      console.log('websocket has closed', evt.message); 
      if (evt.code !== 1000) {
        webSocket.current = new WebSocket(URL);
        console.log('trying to reconnect to websocket'); 
      }
    };
  },[]);

  const resize = () => {
    if (chart.current) {
      if (chart.current.empty()) {
          return;
      }
      drawChart.width(chart.current.style('width').replace(/(px)/g, ''));
    }
  };

  d3.select(window).on('resize', resize);

  return (
    <div className='canvas'>
      <Title className='App-header'>
        <h2> Real-time Patient Admission Waiting Times </h2>
      </Title>
      <Canvas id="chart" ref={chartRef} ></Canvas>
      <FilterPanel selection={selection} handleChange={handleChange} options={OPTIONS} initialValues={INITIAL_VALUES} />
    </div>
  );
};

export default ChartComponent;

// utility functions

// convert array of objects each of which contains a single value for each of a set 
// of variables into an array of objects each containing a set of values for one of those variables
export const formatData = (data, stats) => {
  return stats.map((c) => { 
    return {
      label: c,
      values: data.map(function(d) {
        return { label: c, time: new Date(d.time), value: d[c] };
      })
    };
  });
};
