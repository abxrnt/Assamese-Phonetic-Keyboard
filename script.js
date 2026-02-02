const textArea = document.getElementById('textArea');

// Always keep textarea focused
function keepFocus(){ textArea.focus(); }
textArea.focus();
document.addEventListener('click', keepFocus);
document.addEventListener('keydown', keepFocus);
window.addEventListener('focus', keepFocus);

// Keyboard data
const numbers = {
    '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫',
    '6':'৬','7':'৭','8':'৮','9':'৯','space':' '
};

const consonants = {
  'k':'ক','K':'খ','g':'গ','G':'ঘ','NG':'ঙ',
  'c':'চ','C':'ছ','j':'জ','J':'ঝ','Y':'ঞ',
  't':'ট','T':'ঠ','d':'ড','D':'ঢ','n':'ণ',
  't':'ত','th':'থ','d':'দ','dh':'ধ','n':'ন',
  'p':'প','f':'ফ','b':'ব','v':'ভ','m':'ম',
  'z':'য','r':'ৰ','l':'ল','w':'ৱ',
  's':'শ','S':'ষ','x':'স','h':'হ',
  'X':'ক্ষ','R':'ড়','Rh':'ঢ়','y':'য়',
  'Tto':'ৎ','ng':'ং',':':'ঃ','~':'ঁ'
};

const symbols = {
    '.':'।','-':'্',',':',','?':'?','!':'!','%':'%','@':'@','#':'#','(':'(',')':')','{':'{','}':'}'
};

// Updated vowel key map as per your mapping
const vowelKeyMap = {
    'A':'অ','AA':'আ','I':'ই','II':'ঈ','U':'উ','UU':'ঊ','RH':'ঋ',
    'E':'এ','EE':'ঐ','O':'ও','OO':'ঔ',
    'a':'া','i':'ি','ii':'ী','u':'ু','uu':'ূ','rh':'ৃ',
    'e':'ে','ee':'ৈ','o':'ো','oo':'ৌ'
};

// Insert text at cursor
function insertAtCursor(text){
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const before = textArea.value.substring(0,start);
    const after = textArea.value.substring(end);
    textArea.value = before + text + after;
    textArea.selectionStart = textArea.selectionEnd = start + text.length;
    textArea.focus();
}

// Create keys
function createKeys(container, map){
    const element = document.getElementById(container);
    for(const [eng, asm] of Object.entries(map)){
        const button = document.createElement('div');
        button.className = 'key';

        if(eng === 'space'){
            button.style.width = '120px';
            button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="10" width="20" height="4" rx="1" ry="1"></rect>
            </svg>`;
        } else {
            // Display the key label
            let displayKey = eng.length <= 2 ? eng : eng; // keep AA, II, UU etc.
            button.innerHTML = `<span class="english">${displayKey}</span>${asm}`;
        }

        button.addEventListener('click', ()=>insertAtCursor(asm));
        element.appendChild(button);
    }
}

// Consonants in two rows
const consonantsKeys = Object.entries(consonants);
const mid = Math.ceil(consonantsKeys.length / 2);

function createKeysInRow(containerId, keysArray){
    const element = document.getElementById(containerId);
    for(const [eng, asm] of keysArray){
        const button = document.createElement('div');
        button.className = 'key';

        let displayKey =
          (eng.length === 1 && eng === eng.toUpperCase() && /[A-Z]/.test(eng))
          ? `Shift+${eng.toLowerCase()}`
          : eng;

        button.innerHTML = `<span class="english">${displayKey}</span>${asm}`;
        button.addEventListener('click',()=>insertAtCursor(asm));
        element.appendChild(button);
    }
}

// Initialize keyboards
createKeys('numbers', numbers);
createKeys('symbols', symbols);
createKeys('vowels', vowelKeyMap);
createKeysInRow('consonants-row1', consonantsKeys.slice(0, mid));
createKeysInRow('consonants-row2', consonantsKeys.slice(mid));

// Virtual key press effect
function pressVirtualKey(key){
    const allKeys = document.querySelectorAll('.key');
    for(const vk of allKeys){
        const eng = vk.querySelector('.english')?.textContent || '';
        const asm = vk.textContent.replace(eng,'');

        let match = false;
        if(key.startsWith('Alt+')) match = eng === key;
        else if(key === ' ' || key === 'Spacebar') match = vk.querySelector('svg') !== null;
        else match = eng === key || asm === key;

        if(match){
            vk.classList.add('pressed');
            setTimeout(()=>vk.classList.remove('pressed'),150);
        }
    }
}

// Key press tracking
textArea.addEventListener('keydown', (e) => {
    e.preventDefault();

    let key = e.key;
    if (e.altKey) key = 'Alt+' + key;
    if (e.shiftKey && !e.altKey) key = key.toUpperCase();

    pressVirtualKey(key);

    // ENTER
    if (key === 'Enter') { insertAtCursor('\n'); return; }

    // TAB
    if (key === 'Tab') { insertAtCursor('    '); return; }

    // Combine keys for double letters like AA, II, UU etc.
    let combinedKey = key;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const prevChar = textArea.value[start - 1] || '';

    // Handle double key presses for independent vowels
    if ((key.toUpperCase() === 'A' && prevChar === 'অ')) { combinedKey = 'AA'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toUpperCase() === 'I' && prevChar === 'ই')) { combinedKey = 'II'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toUpperCase() === 'U' && prevChar === 'উ')) { combinedKey = 'UU'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toUpperCase() === 'E' && prevChar === 'এ')) { combinedKey = 'EE'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toUpperCase() === 'O' && prevChar === 'ও')) { combinedKey = 'OO'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toLowerCase() === 'i' && prevChar === 'ি')) { combinedKey = 'ii'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toLowerCase() === 'u' && prevChar === 'ু')) { combinedKey = 'uu'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toLowerCase() === 'e' && prevChar === 'ে')) { combinedKey = 'ee'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toLowerCase() === 'o' && prevChar === 'ো')) { combinedKey = 'oo'; textArea.value = textArea.value.slice(0, start -1); }
    if ((key.toLowerCase() === 'r' && prevChar === 'ৃ')) { combinedKey = 'rh'; textArea.value = textArea.value.slice(0, start -1); }

    const allKeys = {...numbers, ...consonants, ...symbols, ...vowelKeyMap};
    if (allKeys[combinedKey]) insertAtCursor(allKeys[combinedKey]);
    else if (key === ' ' || key === 'Spacebar') insertAtCursor(' ');
    else if (key === 'Backspace') {
        if (start === end && start > 0) {
            textArea.value =
                textArea.value.slice(0, start - 1) + textArea.value.slice(end);
            textArea.selectionStart = textArea.selectionEnd = start - 1;
        } else {
            textArea.value =
                textArea.value.slice(0, start) + textArea.value.slice(end);
            textArea.selectionStart = textArea.selectionEnd = start;
        }
    }
    else if (key === 'Delete') {
        if (start === end && start < textArea.value.length) {
            textArea.value =
                textArea.value.slice(0, start) + textArea.value.slice(start + 1);
            textArea.selectionStart = textArea.selectionEnd = start;
        } else {
            textArea.value =
                textArea.value.slice(0, start) + textArea.value.slice(end);
            textArea.selectionStart = textArea.selectionEnd = start;
        }
    }
});

// Control buttons
document.getElementById('copyBtn')
  .addEventListener('click',()=>{ textArea.select(); document.execCommand('copy'); alert('Text copied!'); });

document.getElementById('exportTxtBtn')
  .addEventListener('click',()=>{
    const blob = new Blob([textArea.value],{type:'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'text.txt';
    link.click();
});

document.getElementById('exportDocsBtn')
  .addEventListener('click',()=>{
    const blob = new Blob([textArea.value],{type:'application/msword'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.doc';
    link.click();
});

document.getElementById('shareBtn')
  .addEventListener('click',()=>{ if(navigator.share) navigator.share({text:textArea.value}); else alert('Share not supported.'); });

document.getElementById('fullscreenBtn')
  .addEventListener('click',()=>{ if(!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); });

document.getElementById('toggleEnglishBtn')
  .addEventListener('click',()=>{ document.body.classList.toggle('hide-english'); });
