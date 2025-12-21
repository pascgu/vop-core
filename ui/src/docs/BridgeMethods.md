# Bridge Methods Documentation

## Overview
This document outlines the bridge methods available for communication between JavaScript and C#. The bridge is implemented using the `JsCsBridge` utility class and the `BridgeConfig` configuration system.

## Available Methods

### sendCodeToDevice
**Description:** Sends code to the device.
**Parameters:**
- `code` (string): The code to be sent to the device.
**Returns:** `Promise<void>`

### receiveDataFromDevice
**Description:** Receives data from the device.
**Parameters:**
- `data` (any): The data received from the device.
**Returns:** `Promise<void>`

### loadWorkflow
**Description:** Loads a workflow from data.
**Parameters:**
- `workflowData` (any): The workflow data to load.
**Returns:** `Promise<void>`

### saveWorkflow
**Description:** Saves the current workflow.
**Returns:** `Promise<void>`

### executeWorkflow
**Description:** Executes the current workflow.
**Returns:** `Promise<void>`

### onNodeExecutionStart
**Description:** Handles node execution start event.
**Parameters:**
- `nodeId` (string): The ID of the node that started execution.
**Returns:** `Promise<void>`

### onNodeExecutionEnd
**Description:** Handles node execution end event.
**Parameters:**
- `nodeId` (string): The ID of the node that ended execution.
**Returns:** `Promise<void>`

### onWorkflowExecutionError
**Description:** Handles errors during workflow execution.
**Parameters:**
- `error` (any): The error that occurred.
**Returns:** `Promise<void>`

### onRawMessageReceived
**Description:** Sends a raw message to the device.
**Parameters:**
- `message` (string): The raw message to send.
**Returns:** `Promise<void>`

### getDeviceStatus
**Description:** Gets the device status.
**Returns:** `Promise<any>`

## Usage

### Initialization
Ensure the bridge is initialized and available before making any calls:
```typescript
import JsCsBridge from '../utils/JsCsBridge';

const bridge = JsCsBridge.getInstance();
```

### Method Invocation
Use the `invokeMethodAsync` method to call C# methods:
```typescript
try {
  await bridge.invokeMethodAsync('VopPico.App', 'SendCodeToDevice', 'console.log("Hello, world!");');
} catch (error) {
  console.error('Error sending code to device:', error);
}
```

### Configuration
Register methods with the `BridgeConfig` to dynamically bind them based on the host environment:
```typescript
import BridgeConfig from '../utils/BridgeConfig';

const config = BridgeConfig.getInstance();
config.registerMethod('SendCodeToDevice', 'VopPico.App');
```

## Error Handling
- Check if `window.HybridWebView` is available before making calls.
- Provide meaningful error messages when the bridge is unavailable.
- Implement fallback behaviors using `console.log` for development/testing.
- Graceful degradation when running in a browser without the bridge.

## Testing
- Test the implementation with different scenarios to ensure reliability.
- Verify that fallback mechanisms work correctly in browser environments.

## Conclusion
This documentation provides a comprehensive guide to using the bridge methods for communication between JavaScript and C#. Ensure proper initialization, method invocation, and error handling to maintain a robust integration.

### Additional Setup
To enable communication between the web content and the native code, include the `HybridWebView.js` script in your `index.html` file. This script is essential for the bridge to function correctly. You can find more information in the [Microsoft documentation](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/controls/hybridwebview?view=net-maui-9.0).

The `hybridwebview.js` script should be included in the project's source code. You can find the script in the MAUI HybridWebView package. Ensure that the script is correctly referenced in your `index.html` file.

```html
<script src="/hybridwebview.js"></script>
```
