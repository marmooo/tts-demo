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
    addVoiceSelect();
  });
}

function showVoiceInfo(voice) {
  document.getElementById("voiceLang").textContent = voice.lang;
  document.getElementById("voiceDefault").textContent = voice.default;
  document.getElementById("voiceLocalService").textContent = voice.localService;
  document.getElementById("voiceName").textContent = voice.name;
  document.getElementById("voiceURI").textContent = voice.voiceURI;
}

function selectVoice(allVoices, lang) {
  const voiceOptions = document.getElementById("selectVoice").options;
  const voiceName = voiceOptions[voiceOptions.selectedIndex].value;
  switch (voiceOptions.selectedIndex) {
    case 0:
      return allVoices[Math.floor(Math.random() * allVoices.length)];
    case 1: {
      const langVoices = allVoices.filter((voice) => voice.lang == lang);
      return langVoices[Math.floor(Math.random() * langVoices.length)];
    }
    default: {
      const langVoices = allVoices.filter((voice) => voice.lang == lang);
      return langVoices.find((voice) => voice.name == voiceName);
    }
  }
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById("langRadio").lang.value;
  const voice = selectVoice(allVoices, lang);
  showVoiceInfo(voice);
  msg.voice = voice;
  msg.lang = document.getElementById("langRadio").lang.value;
  msg.pitch = document.getElementById("pitch").value;
  msg.rate = document.getElementById("rate").value;
  msg.volume = document.getElementById("volume").value;
  speechSynthesis.speak(msg);
  return msg;
}

function initVoiceSelect() {
  const select = document.getElementById("selectVoice");
  select.replaceChildren();
  const option1 = document.createElement("option");
  option1.textContent = "random (all languages)";
  select.appendChild(option1);
  const option2 = document.createElement("option");
  option2.textContent = "random (selected language)";
  select.appendChild(option2);
}

function addVoiceSelect() {
  initVoiceSelect();
  const select = document.getElementById("selectVoice");
  allVoices.filter((voice) => voice.lang == "en-US").forEach((voice) => {
    const option = document.createElement("option");
    option.textContent = voice.name;
    select.appendChild(option);
  });
  select.onchange = () => {
    const lang = document.getElementById("langRadio").lang.value;
    allVoices.filter((voice) => voice.lang == lang).forEach((voice) => {
      showVoiceInfo(voice);
    });
  };
}

function addLangRadioBox() {
  const radio = document.getElementById("langRadio");
  const langs = allVoices.map((voice) => voice.lang);
  const uniqueLangs = [...new Set(langs)];
  uniqueLangs.sort().forEach((lang, i) => {
    const div = document.createElement("div");
    div.className = "form-check form-check-inline";
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.name = "lang";
    input.type = "radio";
    input.id = "radio" + i;
    input.value = lang;
    const label = document.createElement("label");
    label.className = "from-check-label";
    label.for = "radio" + i;
    label.textContent = lang;
    div.appendChild(input);
    div.appendChild(label);
    radio.appendChild(div);
    if (lang == "en-US" || lang == "en_US") {
      input.checked = true;
    }
  });
  radio.onchange = () => {
    const lang = radio.lang.value;
    initVoiceSelect();
    const select = document.getElementById("selectVoice");
    allVoices.filter((voice) => voice.lang == lang).forEach((voice) => {
      const option = document.createElement("option");
      option.textContent = voice.name;
      select.appendChild(option);
    });
  };
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
