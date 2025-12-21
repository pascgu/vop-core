/**
 * JsCsBridge utility class for handling communication between JavaScript and C#.
 */
declare global {
  interface Window {
    HybridWebView: {
      Init: () => void;
      SendRawMessage: (message: string) => void;
      InvokeDotNet: (methodName: string, paramValues: any[]) => Promise<any>;
    };
  }
}

class JsCsBridge {
  private static instance: JsCsBridge;

  private constructor() {
    // Private constructor to prevent direct instantiation
    if (window.HybridWebView) {
      window.HybridWebView.Init();
    }
  }

  public static getInstance(): JsCsBridge {
    if (!JsCsBridge.instance) {
      JsCsBridge.instance = new JsCsBridge();
    }
    return JsCsBridge.instance;
  }

  public isBridgeAvailable(): boolean {
    return !!window.HybridWebView;
  }

  public invokeMethodAsync(assemblyName: string, methodName: string, ...args: any[]): Promise<any> {
    if (!this.isBridgeAvailable()) {
      console.warn('Bridge is not available. Falling back to console.log.');
      return Promise.resolve(console.log(`Fallback: ${methodName}`, ...args));
    }

    return window.HybridWebView.InvokeDotNet(methodName, args);
  }
}

export default JsCsBridge;
