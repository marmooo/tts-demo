let allVoices = [];
loadConfig();
loadVoices();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise(function (resolve) {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", function () {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    allVoices = voices;
    addLangRadioBox();
  });
}

function showVoiceInfo(voice) {
  document.getElementById("voiceDefault").textContent = voice.default;
  document.getElementById("voiceLocalService").textContent = voice.localService;
  document.getElementById("voiceName").textContent = voice.name;
  document.getElementById("voiceURI").textContent = voice.voiceURI;
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById("langRadio").lang.value;
  const voices = allVoices.filter((voice) => voice.lang == lang);
  const voice = voices[Math.floor(Math.random() * voices.length)];
  showVoiceInfo(voice);
  msg.voice = voice;
  msg.lang = document.getElementById("langRadio").lang.value;
  msg.pitch = document.getElementById("pitch").value;
  msg.rate = document.getElementById("rate").value;
  msg.volume = document.getElementById("volume").value;
  speechSynthesis.speak(msg);
  return msg;
}

function addLangRadioBox() {
  const radio = document.getElementById("langRadio");
  allVoices.sort((a, b) => {
    if (a.lang < b.lang) return -1;
    if (a.lang > b.lang) return 1;
    return 0;
  }).forEach((voice, i) => {
    const div = document.createElement("div");
    div.className = "form-check form-check-inline";
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.name = "lang";
    input.type = "radio";
    input.id = "radio" + i;
    input.value = voice.lang;
    const label = document.createElement("label");
    label.className = "from-check-label";
    label.for = "radio" + i;
    label.textContent = voice.lang;
    div.appendChild(input);
    div.appendChild(label);
    radio.appendChild(div);
    if (voice.lang == "en-US" || voice.lang == "en_US") {
      input.checked = true;
    }
  });
}

function resetPitch() {
  document.getElementById("pitch").value = 1;
}

function resetRate() {
  document.getElementById("rate").value = 1;
}

function resetVolume() {
  document.getElementById("volume").value = 1;
}

function search() {
  const text = document.getElementById("searchText").value;
  speak(text);
}

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") search();
}, false);
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("search").onclick = search;
document.getElementById("resetPitch").onclick = resetPitch;
document.getElementById("resetRate").onclick = resetRate;
document.getElementById("resetVolume").onclick = resetVolume;
