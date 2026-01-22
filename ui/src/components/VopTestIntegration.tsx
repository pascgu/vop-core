import React from 'react';
import { IVopHost, LogMessageType } from '../interfaces/IVopHost';
import { VopFlow } from '../interfaces/VopFlowTypes';
import VopFlowEditor from './VopFlowEditor';

const VopTestIntegration: React.FC = () => {
  // Create a dummy vopHost for the DiagramEditor component
  const dummyVopHost:IVopHost = {
    sendCodeToDevice: async (code: string) => {
      console.log('Dummy sendCodeToDevice:', code);
    },
    receiveDataFromDevice: async (data: string, type: LogMessageType) => {
      console.log('Dummy receiveDataFromDevice:', data);
    },
    onLoadingVopFlow: async (vopFlowJson: string) => {
      console.log('Dummy onLoadingVopFlow:', vopFlowJson);
      const vop_flow:VopFlow = { version: '1.0', name: 'test', nodes: [], edges: []};
      return Promise.resolve(vop_flow);
    },
    onSavingVopFlow: async (vopFlow: VopFlow) => {
      console.log('Dummy onSavingVopFlow');
      return Promise.resolve('');
    },
    executeVopFlow: async () => {
      console.log('Dummy executeVopFlow');
    },
    onNodeExecutionStart: async (nodeId: string) => {
      console.log('Dummy onNodeExecutionStart:', nodeId);
    },
    onNodeExecutionEnd: async (nodeId: string) => {
      console.log('Dummy onNodeExecutionEnd:', nodeId);
    },
    onVopFlowExecutionError: async (error: any) => {
      console.log('Dummy onVopFlowExecutionError:', error);
    },
    onRawMessageReceived: async (message: string) => {
      console.log('Dummy onRawMessageReceived:', message);
    },
    getDeviceStatus: async () => {
      console.log('Dummy getDeviceStatus');
      return 'Dummy device status';
    },
    JSeval: async () => {
      console.log('Dummy JSeval');
    },
    JSinvoke: async () => {
      console.log('Dummy JSinvoke');
    },
    JSraw: async () => {
      console.log('Dummy JSraw');
    },
    CSraw: async () => {
      console.log('Dummy CSraw');
    },
    listSerialPorts: async () => {
      console.log('Dummy listSerialPorts');
      return Promise.resolve([]);
    },
    selectSerialPort: async (portName: string) => {
      console.log('Dummy selectSerialPort:', portName);
      return Promise.resolve(portName);
    },
  };

  return <VopFlowEditor vopHost={dummyVopHost} />;
};

export default VopTestIntegration;
