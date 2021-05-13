const _SpeechRecognition: typeof SpeechRecognition =
  //@ts-ignore;
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default (cb: (res: string, isFinal: boolean) => void) => {
  const recognition = new _SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "de-DE";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.start();

  let index = 0;
  recognition.onresult = function (event) {
    const result = event.results[index];

    if (result.isFinal) {
      index++;
    }

    cb(result[0].transcript, result.isFinal);
  };

  return {
    stop() {},
  };
};
