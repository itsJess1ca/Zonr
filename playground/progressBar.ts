export const ProgressBar = (count: number, total: number, widthAvailable: number) => {
  const filledCharacter = '█';
  const emptyCharacter = '░';
  const width = widthAvailable - 5;
  const progress = Math.min(count / total, 1);
  const filled = Math.round(progress * width);
  const empty = width - filled;
  return `${filledCharacter.repeat(filled)}${emptyCharacter.repeat(empty)} ${Math.round(progress * 100)}%`;
}