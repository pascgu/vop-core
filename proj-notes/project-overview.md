# VoP Project - Visual Object Programming

## Project Description
The VoP project aims to create an ecosystem of applications that share a common graphical interface based on ReactFlow. The applications include:
- `vop-pico`: An Android application for sending instructions to a microcontroller connected via USB.
- `vop-maui`: A MAUI application for native development on multiple platforms (Windows, Linux, Android, iOS, macOS).
- `vop-vscode`: A VS Code extension allowing the graphical interface to be viewed on one side and the code on the other, enabling interaction on both sides.

The proposed overall architecture is a "Core Web + Native Wrappers" architecture. The UI core is developed in React (TypeScript), and each application is a shell that loads this React bundle and injects a specific API to communicate with hardware (USB, GPS, etc.).

## 1. Main Objectives
### Bidirectionality
- The tool must allow code to be generated from a visual **and** a visual to be generated from existing code.

### Multi-language Support
- Initial support for **C#**, **Python**, **JavaScript**, and **MicroPython** (for Raspberry Pi Pico projects within the association).
- Extensible architecture to add other languages via description files (CSV/JSON).

### IDE Integration
- Provide the project as an **add-on for VSCode** (priority), then for **Visual Studio**. One add-on per programming language.

### Visual Optimization
- Display complex programs compactly (smallest possible boxes), with a **sub-node** system (double-click to zoom).

### Android Development
- Allow programming a Raspberry Pi Pico from an Android phone (via USB OTG or WiFi) and controlling it like a remote (buttons, sliders, etc.).

### UI Standardization
- Centralize the development of the graphical interface (Frontend) so it can be shared between the VSCode extension, the Android application, and the Desktop version.

## 2. Key Features
### Function Description
- Each language or framework function is described in a **JSON** file (inputs/outputs, types, icon, text). These descriptions are grouped in a **CSV** (1 column = 1 JSON per function).

### Automatic Generation
- For languages like **C#** and **Python**, use **reflection** to automatically generate the function CSV. For **MicroPython**, plan for manual or semi-automated description (no native reflection). **Alternative**: Use the **VSCode Linter** to analyze existing code and extract necessary information (inputs/outputs, types), avoiding the need to re-code parsers.

### Parallel Execution
- If two paths can be executed in parallel, launch them in **multithread** to utilize the language's capabilities. For **MicroPython**, allow explicit use of the second core (no automatic multithreading).

### Visual Refactoring
- Group similar code segments to minimize the number of high-level nodes. Each function becomes a sub-node.

### Integrated UI
- Each node can have its own **UI** (like LabView), with customizable widgets. In the end, a form containing all widgets is obtained.

### Data Visualization
- Display **data flowing** between nodes (moving points on links). Add a **slow motion mode** for debugging.

### Visible Constants
- Display constants used as function input (like LabView), but allow them to be hidden if not useful.

### Android Support
- Develop an Android application (MAUI or Flutter) to program and control Picos via USB OTG or WiFi (MQTT).

### Automatic Connections
- When a node is brought close to another, automatically propose connections between compatible ports (outputs → inputs). Two options: automatic connection if port names match, or displaying a form allowing the user to choose from possible connections.

### Handling Unknown Instructions
- When VoP reads code and generates a workflow, unrecognized instructions (keywords, syntax, missing functions or libraries) must be represented by a **dedicated grey/red node** in the workflow. These nodes are **ignored during execution**, but their code is **preserved as is** in the generated file to ensure the source code remains functional.

## 3. Technical Choices
| Choice | Justification |
|---|---|
| **CSV/JSON Files** | Centralize function descriptions to facilitate adding new languages. |
| **Reflection (C#/Python)** | Automate function description generation for these languages. |
| **VSCode Linter** | Use the built-in VSCode Linter to analyze code and extract necessary information (inputs/outputs, types), avoiding the need to re-code parsers. |
| **Multithreading** | Exploit native parallelism for independent paths. For **MicroPython**, allow explicit management of the second core. |
| **VSCode Add-on** | Priority to VSCode for its popularity and modularity. Visual Studio will follow. |
| **Widgets and UI** | Inspired by LabView, but with a modular and extensible approach. |
| **DrawnUI (SkiaSharp)** | *Native Option (Historical, set aside in favor of HybridWebView)*: Open-source library (MIT) for creating vector and interactive interfaces in C#. Ideal for flow diagrams and real-time animations (60 FPS). |
| **LiveCharts2** | Open-source library (MIT) for dynamic charts, compatible with SkiaSharp for optimal performance. |
| **Flutter** | Open-source framework (Google) for fluid (60-120 FPS) and lightweight (~50-100 Mo RAM) interfaces. Ideal for complex animations and cross-platform mobile development. |
| **Pure MAUI** | Native C# integration without WebView. Better performance (~60 FPS) and memory (~50-80 Mo). |
| **Hybrid MAUI (Blazor)** | Uses a WebView to embed Blazor components. Memory overhead (~100-150 Mo) and limited performance (~30-60 FPS). |
| **Web Technologies (React/TS)** | Allows creating a single Frontend compatible with VSCode (Webview) and Android (via Blazor Hybrid). **Chosen option for graphical editing.** |
| **Tolerant Parser** | Use a tolerant parser (e.g., Roslyn for C#, AST for Python) to identify unknown instructions without interrupting analysis. |
| **Web Version (Blazor WASM)** | Allow VoP to be used without installation, ideal for collaborative or quick modifications. Ignored in a second phase in favor of HybridWebView. |
| **MAUI Version (HybridWebView)** | Chosen for its lightness and performance compared to MAUI BlazorWebView. Allows direct communication between C# and JavaScript code without the Blazor runtime overhead and native access to hardware features. Added with .Net 9 in November 2025. |
| **Microsoft Agent Framework** | **Execution Engine to Study**: Open-source framework for **graph-based workflow orchestration** in **C# and Python**. Must serve as a robust **Backend Runtime** for graphs generated by VoP, adopting its **Tracing (OpenTelemetry)** model for visual debugging. |

### Architecture

For the UI, considered options were:
- **MAUI+DrawnUI (Native C#)**: Does not allow reusing the UI made in ReactFlow.
- **Hybrid MAUI+Blazor WebView**: Allows reusing the UI made in ReactFlow but is heavier.
- **MAUI+HybridWebView**: Chosen. Allows reusing the UI made in ReactFlow and is lighter, also providing native access to hardware features.

1.  **VoP-core**: The central repo
  - **ui/: Common Frontend (Web)**: The visual editor is coded in **TypeScript** (React Flow). It generates a JSON. It is a pure React (TypeScript) project. It contains ReactFlow, diagram logic, and interface state. It produces a static "build" (index.html, bundle.js, style.css).
  - proj/: project description and task tracking files (e.g., `proj.json`, `tasks.json`).
  - eventually other tools common to different applications.
2.  **"Shells" Architecture**: The VoP-core Web frontend is encapsulated in different native containers:
  - **VoP-vscode: VSCode extension**: via Webview.
  - **VoP-pico (Android, Windows, Linux)**: via **MAUI + HybridWebView**.
  - **VoP-maui (Windows, Linux, Mac, Android, iOS)**: via **MAUI + HybridWebView**.

## 4. Areas for Reflection / Refinement
| Idea | Status | Comment |
|---|---|---|
| **UI per Node** | To explore | How to standardize widgets so they are reusable and consistent? |
| **Slow Motion Mode for Debug** | To implement | Useful for visualizing complex data flows. **Adopt the Tracing/OpenTelemetry approach inspired by DevUI.** |
| **Hiding Constants** | To implement | Option to hide/show constants based on their usefulness. |
| **Form Generation** | To explore | How to aggregate the widgets of each node into a final form? |
| **DrawnUI Integration** | *On hold* | Primarily replaced by a Web prototype (React Flow) to validate VSCode integration. DrawnUI remains an option if Web performance is insufficient on mobile. |
| **LiveCharts2** | To implement | Integrate real-time charts for data visualization. |
| **Automatic Connections** | To explore | Time saving, intuitive experience. |
| **Handling Unknown Instructions** | To explore | Grey/red nodes ignored during execution but preserved in the code. |
| ~~**Add-on for all IDEs**~~ | **Not chosen** | Focus on VSCode and Visual Studio first, then extend if demand arises. |
| **Flutter** | Not chosen | Complexity of the bridge between Dart and JavaScript and poorer integration with ReactFlow. |
| **React Native** | Not chosen | Incompatible with ReactFlow which requires the standard Web DOM. |
| **Capacitor/Ionic** | Not chosen | Complexity of the bridge between JavaScript and native APIs. |
| **HybridWebView** | To implement | Complexity of the bridge between JavaScript and native APIs. |
| **MAF (DevUI) Investigation** | **Priority** | Evaluate using the **Microsoft Agent Framework** as a *backend* engine for C#/Python workflow execution and integrating its **DevUI** (Tracing/OpenTelemetry model) for advanced visual debugging. |

## 5. Analysis of Existing Solutions
### **LabVIEW**
- **Strengths**: Real-time visualization of data flows, advanced user interface management, code/visual bidirectionality, multi-language support (C, Python).
- **To Adopt**: Dynamic data visualization, modular interface management, IDE integration (Visual Studio, VSCode).
- **To Avoid**: Complexity for beginners, high cost.

### **n8n**
- **Strengths**: Visual automation, AI integration, multi-language management (JavaScript, Python), bidirectionality.
- **To Adopt**: Bidirectional code generation, IDE integration, API and external service management. **Major inspiration for the Web UI (Rete.js).**
- **To Avoid**: Sequential node execution, complex configuration.

### **Node-RED**
- **Strengths**: Open-source, intuitive interface, parallel execution, large node library.
- **To Adopt**: Flexibility, workflow management, integration with external services.
- **To Avoid**: Limited multi-language management, less suitable for non-developers.

### **Microsoft Agent Framework (MAF) and DevUI**
- **MAF Strengths**:
    - Open-source framework unifying Semantic Kernel and AutoGen, natively supporting **C# and Python**.
    - Structures workflows as **graphs** (Agents, Transitions), aligned with VoP's visual logic.
    - Integrates **DevUI**, a visual debugging tool based on **OpenTelemetry** to trace agent reasoning.
- **Utility for VoP**:
    - **Backend Engine**: Use MAF to execute complex workflows (parallelism, orchestration) instead of creating a proprietary engine.
    - **Visual Debug**: Take inspiration from DevUI to implement the "Slow Motion Mode". The MAF backend emits OpenTelemetry traces that the VoP frontend (React Flow) listens to for real-time node animation.
- **Key Distinction with VoP**:
    - **DevUI is a Visualizer (Output)**, often implemented in Blazor WebAssembly, designed to *monitor* an application. It is not designed for interactive graphical editing (Input).
    - **VoP is an Editor (Input)** that uses **React Flow** for fluid editing and VSCode integration.

## 6. Recommendations for VoP
### **Features to Adopt**
- **Real-time visualization of data flows** (inspired by LabView).
- **Bidirectional automatic code generation** (LabVIEW, n8n).
- **Multi-language support and extensibility** (LabVIEW, n8n).
- **Advanced user interface management** (LabView).
- **Integration with modern IDEs** (LabVIEW, n8n).
- **Slow Motion Mode for debug** (inspired by LabView).
- **Hiding constants** (LabView).
- **Use of VSCode Linter** to analyze code and extract necessary information (inputs/outputs, types).
- **Use of DrawnUI** (Reserve: only if the Web approach fails in performance).
- **Unified Web Architecture (React Flow/Rete.js)**: To share the frontend between VSCode and Android.
- **LiveCharts2** for dynamic visualizations.
- **Automatic connections between nodes** to simplify workflow creation.
- **Handling unknown instructions** to allow editing partially misunderstood projects.
- **MAUI+HybridWebView+ReactFlow version** for cross-platform management and access to hardware features.
- **Integration of the Microsoft Agent Framework** for advanced visual debugging and native orchestration of C#/Python graph-based workflows.
- **Avoid using Blazor technology for the interactive editing part** (maintain React Flow).

### **Pitfalls to Avoid**
- Complexity of use for beginners (LabView).
- Multithreading limitations (n8n).
- Lack of multi-language support (Node-RED).
- Complex initial configuration (n8n).
- **Caution regarding DevUI usage**: Do not attempt to replace React Flow with DevUI technology (Blazor) for the interactive editing part.

### **Innovation Opportunities**
- Combination of bidirectionality, native multithreading, and modern IDE integration.
- Native integration of artificial intelligence for code generation and optimization (n8n).
- Advanced management of constants and dependencies.
- Support for visual educational programming (Scratch, Blockly).
- **Use of existing VSCode tools** (like the Linter) to simplify code analysis.
- **Android Development** for programming and controlling Picos on the go.
- **Automatic connections between nodes** to speed up workflow creation.
- **Handling unknown instructions** for flexible use of VoP.
- **Web version** for increased accessibility.
- **Adoption of the OpenTelemetry Tracing model** inspired by DevUI for advanced visual debugging.
