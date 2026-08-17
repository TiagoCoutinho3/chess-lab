import React, { useEffect, useState } from 'react';

interface BotSpeechBubbleProps {
  message: string | null;
  visible: boolean;
  onHide?: () => void;
  durationMs?: number;
  variant?: 'floating' | 'inline';
}

export const BotSpeechBubble: React.FC<BotSpeechBubbleProps> = ({
  message,
  visible,
  onHide,
  durationMs = 4000,
  variant = 'floating',
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide?.();
      }, durationMs);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [visible, message, durationMs, onHide]);

  if (!show || !message) return null;

  if (variant === 'inline') {
    return (
      <div className="mt-2.5 animate-fadeIn">
        <div className="relative bg-[#F7F9FC] border border-[#8AA7E1]/30 rounded-2xl px-3.5 py-2.5 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute -bottom-1 left-14 right-0 z-10 animate-fadeIn">
      <div className="relative bg-white border border-[#DDE3EA] rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-md max-w-[280px]">
        <p className="text-xs text-slate-700 leading-relaxed font-medium">{message}</p>
        <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white border-l border-t border-[#DDE3EA] rotate-45" />
      </div>
    </div>
  );
};
