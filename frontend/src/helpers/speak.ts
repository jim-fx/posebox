const synth = window.speechSynthesis;
export default (sentence) => {
  const audio = new SpeechSynthesisUtterance(sentence);
  audio.lang = "de-DE";
  synth.speak(audio);
};
