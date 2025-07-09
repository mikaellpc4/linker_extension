type AffiliateButtonProps = {
  scrapeSite: () => Promise<{ text: string; thumbnail: string }>;
  buttonClassName: string;
  labelClassName: string;
};

export const AffiliateButton = ({
  scrapeSite,
  buttonClassName,
  labelClassName,
}: AffiliateButtonProps) => {
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    text: string;
    thumbnail: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    text: "",
    thumbnail: "",
    isLoading: false,
  });

  const handleClick = async () => {
    setModalData({
      isOpen: false,
      text: "",
      thumbnail: "",
      isLoading: true,
    });
    const { text, thumbnail } = await scrapeSite();
    setModalData({ isOpen: true, text, thumbnail, isLoading: false });
  };

  return (
    <>
      <button
        type="button"
        className={`${buttonClassName} relative`}
        onClick={handleClick}
      >
        <span className="w-5 absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
          </svg>
        </span>
        {modalData.isLoading ? (
          <svg
            width="24"
            height="24"
            stroke="#000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>
              {`
                .spinner_V8m1 {
                  transform-origin: center;
                  animation: spinner_zKoa 2s linear infinite;
                }
                .spinner_V8m1 circle {
                  stroke-linecap: round;
                  animation: spinner_YpZS 1.5s ease-in-out infinite;
                }
                @keyframes spinner_zKoa {
                  100% {
                    transform: rotate(360deg);
                  }
                }
                @keyframes spinner_YpZS {
                  0% {
                    stroke-dasharray: 0 150;
                    stroke-dashoffset: 0;
                  }
                  47.5% {
                    stroke-dasharray: 42 150;
                    stroke-dashoffset: -16;
                  }
                  95%, 100% {
                    stroke-dasharray: 42 150;
                    stroke-dashoffset: -59;
                  }
                }
              `}
            </style>
            <g className="spinner_V8m1">
              <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" />
            </g>
          </svg>
        ) : (
          <label className={`${labelClassName} cursor-pointer`}>
            Gerar Afiliado
          </label>
        )}
      </button>
      <ScrapeModal
        isOpen={modalData.isOpen}
        text={modalData.text}
        thumbnail={modalData.thumbnail}
        close={() => setModalData({ ...modalData, isOpen: false })}
      />
    </>
  );
};
