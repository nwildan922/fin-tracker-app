import { NativeBiometric } from "@capgo/capacitor-native-biometric";

export async function tryBiometric(): Promise<boolean> {
  try {
    const { isAvailable } = await NativeBiometric.isAvailable();
    if (!isAvailable) return false;

    await NativeBiometric.verifyIdentity({
      reason: "Unlock with biometrics",
      title: "Biometric Authentication",
      subtitle: "Touch the sensor",
      description: "",
      negativeButtonText: "Use PIN",
      // optional:
      // useFallback: false,
      // maxAttempts: 5,
    });

    // If we got here, verification succeeded
    return true;
  } catch (e: any) {
    // Common cancellation codes vary by platform; treat all as "not verified"
    // e.code could be 'Canceled', 'UserCancel', etc.
    // You can inspect e to handle specific cases if you want.
    console.warn("Biometric verify failed:", e?.code || e?.message || e);
    return false;
  }
}
