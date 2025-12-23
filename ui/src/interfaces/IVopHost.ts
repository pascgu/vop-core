import { Workflow } from '../interfaces/WorkflowTypes';

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
  receiveDataFromDevice(data: any): Promise<void>;

  /**
   * Loads a workflow from data.
   *
   * @param workflowData - The workflow data to load.
   */
  loadWorkflow(workflowData: Workflow): Promise<void>;

  /**
   * Saves the current workflow.
   */
  saveWorkflow(): Promise<void>;

  /**
   * Executes the current workflow.
   */
  executeWorkflow(): Promise<void>;

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
   * Handles errors during workflow execution.
   *
   * @param error - The error that occurred.
   */
  onWorkflowExecutionError(error: any): Promise<void>;

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
  checkCS2JS(): Promise<any>;
}
