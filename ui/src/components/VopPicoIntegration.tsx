import React from 'react';
import { IVopHost } from '../interfaces/IVopHost';
import VopFlowEditor, { logMessage } from './VopFlowEditor';
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
    loadVopFlow: async (vopFlowData: any) => {
      try {
        await bridge.invokeMethodAsync('LoadVopFlow', vopFlowData);
      } catch (error) {
        logMessage('Error loading VopFlow: ' + error, 'error');
      }
    },
    saveVopFlow: async () => {
      try {
        await bridge.invokeMethodAsync('SaveVopFlow');
      } catch (error) {
        logMessage('Error saving VopFlow: ' + error, 'error');
      }
    },
    executeVopFlow: async () => {
      try {
        await bridge.invokeMethodAsync('ExecuteVopFlow');
      } catch (error) {
        logMessage('Error executing VopFlow: ' + error, 'error');
      }
    },
    onNodeExecutionStart: async (nodeId: string) => {
      logMessage(`Node execution start: ${nodeId}`);
    },
    onNodeExecutionEnd: async (nodeId: string) => {
      logMessage(`Node execution end: ${nodeId}`);
    },
    onVopFlowExecutionError: async (error: any) => {
      logMessage(`VopFlow execution error: ${JSON.stringify(error)}`, 'error');
    },
    onRawMessageReceived: async (message: string) => {
      logMessage(`Raw msg received in JS: ${message}`);
    },
    getDeviceStatus: async () => {
      try {
        let s = await bridge.invokeMethodAsync('GetDeviceStatus');
        logMessage(`Device status: ${s}`);
      } catch (error) {
        logMessage('Error getting device status: ' + error, 'error');
        return null;
      }
    },
    JSeval: async () => {
      try {
        return await bridge.invokeMethodAsync('JSeval');
      } catch (error) {
        logMessage('Error in JSeval: ' + error, 'error');
        return null;
      }
    },
    JSinvoke: async () => {
      try {
        return await bridge.invokeMethodAsync('JSinvoke');
      } catch (error) {
        logMessage('Error in JSinvoke: ' + error, 'error');
        return null;
      }
    },
    JSraw: async () => {
      try {
        return await bridge.invokeMethodAsync('JSraw');
      } catch (error) {
        logMessage('Error in JSraw: ' + error, 'error');
        return null;
      }
    },
    CSraw: () => {
      try {
        window.HybridWebView.SendRawMessage('CSraw : JS send a raw message');
      } catch (error) {
        logMessage('Error in JSraw: ' + error, 'error');
      }
    },
  };

  return <VopFlowEditor vopHost={vopHost} />;
};

export default VopPicoIntegration;
