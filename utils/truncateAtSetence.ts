export function truncateAtSentence(text: string, maxWords: number) {
  if (!text) return "";

  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;

  const truncated = words.slice(0, maxWords).join(" ");

  const remainingText = text.substring(truncated.length);
  const nextDotIndex = remainingText.indexOf(".");

  if (nextDotIndex === -1) return truncated + "...";

  return truncated + remainingText.substring(0, nextDotIndex + 1);
}
