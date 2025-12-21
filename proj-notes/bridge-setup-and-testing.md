# Bridge Setup and Testing Guide

## 1. Set Up the HybridWebView in vop-pico

1. **Add the HybridWebView.js Script**:
   - Ensure the `hybridwebview.js` script is included in the `index.html` file of the vop-pico project.
   - This script is essential for enabling communication between the web content and the native code.

2. **Initialize HybridWebView**:
   - In the `index.html` file, add the following script to initialize the HybridWebView:
     ```html
     <script src="HybridWebView.js"></script>
     ```

3. **Update JsCsBridge.ts**:
   - Ensure the `JsCsBridge.ts` file is updated to use the HybridWebView functionality.
   - The `isBridgeAvailable` method should check for `window.HybridWebView`.
   - The `invokeMethodAsync` method should use `window.HybridWebView.InvokeDotNet`.

## 2. Set Up the C# Side in vop-pico

1. **Update PicoPage.xaml.cs**:
   - Ensure that the `PicoPage.xaml.cs` file is set up to handle the JavaScript calls.
   - Example:
     ```csharp
     public partial class PicoPage : ContentPage
     {
         public PicoPage()
         {
             InitializeComponent();
             hybridWebView.SetInvokeJavaScriptTarget(this);
         }

         private async void hybridWebView_RawMessageReceived(object sender, HybridWebViewRawMessageReceivedEventArgs e)
         {
             // TODO
         }

         public void SendCodeToDevice(string code)
         {
             // Handle the code sent from JavaScript
             Console.WriteLine($"Received code: {code}");
         }

         public string GetDeviceStatus()
         {
             // Return the device status
             return "Device is ready";
         }
     }
     ```

2. **Ensure the HybridWebView is Initialized**:
   - Ensure that the HybridWebView is initialized in the `index.html` file.
   - Example:
     ```html
     <script src="HybridWebView.js"></script>
     ```

## 3. Test the Bridge

1. **Add Testing Buttons in JavaScript**:
   - Ensure that the `DiagramEditor.tsx` file has buttons to test the bridge.
   - Example:
     ```typescript
     import React from 'react';
     import JsCsBridge from '../utils/JsCsBridge';

     const DiagramEditor: React.FC = () => {
       const bridge = JsCsBridge.getInstance();

       const testSendCode = async () => {
         try {
           await bridge.invokeMethodAsync('VopPico.App', 'SendCodeToDevice', 'console.log("Hello, world!");');
           console.log('Code sent to device successfully.');
         } catch (error) {
           console.error('Error sending code to device:', error);
         }
       };

       const testGetDeviceStatus = async () => {
         try {
           const status = await bridge.invokeMethodAsync('VopPico.App', 'GetDeviceStatus');
           console.log('Device status:', status);
         } catch (error) {
           console.error('Error getting device status:', error);
         }
       };

       return (
         <div>
           <h2>Diagram Editor</h2>
           <button onClick={testSendCode}>Test Send Code</button>
           <button onClick={testGetDeviceStatus}>Test Get Device Status</button>
         </div>
       );
     };

     export default DiagramEditor;
     ```

2. **Run the Application**:
   - Use the command `npm start` to run the application.
   - This will start the development server and open the application in your default browser.

3. **Test the Bridge**:
   - Click the "Test Send Code" button to send code to the device.
   - Click the "Test Get Device Status" button to get the device status.
   - Check the console logs to verify that the bridge methods are being invoked correctly.

## 4. Set Up and Use VopPicoIntegration

### Frontend Setup

1. **Ensure HybridWebView.js is Included**:
   - Ensure the `hybridwebview.js` script is included in the `index.html` file of the vop-pico project.
   - This script is essential for enabling communication between the web content and the native code.

2. **Initialize HybridWebView**:
   - In the `index.html` file, add the following script to initialize the HybridWebView:
     ```html
     <script src="HybridWebView.js"></script>
     ```

3. **Update JsCsBridge.ts**:
   - Ensure the `JsCsBridge.ts` file is updated to use the HybridWebView functionality.
   - The `isBridgeAvailable` method should check for `window.HybridWebView`.
   - The `invokeMethodAsync` method should use `window.HybridWebView.InvokeDotNet`.

4. **Update VopPicoIntegration.tsx**:
   - Ensure the `VopPicoIntegration.tsx` file is set up to use the bridge for real method calls.
   - Example:
     ```typescript
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
     ```

### Backend Setup

1. **Update PicoPage.xaml.cs**:
   - Ensure that the `PicoPage.xaml.cs` file is set up to handle the JavaScript calls.
   - Example:
     ```csharp
     public partial class PicoPage : ContentPage
     {
         public PicoPage()
         {
             InitializeComponent();
             hybridWebView.SetInvokeJavaScriptTarget(this);
         }

         private async void hybridWebView_RawMessageReceived(object sender, HybridWebViewRawMessageReceivedEventArgs e)
         {
             // TODO
         }

         public void SendCodeToDevice(string code)
         {
             // Handle the code sent from JavaScript
             Console.WriteLine($"Received code: {code}");
         }

         public string GetDeviceStatus()
         {
             // Return the device status
             return "Device is ready";
         }
     }
     ```

2. **Ensure the HybridWebView is Initialized**:
   - Ensure that the HybridWebView is initialized in the `index.html` file.
   - Example:
     ```html
     <script src="HybridWebView.js"></script>
