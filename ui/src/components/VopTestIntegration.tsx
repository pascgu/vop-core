import React from 'react';
import DiagramEditor from './DiagramEditor';

const VopTestIntegration: React.FC = () => {
  // Create a dummy vopHost for the DiagramEditor component
  const dummyVopHost = {
    sendCodeToDevice: async (code: string) => {
      console.log('Dummy sendCodeToDevice:', code);
    },
    receiveDataFromDevice: async (data: any) => {
      console.log('Dummy receiveDataFromDevice:', data);
    },
    loadWorkflow: async (workflowData: any) => {
      console.log('Dummy loadWorkflow:', workflowData);
    },
    saveWorkflow: async () => {
      console.log('Dummy saveWorkflow');
    },
    executeWorkflow: async () => {
      console.log('Dummy executeWorkflow');
    },
    onNodeExecutionStart: async (nodeId: string) => {
      console.log('Dummy onNodeExecutionStart:', nodeId);
    },
    onNodeExecutionEnd: async (nodeId: string) => {
      console.log('Dummy onNodeExecutionEnd:', nodeId);
    },
    onWorkflowExecutionError: async (error: any) => {
      console.log('Dummy onWorkflowExecutionError:', error);
    },
    onRawMessageReceived: async (message: string) => {
      console.log('Dummy onRawMessageReceived:', message);
    },
    getDeviceStatus: async () => {
      console.log('Dummy getDeviceStatus');
      return 'Dummy device status';
    },
  };

  return <DiagramEditor vopHost={dummyVopHost} />;
};

export default VopTestIntegration;
