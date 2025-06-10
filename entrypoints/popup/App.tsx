import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [scrapeResult, setScrapeResult] = useState<string>();
  const [copyStatus, setCopyStatus] = useState({
    message: "",
    isSuccess: false,
  });
  const [thumbnail, setThumbnail] = useState<string>();

  useEffect(() => {
    async function loadData() {
      const [savedResult, savedThumbnail] = await Promise.all([
        storage.getItem<string>("local:scrapeResult"),
        storage.getItem<string>("local:thumbnail"),
      ]);

      if (savedResult) setScrapeResult(savedResult);
      if (savedThumbnail) setThumbnail(savedThumbnail);
    }

    loadData();
  }, []);

  async function copyToClipboard(text?: string) {
    if (!text) {
      console.warn("No text provided to copy");
      return false;
    }

    let success = false;

    try {
      // Using the Clipboard API (modern browsers)
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
      // Fallback for older browsers
      else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();

        const result = document.execCommand("copy");
        document.body.removeChild(textarea);

        success = result;
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      success = false;
    }

    setCopyStatus({
      message: success ? "Copiado" : "Falha ao copiar",
      isSuccess: success,
    });

    return success;
  }

  return (
    <>
      <div className="card">
        {thumbnail && <img style={{ width: "80%" }} src={thumbnail ?? ""} />}
        <textarea value={scrapeResult} />
        <div>
          <button onClick={() => copyToClipboard(scrapeResult)}>copiar</button>
          <p style={{ color: copyStatus.isSuccess ? "green" : "red" }}>
            {copyStatus.message}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
