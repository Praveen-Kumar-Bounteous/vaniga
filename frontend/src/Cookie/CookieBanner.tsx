import { useState, useEffect } from "react";
import { useOneTrust } from "./useOneTrust";
import { PreferenceCenter } from "./PreferenceCenter";
import { X } from "lucide-react";

export const CookieBanner = () => {
    const { consent, isManuallyHidden, setIsManuallyHidden, acceptAll, rejectAll } = useOneTrust();
    const [showModal, setShowModal] = useState(false);

    // LOGIC: Show only if no decision AND not manually hidden
    const shouldShowBanner = !consent.hasDecided && !isManuallyHidden;

    const handleOpenSettings = () => setShowModal(true);

    // ✅ LISTEN TO FOOTER EVENT (THIS WAS MISSING)
    useEffect(() => {
        const openHandler = () => {
            setShowModal(true);
        };

        window.addEventListener("vaniga_open_cookies", openHandler);

        return () => {
            window.removeEventListener("vaniga_open_cookies", openHandler);
        };
    }, []);

    return (
        <>
            {/* BANNER UI */}
            {shouldShowBanner && (
                <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-[450px] z-[9999] animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 relative overflow-hidden">

                        {/* CLOSE BUTTON (Temporary Hide) */}
                        <button
                            onClick={() => setIsManuallyHidden(true)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors p-1"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg italic font-black">V</div>
                                <h3 className="font-black italic uppercase tracking-widest text-slate-900 text-sm">
                                    Privacy Choice
                                </h3>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                We use cookies to improve your experience. Clicking{" "}
                                <span className="text-primary font-bold">"Accept All"</span> helps us provide the best features.
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                    onClick={handleOpenSettings}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border rounded-full hover:bg-slate-50 transition-all"
                                >
                                    Manage
                                </button>
                                <button
                                    onClick={rejectAll}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border rounded-full hover:bg-slate-50 transition-all"
                                >
                                    Reject All
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 bg-slate-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all shadow-lg"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL UI (Independent of Banner) */}
            <PreferenceCenter
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                consent={consent}
                onAcceptAll={() => {
                    acceptAll();
                    setShowModal(false);
                }}
                onRejectAll={() => {
                    rejectAll();
                    setShowModal(false);
                }}
            />
        </>
    );
};