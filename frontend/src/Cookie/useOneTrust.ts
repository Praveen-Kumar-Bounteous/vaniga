import { useState, useEffect, useCallback } from "react";
import type { ConsentState } from "@/types/onetrust";

declare global {
  interface Window {
    OneTrust: any;
    OnetrustActiveGroups: string;
    OptanonWrapper: () => void;
  }
}

export const useOneTrust = () => {
  const [consent, setConsent] = useState<ConsentState>({
    hasDecided: false,
    strictlyNecessary: true,
    performance: false,
    functional: false,
    targeting: false,
  });

  // This tracks if the user clicked "X" in this specific page view
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);

  const syncWithSDK = useCallback(() => {
    if (typeof window.OnetrustActiveGroups === "string") {
      const active = window.OnetrustActiveGroups;
      // OneTrust sets this cookie when Accept/Reject/Save is clicked
      const decided = document.cookie.includes("OptanonAlertBoxClosed");
      
      setConsent({
        hasDecided: decided,
        strictlyNecessary: true,
        performance: active.includes("C0002"),
        functional: active.includes("C0003"),
        targeting: active.includes("C0004"),
      });
    }
  }, []);

  useEffect(() => {
    window.OptanonWrapper = () => syncWithSDK();
    syncWithSDK();

    // Listen for footer clicks
    const handleOpen = () => {
      setIsManuallyHidden(false); // Reset temp hide
      syncWithSDK();
    };
    window.addEventListener("vaniga_open_cookies", handleOpen);
    return () => window.removeEventListener("vaniga_open_cookies", handleOpen);
  }, [syncWithSDK]);

  const acceptAll = () => {
    window.OneTrust?.AllowAll(); // Native OneTrust call
    // No need to set state, OptanonWrapper will trigger syncWithSDK
  };

  const rejectAll = () => {
    window.OneTrust?.RejectAll(); // Native OneTrust call
  };

  return { 
    consent, 
    isManuallyHidden, 
    setIsManuallyHidden, 
    acceptAll, 
    rejectAll 
  };
};