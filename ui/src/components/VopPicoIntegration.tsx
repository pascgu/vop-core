import React from 'react';
import { IVopHost, LogMessageType } from '../interfaces/IVopHost';
import { VopFlow } from '../interfaces/VopFlowTypes';
import VopFlowEditor, { logMessage } from './VopFlowEditor';
import JsCsBridge from '../utils/JsCsBridge';

const VopPicoIntegration: React.FC = () => {
  const bridge = JsCsBridge.getInstance();

  const vopHost: IVopHost = {
    sendCodeToDevice: async (code: string) => {
      try {
        await bridge.invokeMethodAsync('SendCodeToDeviceAsync', code);
      } catch (error) {
        await logMessage('Error sending code to device: ' + JSON.stringify(error), 'error');
      }
    },
    receiveDataFromDevice: async (data: string, type?: LogMessageType) => {
      try {
        console.log(`Received data from device (type: ${type}): ${data}`);
        await logMessage(data, type);
      } catch (error) {
        await logMessage('Error receiving data from device: ' + JSON.stringify(error), 'error');
      }
    },
    onLoadingVopFlow: async (vopFlowJson: string) => {
      const response = await bridge.invokeMethodAsync('OnLoadingVopFlowAsync', vopFlowJson);
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
      return await bridge.invokeMethodAsync('OnSavingVopFlowAsync', vopFlowJson);
    },
    executeVopFlow: async () => {
      try {
        await bridge.invokeMethodAsync('ExecuteVopFlowAsync');
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
        let s = await bridge.invokeMethodAsync('GetDeviceStatusAsync');
        await logMessage(`Device status: ${JSON.stringify(s)}`);
      } catch (error) {
        await logMessage('Error getting device status: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSeval: async () => {
      try {
        return await bridge.invokeMethodAsync('JSevalAsync');
      } catch (error) {
        await logMessage('Error in JSeval: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSinvoke: async () => {
      try {
        return await bridge.invokeMethodAsync('JSinvokeAsync');
      } catch (error) {
        await logMessage('Error in JSinvoke: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    JSraw: async () => {
      try {
        return await bridge.invokeMethodAsync('JSrawAsync');
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
        return await bridge.invokeMethodAsync('ListSerialPortsAsync');
      } catch (error) {
        await logMessage('Error listing serial ports: ' + JSON.stringify(error), 'error');
        return [];
      }
    },
    selectSerialPort: async (portName: string) => {
      try {
        const selectedPort = await bridge.invokeMethodAsync('SelectSerialPortAsync', portName);
        const port = selectedPort.split(' (')[0];
        return port;
      } catch (error) {
        await logMessage('Error selecting serial port: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
    quitApplication: async () => {
      try {
        return await bridge.invokeMethodAsync('QuitApplicationAsync');
      } catch (error) {
        await logMessage('Error quitting application: ' + JSON.stringify(error), 'error');
        return null;
      }
    },
  };

  return <VopFlowEditor vopHost={vopHost} />;
};

export default VopPicoIntegration;
