# VopFlow Schema Documentation

## Overview

The VopFlow schema defines a structured format for representing visual programming flows that can be converted to executable code for various platforms, including MicroPython for Raspberry Pi Pico. This documentation explains the schema structure, design decisions, and usage patterns.

## Schema Version 1.1

### Core Structure

```json
{
  "version": "1.1",
  "name": "Flow Name",
  "metadata": {
    "author": "Creator Name",
    "createdAt": "ISO Date",
    "updatedAt": "ISO Date"
  },
  "nodes": [...],
  "edges": [...]
}
```

## Node Types

### 1. Import Node
```json
{
  "id": "import_machine",
  "type": "import",
  "position": { "x": 132, "y": -43 },
  "data": {
    "module": "machine",
    "symbols": ["Pin"],
    "alias": null,
    "properties": {
      "label": "import machine"
    }
  }
}
```

**Purpose**: Represents module imports
**Fields**:
- `module`: Module name to import
- `symbols`: Array of symbols to import
- `alias`: Optional import alias
- `properties.label`: Display label

### 2. Start Node
```json
{
  "id": "start",
  "type": "start",
  "position": { "x": 360, "y": -36 },
  "data": {
    "properties": {
      "label": "Start"
    }
  }
}
```

**Purpose**: Entry point for the flow execution

### 3. Function Call Node
```json
{
  "id": "pin_init",
  "type": "function_call",
  "position": { "x": 361, "y": 20 },
  "data": {
    "prototype": "machine.Pin.__init__",
    "inputs": [
      { "id": "pin", "type": "str", "value": "LED" },
      { "id": "mode", "type": "str", "value": "Pin.OUT" }
    ],
    "outputs": [
      { "id": "led_instance", "type": "machine.Pin" }
    ],
    "properties": {
      "label": "Pin Init"
    }
  }
}
```

**Purpose**: Represents function calls (including constructors)
**Fields**:
- `prototype`: Full path to function (module.Class.method)
- `inputs`: Function parameters with types and values
- `outputs`: Return values with types
- `properties.label`: Display label

### 4. Method Call Node
```json
{
  "id": "toggle_led",
  "type": "method_call",
  "position": { "x": 361, "y": 98 },
  "data": {
    "target": "led_instance",
    "method": "toggle",
    "properties": {
      "label": "Toggle LED"
    }
  }
}
```

**Purpose**: Represents method calls on objects
**Fields**:
- `target`: Reference to the target object (from another node's output)
- `method`: Method name to call
- `properties.label`: Display label

### 5. Loop Node
```json
{
  "id": "for_loop",
  "type": "loop",
  "position": { "x": 463, "y": 221 },
  "data": {
    "loop_type": "for",
    "inputs": [
      { "id": "iterator", "type": "range" }
    ],
    "properties": {
      "label": "Loop"
    }
  }
}
```

**Purpose**: Represents loop structures
**Fields**:
- `loop_type`: "for" or "while"
- `inputs`: Loop variables/iterators
- `properties.label`: Display label

### Additional Node Types
- **conditional**: For if/else/switch structures
- **variable**: For variable declarations
- **comment**: For documentation comments

## Edge Types

### Flow Edge
```json
{
  "id": "start-to-pin",
  "source": "start",
  "target": "pin_init",
  "type": "flow",
  "animated": false,
  "data": {
    "label": ""
  }
}
```

**Purpose**: Represents execution flow between nodes

### Data Edge
```json
{
  "id": "range-to-loop",
  "source": "range_node.range_iter",
  "target": "for_loop.iterator",
  "type": "data",
  "animated": false,
  "data": {
    "label": "iterator"
  }
}
```

**Purpose**: Represents data flow between nodes
**Key Feature**: Uses dot notation to reference specific inputs/outputs

## Design Decisions

### 1. Input/Output Management
- **Only connected I/O is declared**: Nodes only declare inputs/outputs that are actually connected via edges
- **Dot notation in edges**: Allows precise data routing (`source_node.output_id` → `target_node.input_id`)
- **Type system**: Supports multiple types (`"int|float"`) for flexibility

### 2. Language Agnostic Design
- **Generic structure**: Can be converted to MicroPython, Python, or other languages
- **Type information**: Preserved for type checking and code generation
- **Modular approach**: Each node type handles a specific programming concept

### 3. Visual Editor Integration
- **Position data**: Maintains visual layout information
- **Properties**: Contains display-specific information
- **Edge animation**: Supports visual feedback

### 4. Extensibility
- **Open-ended type system**: New node types can be added
- **Flexible data structure**: Additional fields can be added as needed
- **Versioning**: Schema version allows for evolution

## Conversion Example: VopFlow to MicroPython

Given the test-blink-vopflow.json example:

```python
# Generated from VopFlow
import machine
import time

led = machine.Pin("LED", machine.Pin.OUT)
for _ in range(20):
    led.toggle()
    time.sleep(0.5)
```

### Conversion Process
1. **Imports**: Collect all import nodes
2. **Execution Order**: Follow flow edges for sequential execution
3. **Variable Management**: Track outputs as variables
4. **Data Flow**: Resolve data edges to pass values
5. **Control Structures**: Convert loop/conditional nodes

## Best Practices

### 1. Node Organization
- Place import nodes at the top
- Use start node as single entry point
- Group related operations visually

### 2. Data Flow
- Use data edges for explicit value passing
- Avoid implicit dependencies
- Document complex data flows with edge labels

### 3. Type Usage
- Be specific with types when possible
- Use union types (`int|float`) for flexibility
- Document expected types in properties

### 4. Extensibility
- Add new node types for complex operations
- Use properties for editor-specific metadata
- Maintain backward compatibility with versioning

## Future Enhancements

1. **Additional Node Types**:
   - Exception handling nodes
   - Async/await support
   - Decorator nodes

2. **Advanced Features**:
   - Type inference system
   - Automatic import management
   - Code optimization passes

3. **Editor Improvements**:
   - Visual type checking
   - Auto-completion for node connections
   - Real-time code preview

## Conclusion

The VopFlow schema version 1.1 provides a powerful, flexible foundation for visual programming that can target multiple platforms while maintaining a clean separation between visual representation and executable logic. The design emphasizes extensibility, type safety, and clear data flow management.
