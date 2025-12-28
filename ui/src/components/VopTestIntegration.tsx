import React from 'react';
import VopFlowEditor from './VopFlowEditor';

const VopTestIntegration: React.FC = () => {
  // Create a dummy vopHost for the DiagramEditor component
  const dummyVopHost = {
    sendCodeToDevice: async (code: string) => {
      console.log('Dummy sendCodeToDevice:', code);
    },
    receiveDataFromDevice: async (data: any) => {
      console.log('Dummy receiveDataFromDevice:', data);
    },
    loadVopFlow: async (workflowData: any) => {
      console.log('Dummy loadVopFlow:', workflowData);
    },
    saveVopFlow: async () => {
      console.log('Dummy saveVopFlow');
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
  };

  return <VopFlowEditor vopHost={dummyVopHost} />;
};

export default VopTestIntegration;
