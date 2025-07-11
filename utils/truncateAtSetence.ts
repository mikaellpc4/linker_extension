export function truncateAtSentence(text: string, maxWords: number) {
  if (!text) return "";

  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;

  const truncatedWords = words.slice(0, maxWords);
  const truncated = truncatedWords.join(" ");

  const indexOfTruncated = text.indexOf(
    truncatedWords[truncatedWords.length - 1],
  );
  const afterTruncated = text.slice(
    indexOfTruncated + truncatedWords[truncatedWords.length - 1].length,
  );

  const nextDotIndex = afterTruncated.indexOf(".");

  if (nextDotIndex === -1) return truncated + "...";

  return truncated + afterTruncated.slice(0, nextDotIndex + 1);
}
