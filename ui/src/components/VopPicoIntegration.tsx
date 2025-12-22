import React, { useEffect } from 'react';
import { IVopHost } from '../interfaces/IVopHost';
import DiagramEditor, { logMessage } from './DiagramEditor';
import JsCsBridge from '../utils/JsCsBridge';
import BridgeConfig from '../utils/BridgeConfig';

const VopPicoIntegration: React.FC = () => {
  const bridge = JsCsBridge.getInstance();
  const config = BridgeConfig.getInstance();

  const vopHost: IVopHost = {
    sendCodeToDevice: async (code: string) => {
      try {
        const assemblyName = config.getAssemblyName('SendCodeToDevice');
        if (assemblyName) {
          await bridge.invokeMethodAsync(assemblyName, 'SendCodeToDevice', code);
        } else {
          logMessage('Assembly name not found for SendCodeToDevice', 'error');
        }
      } catch (error) {
        logMessage('Error sending code to device: ' + error, 'error');
      }
    },
    receiveDataFromDevice: async (data: any) => {
      logMessage(`Data received from device: ${JSON.stringify(data)}`);
    },
    loadWorkflow: async (workflowData: any) => {
      try {
        const assemblyName = config.getAssemblyName('LoadWorkflow');
        if (assemblyName) {
          await bridge.invokeMethodAsync(assemblyName, 'LoadWorkflow', workflowData);
        } else {
          logMessage('Assembly name not found for LoadWorkflow', 'error');
        }
      } catch (error) {
        logMessage('Error loading workflow: ' + error, 'error');
      }
    },
    saveWorkflow: async () => {
      try {
        const assemblyName = config.getAssemblyName('SaveWorkflow');
        if (assemblyName) {
          await bridge.invokeMethodAsync(assemblyName, 'SaveWorkflow');
        } else {
          logMessage('Assembly name not found for SaveWorkflow', 'error');
        }
      } catch (error) {
        logMessage('Error saving workflow: ' + error, 'error');
      }
    },
    executeWorkflow: async () => {
      try {
        const assemblyName = config.getAssemblyName('ExecuteWorkflow');
        if (assemblyName) {
          await bridge.invokeMethodAsync(assemblyName, 'ExecuteWorkflow');
        } else {
          logMessage('Assembly name not found for ExecuteWorkflow', 'error');
        }
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
      logMessage(`Raw message received: ${message}`);
    },
    getDeviceStatus: async () => {
      try {
        const assemblyName = config.getAssemblyName('GetDeviceStatus');
        if (assemblyName) {
          return await bridge.invokeMethodAsync(assemblyName, 'GetDeviceStatus');
        } else {
          logMessage('Assembly name not found for GetDeviceStatus', 'error');
          return null;
        }
      } catch (error) {
        logMessage('Error getting device status: ' + error, 'error');
        return null;
      }
    },
  };

  useEffect(() => {
    // Register methods with the configuration
    config.registerMethod('SendCodeToDevice', 'VopPico.App');
    config.registerMethod('ReceiveDataFromDevice', 'VopPico.App');
    config.registerMethod('LoadWorkflow', 'VopPico.App');
    config.registerMethod('SaveWorkflow', 'VopPico.App');
    config.registerMethod('ExecuteWorkflow', 'VopPico.App');
    config.registerMethod('OnNodeExecutionStart', 'VopPico.App');
    config.registerMethod('OnNodeExecutionEnd', 'VopPico.App');
    config.registerMethod('OnWorkflowExecutionError', 'VopPico.App');
    config.registerMethod('OnRawMessageReceived', 'VopPico.App');
    config.registerMethod('GetDeviceStatus', 'VopPico.App');
  }, []);

  return <DiagramEditor vopHost={vopHost} />;
};

export default VopPicoIntegration;
