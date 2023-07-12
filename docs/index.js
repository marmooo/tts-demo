let allVoices=[];loadConfig(),loadVoices();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function loadVoices(){const a=new Promise(function(b){let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",function(){c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{allVoices=a,addLangRadioBox(),addVoiceSelect()})}function showVoiceInfo(a){document.getElementById("voiceLang").textContent=a.lang,document.getElementById("voiceDefault").textContent=a.default,document.getElementById("voiceLocalService").textContent=a.localService,document.getElementById("voiceName").textContent=a.name,document.getElementById("voiceURI").textContent=a.voiceURI}function selectVoice(a,c){const b=document.getElementById("selectVoice").options,d=b[b.selectedIndex].value;switch(b.selectedIndex){case 0:return a[Math.floor(Math.random()*a.length)];case 1:{const b=a.filter(a=>a.lang==c);return b[Math.floor(Math.random()*b.length)]}default:{const b=a.filter(a=>a.lang==c);return b.find(a=>a.name==d)}}}function speak(c){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(c),d=document.getElementById("langRadio").elements.lang.value,b=selectVoice(allVoices,d);return showVoiceInfo(b),a.voice=b,a.lang=document.getElementById("langRadio").elements.lang.value,a.pitch=document.getElementById("pitch").value,a.rate=document.getElementById("rate").value,a.volume=document.getElementById("volume").value,speechSynthesis.speak(a),a}function initVoiceSelect(){const a=document.getElementById("selectVoice");a.replaceChildren();const b=document.createElement("option");b.textContent="random (all languages)",a.appendChild(b);const c=document.createElement("option");c.textContent="random (selected language)",a.appendChild(c)}function addVoiceSelect(){initVoiceSelect();const a=document.getElementById("selectVoice");allVoices.filter(a=>a.lang=="en-US").forEach(c=>{const b=document.createElement("option");b.textContent=c.name,a.appendChild(b)}),a.onchange=()=>{const a=document.getElementById("langRadio").elements.lang.value;allVoices.filter(b=>b.lang==a).forEach(a=>{showVoiceInfo(a)})}}function addLangRadioBox(){const a=document.getElementById("langRadio");a.replaceChildren();const b=allVoices.map(a=>a.lang),c=[...new Set(b)];c.sort().forEach(c=>{const e=document.createElement("div");e.className="form-check form-check-inline";const b=document.createElement("input");b.className="form-check-input",b.name="lang",b.type="radio",b.value=c;const d=document.createElement("label");d.className="from-check-label",d.textContent=c,d.appendChild(b),e.appendChild(d),a.appendChild(e),(c=="en-US"||c=="en_US")&&(b.checked=!0)}),a.onchange=()=>{const b=a.elements.lang.value;initVoiceSelect();const c=document.getElementById("selectVoice");allVoices.filter(a=>a.lang==b).forEach(b=>{const a=document.createElement("option");a.textContent=b.name,c.appendChild(a)})}}function resetPitch(){document.getElementById("pitch").value=1}function resetRate(){document.getElementById("rate").value=1}function resetVolume(){document.getElementById("volume").value=1}function search(){const a=document.getElementById("searchText").value;speak(a)}document.addEventListener("keydown",function(a){a.key=="Enter"&&search()},!1),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("search").onclick=search,document.getElementById("resetPitch").onclick=resetPitch,document.getElementById("resetRate").onclick=resetRate,document.getElementById("resetVolume").onclick=resetVolume