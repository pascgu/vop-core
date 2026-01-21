import React from 'react';
import { IVopHost } from '../interfaces/IVopHost';
import { VopFlow } from '../interfaces/VopFlowTypes';
import VopFlowEditor, { logMessage } from './VopFlowEditor';
import JsCsBridge from '../utils/JsCsBridge';

const VopPicoIntegration: React.FC = () => {
  const bridge = JsCsBridge.getInstance();

  const vopHost: IVopHost = {
    sendCodeToDevice: async (code: string) => {
      try {
        await bridge.invokeMethodAsync('SendCodeToDevice', code);
      } catch (error) {
        await logMessage('Error sending code to device: ' + JSON.stringify(error), 'error');
      }
    },
    receiveDataFromDevice: async (data: any) => {
      await logMessage(`Data received from device: ${JSON.stringify(data)}`);
    },
    onLoadingVopFlow: async (vopFlowJson: string) => {
      const response = await bridge.invokeMethodAsync('OnLoadingVopFlow', vopFlowJson);
      if (typeof response === 'string') {
        if (response.startsWith('{')) {
          return JSON.parse(response) as VopFlow;
        } else {
          throw new Error(`Error loading VopFlow: ${response}`);
        }
      } else {
        throw new Error(`Error loading VopFlow: Invalid response format: ${response}`);
      }
    },
    onSavingVopFlow: async (vopFlow: VopFlow) => {
      const vopFlowJson = JSON.stringify(vopFlow);
      return await bridge.invokeMethodAsync('OnSavingVopFlow', vopFlowJson);
    },
    executeVopFlow: async () => {
      try {
        await bridge.invokeMethodAsync('ExecuteVopFlow');
      } catch (error) {
        await logMessage('Error executing VopFlow: ' + JSON.stringify(error), 'error');
      }
    },
    onNodeExecutionStart: async (nodeId: string) => {
      await logMessage(`Node execution start: ${JSON.stringify(nodeId)}`);
    },
    onNodeExecutionEnd: async (nodeId: string) => {
      await logMessage(`Node execution end: ${JSON.stringify(nodeId)}`);
    },
    onVopFlowExecutionError: async (error: any) => {
      await logMessage(`VopFlow execution error: ${JSON.stringify(error)}`, 'error');
    },
    onRawMessageReceived: async (message: string) => {
      await logMessage(`Raw msg received in JS: ${JSON.stringify(message)}`);
    },
    getDeviceStatus: async () => {
      try {
        let s = await bridge.invokeMethodAsync('GetDeviceStatus');
        await logMessage(`Device status: ${JSON.stringify(s)}`);
      } catch (error) {
        await logMessage('Error getting device status: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSeval: async () => {
      try {
        return await bridge.invokeMethodAsync('JSeval');
      } catch (error) {
        await logMessage('Error in JSeval: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSinvoke: async () => {
      try {
        return await bridge.invokeMethodAsync('JSinvoke');
      } catch (error) {
        await logMessage('Error in JSinvoke: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSraw: async () => {
      try {
        return await bridge.invokeMethodAsync('JSraw');
      } catch (error) {
        await logMessage('Error in JSraw: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    CSraw: async () => {
      try {
        window.HybridWebView.SendRawMessage('CSraw : JS send a raw message');
      } catch (error) {
        await logMessage('Error in JSraw: ' + JSON.stringify(error), 'error');
      }
    },
    listSerialPorts: async () => {
      try {
        return await bridge.invokeMethodAsync('ListSerialPorts');
      } catch (error) {
        await logMessage('Error listing serial ports: ' + JSON.stringify(error), 'error');
        return [];
      }
    },
    selectSerialPort: async (portName: string) => {
      try {
        const selectedPort = await bridge.invokeMethodAsync('SelectSerialPort', portName);
        const port = selectedPort.split(' (')[0];
        await logMessage('Serial port: ' + JSON.stringify(port));
        return port;
      } catch (error) {
        await logMessage('Error selecting serial port: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
  };

  return <VopFlowEditor vopHost={vopHost} />;
};

export default VopPicoIntegration;
