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
  sendCodeToDevice(code: string): void;

  /**
   * Receives data from the device.
   *
   * @param data - The data received from the device.
   */
  receiveDataFromDevice(data: any): void;

  // Add other necessary methods here
}
