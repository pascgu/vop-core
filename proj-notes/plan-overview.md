# Action Plan for the VoP Project

## 1. VoP-core (Priority 1)
- **Objective**: Develop the common core for VoP, including a shared frontend used by other applications.
- **Technologies**: React (ReactFlow) for the frontend, TypeScript for the backend.
- **Steps**:
  1. **Create the VoP-core/ui repo**:
     - Develop the ReactFlow frontend (the graph editor).
     - Define the JSON schema for exchange between the UI and backends. **(Clarification: Ensure the schema supports the Tracing/OpenTelemetry events required for the 'Slow Motion Mode' debug feature.)**
  2. **Integrate with VoP-pico and VoP-vscode**:
     - Ensure the shared frontend works correctly with specific applications.
  3. **Test and validate**:
     - Ensure compatibility and performance of the shared frontend.
- Architecture:

| Directory | Description |
| :--- | :--- |
| /ui | Source code for the React/TypeScript application (ReactFlow). |
| /ui/src/interfaces/IVopHost.ts	| Crucial: Defines the functions that the native host must implement. |
| /dist | BUILD TARGET: Contains generated static files |
| /dist/web-assets | Contains index.html, bundle.js, etc. This directory is copied into other projects. |

## 2. VoP-pico (Priority 1)
- **Objective**: Develop a MAUI application to program and control a Raspberry Pi Pico from an Android phone, Windows, and Linux via USB OTG. Add a HybridWebView component to integrate the React frontend.
- **Technologies**: React (ReactFlow) for the frontend, MAUI (with HybridWebView) for the application, C# for the backend.
- **Steps**:
  1. **Develop the MAUI application**:
     - Create new MAUI project (VS2022 or vscode with .Net 9).
     - Integrate the ReactFlow frontend into a HybridWebView.
     - Develop the C# backend to convert JSON into MicroPython code.
     - Use a USB OTG library to send code to the Pico.
  2. **Adapt for Windows/Linux**:
     - Ensure the application is compatible with Windows and Linux.
  3. **Test and validate**:
     - Ensure that the MicroPython code is correctly sent and executed on the Pico.
     - Validate the user interface and user experience.
- Architecture:

| Directory | Description |
| :--- | :--- |
| **`/src/VopPico.App`** | Main MAUI project (C#). |
| `/src/VopPico.App/Resources/Raw/index.html` | **Destination:** Copy of `vop-core/index.html` (Using raw resources is an option). |
| `/src/VopPico.App/Pages/PicoPage.xaml` | XAML page containing the `<HybridWebView>` control. |
| `/src/VopPico.App/Pages/PicoPage.xaml.cs` | Code-behind that initializes the `PicoJsInterface`. |
| `/src/VopPico.App/Services/PicoJsInterface.cs` | C# class receiving JS calls (methods with `[JsonInclude]`). |
| `/src/VopPico.App/Platforms/Android/Usb/AndroidSerial.cs` | **Native code for USB OTG.** |
| `VopPico.sln` | Visual Studio solution. |


## 3. VoP-vscode (Priority 2)
- **Objective**: Integrate VoP as a VSCode extension for JavaScript and Python.
- **Technologies**: React (ReactFlow) for the frontend, TypeScript for the backend.
- **Steps**:
  1. **Create the VSCode extension**:
     - Integrate the ReactFlow frontend into a WebView.
     - Develop the TypeScript backend to interact with the VSCode API.
  2. **Develop bidirectionality**:
     - Allow code generation from diagrams and vice versa.
     - Use the VSCode Linter to analyze code and extract necessary information.
  3. **Implement Debugging/Tracing**:
     - **Integrate a component to receive and visualize OpenTelemetry traces** sent by the execution engine (potentially MAF). This enables the **"Slow Motion Mode"** feature inspired by DevUI.
  4. **Test and validate**:
     - Ensure the extension works correctly with JavaScript and Python.
     - Validate integration with VSCode and user experience.
- Architecture:

| Directory | Description |
| :--- | :--- |
| **`/src/extension.ts`** | Entry point: launches the WebView. |
| `/src/VscodeHost.ts` | Implements the Host: manages JS calls to VS Code commands. |
| **`/media`** | **Destination:** Copy of Web Assets from `vop-core`. |
| `package.json` | Extension manifest. |

## 4. MAF and Tracing Integration (Priority 3)
- **Objective**: Evaluate and prototype the Microsoft Agent Framework (MAF) as the backend for C#/Python workflow execution, and implement the standardized tracing model (OpenTelemetry) for visual debugging.
- **Technologies**: C#, Python, OpenTelemetry, React.
- **Steps**:
  1. **MAF Feasibility Study**:
     - Determine how to map the VoP JSON workflow to a MAF workflow definition (Agents/Transitions).
     - Prototype a minimal MAF workflow executor that consumes the VoP JSON.
  2. **Implement OpenTelemetry Tracing**:
     - Integrate OpenTelemetry into the MAF prototype to emit structured events (e.g., 'NodeStarted', 'NodeCompleted', 'DataFlow').
     - Define the communication channel (e.g., WebSocket, API) for the frontend to consume these traces.
  3. **Frontend Debug Component**:
     - Develop the React Flow component in `VoP-core/ui` that subscribes to tracing events and animates the corresponding nodes (e.g., color change for "Slow Motion Mode").

## 5. VoP-maui (Priority 4)
- **Objective**: Develop a MAUI application for development on Android, Windows, Linux, iOS, Mac, and web-app, using low-level features specific to each platform.
- **Technologies**: React (ReactFlow) for the frontend, MAUI + HybridWebView for the application, C# for the backend.
- **Steps**:
  1. **Develop the MAUI application**:
     - Create new MAUI project (VS2022 or vscode with .Net 9).
     - Integrate the ReactFlow frontend into a HybridWebView.
     - Develop the C# backend to use platform-specific features (GPS, accelerometer, etc.).
  2. **Adapt for each platform**:
     - Ensure the application is compatible with each platform.
  3. **Test and validate**:
     - Ensure that platform-specific features work correctly.
     - Validate the user interface and user experience.
- Architecture:

| Directory | Description |
| :--- | :--- |
| **`/src/VopMaui.App`** | Main MAUI project (C#). |
| `/src/VopMaui.App/Resources/Raw/index.html` | **Copy of Web Assets from vop-core.** |
| `/src/VopMaui.App/Pages/SensorPage.xaml` | XAML page containing the `<HybridWebView>` control. |
| `/src/VopMaui.App/Services/SensorJsInterface.cs` | C# class implementing sensor access via MAUI Essentials. |
| `VopMaui.sln` | Visual Studio solution. |