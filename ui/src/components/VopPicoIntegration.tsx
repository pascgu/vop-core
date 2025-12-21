import React, { useEffect } from 'react';
import { IVopHost } from '../interfaces/IVopHost';
import DiagramEditor from './DiagramEditor';
import JsCsBridge from '../utils/JsCsBridge';
import BridgeConfig from '../utils/BridgeConfig';

const VopPicoIntegration: React.FC = () => {
  useEffect(() => {
    const bridge = JsCsBridge.getInstance();
    const config = BridgeConfig.getInstance();

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

    const vopHost: IVopHost = {
      sendCodeToDevice: async (code: string) => {
        try {
          const assemblyName = config.getAssemblyName('SendCodeToDevice');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'SendCodeToDevice', code);
          } else {
            console.error('Assembly name not found for SendCodeToDevice');
          }
        } catch (error) {
          console.error('Error sending code to device:', error);
        }
      },
      receiveDataFromDevice: async (data: any) => {
        try {
          const assemblyName = config.getAssemblyName('ReceiveDataFromDevice');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'ReceiveDataFromDevice', data);
          } else {
            console.error('Assembly name not found for ReceiveDataFromDevice');
          }
        } catch (error) {
          console.error('Error receiving data from device:', error);
        }
      },
      loadWorkflow: async (workflowData: any) => {
        try {
          const assemblyName = config.getAssemblyName('LoadWorkflow');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'LoadWorkflow', workflowData);
          } else {
            console.error('Assembly name not found for LoadWorkflow');
          }
        } catch (error) {
          console.error('Error loading workflow:', error);
        }
      },
      saveWorkflow: async () => {
        try {
          const assemblyName = config.getAssemblyName('SaveWorkflow');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'SaveWorkflow');
          } else {
            console.error('Assembly name not found for SaveWorkflow');
          }
        } catch (error) {
          console.error('Error saving workflow:', error);
        }
      },
      executeWorkflow: async () => {
        try {
          const assemblyName = config.getAssemblyName('ExecuteWorkflow');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'ExecuteWorkflow');
          } else {
            console.error('Assembly name not found for ExecuteWorkflow');
          }
        } catch (error) {
          console.error('Error executing workflow:', error);
        }
      },
      onNodeExecutionStart: async (nodeId: string) => {
        try {
          const assemblyName = config.getAssemblyName('OnNodeExecutionStart');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'OnNodeExecutionStart', nodeId);
          } else {
            console.error('Assembly name not found for OnNodeExecutionStart');
          }
        } catch (error) {
          console.error('Error handling node execution start:', error);
        }
      },
      onNodeExecutionEnd: async (nodeId: string) => {
        try {
          const assemblyName = config.getAssemblyName('OnNodeExecutionEnd');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'OnNodeExecutionEnd', nodeId);
          } else {
            console.error('Assembly name not found for OnNodeExecutionEnd');
          }
        } catch (error) {
          console.error('Error handling node execution end:', error);
        }
      },
      onWorkflowExecutionError: async (error: any) => {
        try {
          const assemblyName = config.getAssemblyName('OnWorkflowExecutionError');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'OnWorkflowExecutionError', error);
          } else {
            console.error('Assembly name not found for OnWorkflowExecutionError');
          }
        } catch (error) {
          console.error('Error handling workflow execution error:', error);
        }
      },
      onRawMessageReceived: async (message: string) => {
        try {
          const assemblyName = config.getAssemblyName('OnRawMessageReceived');
          if (assemblyName) {
            await bridge.invokeMethodAsync(assemblyName, 'OnRawMessageReceived', message);
          } else {
            console.error('Assembly name not found for OnRawMessageReceived');
          }
        } catch (error) {
          console.error('Error sending raw message:', error);
        }
      },
      getDeviceStatus: async () => {
        try {
          const assemblyName = config.getAssemblyName('GetDeviceStatus');
          if (assemblyName) {
            return await bridge.invokeMethodAsync(assemblyName, 'GetDeviceStatus');
          } else {
            console.error('Assembly name not found for GetDeviceStatus');
            return null;
          }
        } catch (error) {
          console.error('Error getting device status:', error);
          return null;
        }
      },
    };

    // Simulate sending code to the device
    vopHost.sendCodeToDevice('console.log("Hello, world!");');

    // Simulate receiving data from the device
    vopHost.receiveDataFromDevice({ message: 'Device is ready' });
  }, []);

  return <DiagramEditor />;
};

export default VopPicoIntegration;
