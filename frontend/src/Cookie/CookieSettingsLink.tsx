export const CookieSettingsLink = () => {
  const handleOpen = () => {
    // Triggers the custom hook to show our banner/modal
    window.dispatchEvent(new CustomEvent("vaniga_open_cookies"));
  };

  return (
    <button 
      onClick={handleOpen}
      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors underline underline-offset-4"
    >
      Cookie Settings
    </button>
  );
};