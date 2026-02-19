# VopFlow Format v1.2

## Changelog

### v1.2 (2026-02-15)

**Breaking changes:**
- `args` removed, replaced by `inputs` with structured port definitions
- `method-call` object binding now via data-flow edges instead of string references

**New features:**
- **`inputs`**: Named input ports with default values (`{ "portName": { "default": value } }`)
- **`output`**: Output variable binding (`{ "name": "variableName" }`)
- **`literal`** node type: For constant values (integer, float, string, boolean, list)
- **Named data-in handles**: `data-in:<portName>` targets specific input ports
- **Data-flow edges for objects**: Pin → toggle via `data-in:object` edge
- **`namespace`** field: Reserved for future sub-flow organization

**Migration from v1.1:**
1. Replace `args: { key: value }` with `inputs: { key: { default: value } }`
2. Add `output: { name: "varName" }` to nodes that produce values
3. For `method-call` on instance variables: remove `object` field, add data-flow edge from source node to `data-in:object`
4. Update version to "1.2"

---

## Introduction

**VopFlow** is a JSON file format for representing visual programming workflows. It is based on [ReactFlow](https://reactflow.dev/), a React library for creating node-based flow editors.

The VopFlow format extends ReactFlow's native types (`Node` and `Edge`) to support:
- Multiple programming languages (MicroPython, Python, Arduino, etc.)
- Semantic node types (functions, methods, loops, conditions, etc.)
- Typed connections (control flow, data flow)
- Multiple handles for precise connections

A VopFlow file can be loaded into a visual editor, modified graphically, then saved and used to generate code in the target language.

---

## Global Structure

A `.vopflow` file contains a JSON object with the following properties:

```json
{
  "version": "1.1",
  "name": "My Flow",
  "metadata": {
    "author": "Author Name",
    "createdAt": "2026-02-07T10:30:00Z",
    "updatedAt": "2026-02-07T14:45:00Z"
  },
  "nodes": [...],
  "edges": [...]
}
```

### Root Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `version` | string | ✅ | Format version (currently "1.1") |
| `name` | string | ✅ | Workflow name |
| `metadata` | object | ❌ | Optional metadata (author, dates) |
| `nodes` | array | ✅ | List of workflow nodes |
| `edges` | array | ✅ | List of connections between nodes |

### Metadata

| Property | Type | Description |
|----------|------|-------------|
| `author` | string | Workflow author name |
| `createdAt` | string | Creation date (ISO 8601) |
| `updatedAt` | string | Last modification date (ISO 8601) |

---

## Nodes

A **node** represents an instruction or element of the workflow (import, function, loop, etc.).

### Base Structure

Each node follows the ReactFlow structure and has the following properties:

```json
{
  "id": "unique-node-id",
  "type": "function-call",
  "position": {
    "x": 100,
    "y": 200
  },
  "data": {
    "label": "Display",
    "target": "micropython",
    "function": "print",
    "args": {
      "message": "Hello World"
    }
  }
}
```

### Common Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique node identifier |
| `type` | string | ✅ | Node type (see types below) |
| `position` | object | ✅ | Node position `{x, y}` in the editor |
| `data` | object | ✅ | Node data (see structure below) |

### `data` Structure

The `data` field follows a **mixed** structure:
- **Common fields** for all nodes: `label`, `target`
- **Type-specific fields**: `function`, `method`, `inputs`, etc.
- **v1.2 fields**: `inputs`, `output`, `valueType`, `namespace`

| Property | Type | Present on | Description |
|----------|------|------------|-------------|
| `label` | string | All | Label displayed in the UI |
| `target` | string | All except `start` | Target language (`micropython`, `python`, `arduino`, etc.) |
| `function` | string | `function-call` | Function name to call |
| `method` | string | `method-call` | Method name to call |
| `object` | string | `method-call` | Module/static object name (e.g., `"machine"`) |
| `module` | string | `import` | Module to import (e.g., `machine.Pin`) |
| `alias` | string | `import` | Import alias (optional) |
| `loopType` | string | `loop` | Loop type (`for`, `while`) |
| `iterator` | string | `loop` (for) | Iteration variable name |
| `condition` | string | `loop`, `condition` | Loop or branch condition |
| `name` | string | `variable` | Variable name |
| `value` | any | `variable`, `literal` | Variable/literal value |
| `valueType` | string | `literal` | Value type (`integer`, `float`, `string`, `boolean`, `list`) |
| `inputs` | object | `function-call`, `method-call` | Named input ports with defaults (v1.2) |
| `output` | object | `function-call`, `method-call` | Output variable binding (v1.2) |
| `namespace` | string | Any | Namespace for organization (future use) |

---

## Node Types

### 1. `start` - Entry Point

Unique node that marks the beginning of workflow execution.

**Structure:**
```json
{
  "id": "start",
  "type": "start",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Start"
  }
}
```

**`data` properties:**
- `label`: Label (typically "Start")

---

### 2. `import` - Module Import

Imports a module or library.

**Structure:**
```json
{
  "id": "import1",
  "type": "import",
  "position": { "x": 100, "y": 150 },
  "data": {
    "label": "import machine.Pin",
    "target": "micropython",
    "module": "machine.Pin",
    "alias": "Pin"
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `module`: Module to import (e.g., `machine.Pin`, `time`)
- `alias`: (optional) Import alias

**Code generation:**
- MicroPython: `from machine import Pin` or `import time`
- Python: `import module` or `from module import Class`

---

### 3. `function-call` - Function Call

Calls a function (not bound to an object).

**Structure:**
```json
{
  "id": "print1",
  "type": "function-call",
  "position": { "x": 200, "y": 300 },
  "data": {
    "label": "print",
    "target": "micropython",
    "function": "print",
    "args": {
      "message": "Hello"
    }
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `function`: Function name (e.g., `print`, `range`, `len`)
- `args`: Object containing function arguments

**Code generation:**
- MicroPython: `print("Hello")`
- Python: `range(10)`

---

### 4. `method-call` - Method Call

Calls a method on an object.

**Structure:**
```json
{
  "id": "toggle1",
  "type": "method-call",
  "position": { "x": 200, "y": 400 },
  "data": {
    "label": "toggle",
    "target": "micropython",
    "object": "led",
    "method": "toggle",
    "args": {}
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `object`: Object (variable) name on which to call the method
- `method`: Method name (e.g., `toggle`, `write`, `read`)
- `args`: Object containing method arguments

**Code generation:**
- MicroPython: `led.toggle()`
- Python: `my_list.append(5)`

---

### 5. `loop` - Loop

Represents a `for` or `while` loop.

**Structure (for):**
```json
{
  "id": "for1",
  "type": "loop",
  "position": { "x": 300, "y": 500 },
  "data": {
    "label": "for i in range",
    "target": "micropython",
    "loopType": "for",
    "iterator": "i"
  }
}
```

**Structure (while):**
```json
{
  "id": "while1",
  "type": "loop",
  "position": { "x": 300, "y": 500 },
  "data": {
    "label": "while True",
    "target": "micropython",
    "loopType": "while",
    "condition": "True"
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `loopType`: `"for"` or `"while"`
- `iterator`: (for) Iteration variable name
- `condition`: (while) Loop condition

**Connections:**
- Input `data-in`: Receives iterable (for `for`) or nothing (for `while`)
- Output `control-out`: Loop body
- Output `loop-back`: Return to loop beginning

---

### 6. `condition` - Conditional Branch

Represents an `if/else` statement.

**Structure:**
```json
{
  "id": "if1",
  "type": "condition",
  "position": { "x": 400, "y": 600 },
  "data": {
    "label": "if x > 10",
    "target": "micropython",
    "condition": "x > 10"
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `condition`: Boolean expression

**Connections:**
- Output `condition-true`: Branch if condition is true
- Output `condition-false`: Branch if condition is false

---

### 7. `variable` - Declaration/Assignment

Declares or assigns a value to a variable.

**Structure:**
```json
{
  "id": "var1",
  "type": "variable",
  "position": { "x": 150, "y": 250 },
  "data": {
    "label": "led = Pin(25)",
    "target": "micropython",
    "name": "led",
    "value": "Pin(25, Pin.OUT)"
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `target`: Target language
- `name`: Variable name
- `value`: Value or expression to assign

---

### 8. `literal` - Constant Value (NEW in v1.2)

Represents a constant value that can be connected to other nodes' inputs via data-flow.

**Structure:**
```json
{
  "id": "count-literal",
  "type": "literal",
  "position": { "x": 535, "y": 120 },
  "data": {
    "label": "20",
    "value": 20,
    "valueType": "integer"
  }
}
```

**`data` properties:**
- `label`: Displayed label
- `value`: The constant value
- `valueType`: Type of value (`integer`, `float`, `string`, `boolean`, `list`)

**Connections:**
- No `control-in` or `control-out` (not part of control flow)
- One `data-out` handle to connect to other nodes' inputs

**Code generation:**
- The literal value is used directly in the generated code (e.g., `20`, `"Hello"`, `3.14`)

---

## v1.2 Features

### Structured Inputs (`inputs`)

**Replaces `args` from v1.1.**

Each node can define named input ports with optional default values. If a data-flow edge connects to an input port, it overrides the default.

**Example:**
```json
{
  "id": "sleep",
  "type": "function-call",
  "data": {
    "function": "time.sleep",
    "inputs": {
      "duration": { "default": 0.5 }
    }
  }
}
```

**Resolution rules:**
1. If a data-flow edge targets `data-in:duration` → use connected value
2. Otherwise → use `inputs.duration.default`
3. If no default and no edge → error (missing required input)

### Output Variable Binding (`output`)

**NEW in v1.2.**

Nodes that produce values declare the variable name for their result.

**Example:**
```json
{
  "id": "Pin",
  "type": "method-call",
  "data": {
    "method": "Pin",
    "object": "machine",
    "inputs": {
      "pin": { "default": "LED" },
      "mode": { "default": "Pin.OUT" }
    },
    "output": { "name": "pin" }
  }
}
```

**Generated code:** `pin = machine.Pin(LED, Pin.OUT)`

### Data-Flow for Object Binding

**Changed in v1.2.**

Instance methods now receive their object via data-flow edges instead of string references.

**Before (v1.1):**
```json
{
  "type": "method-call",
  "data": {
    "object": "pin",  // String reference
    "method": "toggle"
  }
}
```

**After (v1.2):**
```json
// toggle node - no object field
{
  "type": "method-call",
  "data": {
    "method": "toggle"
  }
}

// Data-flow edge from Pin node to toggle
{
  "source": "Pin",
  "target": "toggle",
  "sourceHandle": "data-out",
  "targetHandle": "data-in:object",
  "metadata": { "flowType": "data-flow" }
}
```

**Note:** Static/module calls still use `object` as a string (e.g., `"object": "machine"`).

### Named Input Handles

**NEW in v1.2.**

Data-flow edges can target specific input ports using `data-in:<portName>` syntax.

**Examples:**
- `"targetHandle": "data-in:count"` → connects to the `count` input port
- `"targetHandle": "data-in:duration"` → connects to the `duration` input port
- `"targetHandle": "data-in:object"` → connects to the object input (for instance methods)
- `"targetHandle": "data-in"` → generic data input (still valid for loop iterables)

---

## Handles (Connection Points)

**Handles** are connection points on nodes. They allow precise connections between nodes.

### Handle Types

| Handle | Direction | Usage |
|--------|-----------|-------|
| `control-in` | input | Control flow input (sequential execution) |
| `control-out` | output | Control flow output |
| `data-in` | input | Generic data input (parameter, iterable) |
| `data-in:<portName>` | input | **v1.2:** Named data input (targets specific input port) |
| `data-out` | output | Data output (return value) |
| `loop-back` | output | Loop return (points to loop beginning) |
| `condition-true` | output | Branch if condition is true |
| `condition-false` | output | Branch if condition is false |

### Usage Example

A `loop` node can have:
- 1 `control-in` handle (loop entry)
- 1 `data-in` handle (to receive iterable in a `for`)
- 1 `control-out` handle (loop body)
- 1 `loop-back` handle (return to beginning)

---

## Edges (Connections)

An **edge** represents a connection between two nodes.

### Base Structure

```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "sourceHandle": "control-out",
  "targetHandle": "control-in",
  "animated": false,
  "label": "",
  "metadata": {
    "flowType": "control-flow"
  }
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique connection identifier |
| `source` | string | ✅ | Source node ID |
| `target` | string | ✅ | Target node ID |
| `sourceHandle` | string | ❌ | Source node handle (e.g., `control-out`) |
| `targetHandle` | string | ❌ | Target node handle (e.g., `control-in`) |
| `animated` | boolean | ❌ | If `true`, connection is animated in UI |
| `label` | string | ❌ | Label displayed on the connection |
| `metadata` | object | ❌ | Custom metadata |

### Flow Types (metadata.flowType)

| Type | Description |
|------|-------------|
| `control-flow` | Sequential execution flow (execution order) |
| `data-flow` | Data flow (value passing between nodes) |

**Example:**
- `control-flow`: The output of a `function-call` node points to the input of another node
- `data-flow`: The `data-out` output of a `function-call` (which returns a value) feeds the `data-in` input of a `loop`

---

## Multi-Language Support

The `data.target` field allows specifying the target language for each node. This makes the VopFlow format extensible to different languages.

### Possible Values

| Value | Description |
|-------|-------------|
| `micropython` | MicroPython (Raspberry Pi Pico, ESP32, etc.) |
| `python` | Standard Python (CPython 3.x) |
| `arduino` | Arduino C++ |
| `javascript` | JavaScript (Node.js, browser) |
| `rust` | Rust (embedded or standard) |

### Multi-Language Example

The same workflow can target different languages:

**MicroPython:**
```json
{
  "type": "function-call",
  "data": {
    "target": "micropython",
    "function": "print",
    "inputs": { "message": { "default": "Hello" } }
  }
}
```
→ Generates: `print("Hello")`

**Arduino C++:**
```json
{
  "type": "function-call",
  "data": {
    "target": "arduino",
    "function": "Serial.println",
    "inputs": { "message": { "default": "Hello" } }
  }
}
```
→ Generates: `Serial.println("Hello");`

---

## Complete Example: Blink LED

Here's a complete example of a "Blink" workflow that blinks an LED.

```json
{
  "version": "1.1",
  "name": "Blink LED",
  "metadata": {
    "author": "VopFlow",
    "createdAt": "2026-02-07T10:00:00Z",
    "updatedAt": "2026-02-07T10:00:00Z"
  },
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 100, "y": 50 },
      "data": {
        "label": "Start"
      }
    },
    {
      "id": "import1",
      "type": "import",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "import machine.Pin",
        "target": "micropython",
        "module": "machine.Pin"
      }
    },
    {
      "id": "import2",
      "type": "import",
      "position": { "x": 100, "y": 150 },
      "data": {
        "label": "import time",
        "target": "micropython",
        "module": "time"
      }
    },
    {
      "id": "led",
      "type": "variable",
      "position": { "x": 100, "y": 200 },
      "data": {
        "label": "led = Pin(25, Pin.OUT)",
        "target": "micropython",
        "name": "led",
        "value": "Pin(25, Pin.OUT)"
      }
    },
    {
      "id": "loop",
      "type": "loop",
      "position": { "x": 100, "y": 250 },
      "data": {
        "label": "while True",
        "target": "micropython",
        "loopType": "while",
        "condition": "True"
      }
    },
    {
      "id": "toggle",
      "type": "method-call",
      "position": { "x": 200, "y": 300 },
      "data": {
        "label": "led.toggle()",
        "target": "micropython",
        "object": "led",
        "method": "toggle",
        "args": {}
      }
    },
    {
      "id": "sleep",
      "type": "function-call",
      "position": { "x": 200, "y": 350 },
      "data": {
        "label": "time.sleep(0.5)",
        "target": "micropython",
        "function": "time.sleep",
        "args": {
          "seconds": 0.5
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start",
      "target": "import1",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e2",
      "source": "import1",
      "target": "import2",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e3",
      "source": "import2",
      "target": "led",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e4",
      "source": "led",
      "target": "loop",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e5",
      "source": "loop",
      "target": "toggle",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e6",
      "source": "toggle",
      "target": "sleep",
      "sourceHandle": "control-out",
      "targetHandle": "control-in",
      "metadata": { "flowType": "control-flow" }
    },
    {
      "id": "e7",
      "source": "sleep",
      "target": "loop",
      "sourceHandle": "control-out",
      "targetHandle": "loop-back",
      "metadata": { "flowType": "control-flow" }
    }
  ]
}
```

**Generated code (MicroPython):**
```python
from machine import Pin
import time

led = Pin(25, Pin.OUT)

while True:
    led.toggle()
    time.sleep(0.5)
```

---

## Extensibility

The VopFlow format is designed to be **extensible**:

1. **New node types**: Add new types while respecting the `data` structure
2. **New languages**: Add a `target` value and implement the code generator
3. **Custom fields**: Add fields in `data` or `metadata` without breaking compatibility
4. **Custom handles**: Define new handles for specific connections

### Extension Example

**New node type: `try-catch`**
```json
{
  "id": "try1",
  "type": "try-catch",
  "position": { "x": 300, "y": 400 },
  "data": {
    "label": "try/except",
    "target": "micropython"
  }
}
```

**New connection: `error-handler`**
```json
{
  "id": "error-edge",
  "source": "try1",
  "target": "error-handler",
  "sourceHandle": "on-error",
  "targetHandle": "control-in",
  "metadata": {
    "flowType": "control-flow"
  }
}
```

---

## ReactFlow Compatibility

The VopFlow format **extends** ReactFlow without breaking it:

- ✅ Properties `id`, `type`, `position` are standard ReactFlow
- ✅ The `data` field is used according to ReactFlow convention
- ✅ `edges` respect ReactFlow structure (`source`, `target`, `sourceHandle`, `targetHandle`)
- ✅ A VopFlow file can be directly loaded into a ReactFlow component

To load a VopFlow into ReactFlow:

```typescript
import { VopFlow } from './types';
import { useNodesState, useEdgesState } from 'reactflow';

const vopflow: VopFlow = // ... load from JSON
const [nodes, setNodes] = useNodesState(vopflow.nodes);
const [edges, setEdges] = useEdgesState(vopflow.edges);
```

---

## Resources

- [ReactFlow Documentation](https://reactflow.dev/)
- [ReactFlow API Reference](https://reactflow.dev/api-reference)
- [VopFlow TypeScript Types](../interfaces/VopFlowTypes.ts)
- [VopFlow JSON Schema](../interfaces/VopFlowSchema.json)

---

**Document version:** 1.2
**Last updated:** 2026-02-15
