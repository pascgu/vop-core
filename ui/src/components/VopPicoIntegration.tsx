import React from 'react';
import { IVopHost } from '../interfaces/IVopHost';
import DiagramEditor, { logMessage } from './DiagramEditor';
import JsCsBridge from '../utils/JsCsBridge';

const VopPicoIntegration: React.FC = () => {
  const bridge = JsCsBridge.getInstance();

  const vopHost: IVopHost = {
    sendCodeToDevice: async (code: string) => {
      try {
        await bridge.invokeMethodAsync('SendCodeToDevice', code);
      } catch (error) {
        logMessage('Error sending code to device: ' + error, 'error');
      }
    },
    receiveDataFromDevice: async (data: any) => {
      logMessage(`Data received from device: ${JSON.stringify(data)}`);
    },
    loadWorkflow: async (workflowData: any) => {
      try {
        await bridge.invokeMethodAsync('LoadWorkflow', workflowData);
      } catch (error) {
        logMessage('Error loading workflow: ' + error, 'error');
      }
    },
    saveWorkflow: async () => {
      try {
        await bridge.invokeMethodAsync('SaveWorkflow');
      } catch (error) {
        logMessage('Error saving workflow: ' + error, 'error');
      }
    },
    executeWorkflow: async () => {
      try {
        await bridge.invokeMethodAsync('ExecuteWorkflow');
      } catch (error) {
        logMessage('Error executing workflow: ' + error, 'error');
      }
    },
    onNodeExecutionStart: async (nodeId: string) => {
      logMessage(`Node execution start: ${nodeId}`);
    },
    onNodeExecutionEnd: async (nodeId: string) => {
      logMessage(`Node execution end: ${nodeId}`);
    },
    onWorkflowExecutionError: async (error: any) => {
      logMessage(`Workflow execution error: ${JSON.stringify(error)}`, 'error');
    },
    onRawMessageReceived: async (message: string) => {
      logMessage(`Raw msg received: ${message}`);
    },
    getDeviceStatus: async () => {
      try {
        return await bridge.invokeMethodAsync('GetDeviceStatus');
      } catch (error) {
        logMessage('Error getting device status: ' + error, 'error');
        return null;
      }
    },
    checkCS2JS: async () => {
      try {
        return await bridge.invokeMethodAsync('checkCS2JS');
      } catch (error) {
        logMessage('Error in checkCS2JS: ' + error, 'error');
        return null;
      }
    },
  };

  return <DiagramEditor vopHost={vopHost} />;
};

export default VopPicoIntegration;
