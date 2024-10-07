export const playSound = (url) => {
  const audio = new Audio(url);
  audio.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
};
