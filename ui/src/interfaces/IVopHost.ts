import { VopFlow } from '../interfaces/VopFlowTypes';

export type LogMessageType = 'error' | 'warning' | 'code';

/**
 * IVopHost Interface
 *
 * This interface defines the methods that native hosts need to implement
 * to communicate with the VoP core application.
 */
export interface IVopHost {
  /**
   * Sends code to the device.
   *
   * @param code - The code to be sent to the device.
   */
  sendCodeToDevice(code: string): Promise<void>;

  /**
   * Receives data from the device.
   *
   * @param data - The data received from the device.
   */
  receiveDataFromDevice(data: string, type: LogMessageType): Promise<void>;

  /**
   * Loads a VopFlow from data.
   *
   * @param VopFlowData - The VopFlow data to load.
   */
  onLoadingVopFlow(vopFlowJson: string): Promise<VopFlow>;

  /**
   * Saves the current VopFlow.
   */
  onSavingVopFlow(vopFlow: VopFlow): Promise<string>;

  /**
   * Executes the current VopFlow.
   */
  executeVopFlow(): Promise<void>;

  /**
   * Handles node execution start event.
   *
   * @param nodeId - The ID of the node that started execution.
   */
  onNodeExecutionStart(nodeId: string): Promise<void>;

  /**
   * Handles node execution end event.
   *
   * @param nodeId - The ID of the node that ended execution.
   */
  onNodeExecutionEnd(nodeId: string): Promise<void>;

  /**
   * Handles errors during VopFlow execution.
   *
   * @param error - The error that occurred.
   */
  onVopFlowExecutionError(error: any): Promise<void>;

  /**
   * Sends a raw message to the device.
   *
   * @param message - The raw message to send.
   */
  onRawMessageReceived(message: string): Promise<void>;

  /**
   * Gets the device status.
   */
  getDeviceStatus(): Promise<any>;

  /**
   * Test the CS<=>JS bridge.
   */
  JSeval(): Promise<void>;
  JSinvoke(): Promise<void>;
  JSraw(): Promise<void>;
  CSraw(): void;

  /**
   * Lists available serial ports.
   */
  listSerialPorts(): Promise<string[]>;

  /**
   * Selects a serial port.
   *
   * @param portName - The name of the serial port to select.
   */
  selectSerialPort(portName: string): Promise<string>;

  /**
   * Quits the application.
   */
  quitApplication(): Promise<void>;
}
