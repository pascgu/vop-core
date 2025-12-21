/**
 * BridgeConfig utility class for managing bridge configurations.
 */
class BridgeConfig {
  private static instance: BridgeConfig;
  private methodRegistry: Map<string, string>;

  private constructor() {
    this.methodRegistry = new Map<string, string>();
  }

  public static getInstance(): BridgeConfig {
    if (!BridgeConfig.instance) {
      BridgeConfig.instance = new BridgeConfig();
    }
    return BridgeConfig.instance;
  }

  public registerMethod(methodName: string, assemblyName: string): void {
    this.methodRegistry.set(methodName, assemblyName);
  }

  public getAssemblyName(methodName: string): string | undefined {
    return this.methodRegistry.get(methodName);
  }
}

export default BridgeConfig;
