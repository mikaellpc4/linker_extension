import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type ScrapeModalProps = {
  isOpen: boolean;
  close: () => void;
  text: string;
  thumbnail?: string;
};

export function ScrapeModal({
  isOpen,
  close,
  text,
  thumbnail,
}: ScrapeModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-[999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <div className="w-1/3 px-4 py-6 h-[60%] bg-gray-100 !ring-1 !ring-black/50 rounded-xl flex flex-col items-center gap-4 relative">
        <button
          onClick={close}
          className="absolute right-2 top-2 w-4 cursor-pointer"
          aria-label="Fechar"
        >
          <svg
            viewBox="0 0 384 512"
            width="100%"
            height="100%"
            fill="currentColor"
          >
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 
          86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 
          41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 
          297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 
          342.6 150.6z"
            />
          </svg>
        </button>

        {thumbnail && (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-auto h-1/3 rounded-lg"
          />
        )}

        <textarea
          defaultValue={text}
          className="w-full h-2/3 mb-2 resize-none focus:!outline-none !ring-1 !ring-gray-400 focus:!ring-1 focus:!ring-blue-400 rounded-md !p-2 !text-sm"
        />

        <button
          onClick={handleCopy}
          className="cursor-pointer w-full flex justify-center items-center gap-2 font-medium text-sm !bg-green-400 relative h-10 text-md uppercase rounded-md"
        >
          <svg
            viewBox="0 0 448 512"
            width="20"
            height="20"
            fill="currentColor"
            className="absolute left-10"
          >
            <path
              d="M320 448v40c0 13.255-10.745 24-24 
            24H24c-13.255 0-24-10.745-24-24V120c0-13.255 
            10.745-24 24-24h72v296c0 30.879 25.121 56 
            56 56h168zm0-344V0H152c-13.255 0-24 
            10.745-24 24v368c0 13.255 10.745 24 
            24 24h272c13.255 0 24-10.745 
            24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 
            7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 
            24 0 0 0-7.029-16.97z"
            />
          </svg>
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
