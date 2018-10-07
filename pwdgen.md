---
title: Pretty Good Password Generator
---

<button onclick="gen()">Gen</button>
<button onclick="gen(8)">Gen8</button>
<textarea id="password"></textarea>
<script>

function randomChar() {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-=+';
  let buf = new Uint8Array(1);
  window.crypto.getRandomValues(buf);

  return chars[buf[0] % chars.length];
}

function gen(size) {

  if (!size) {
    size = 16;
  }
  let pwd;

  while (true) {
    pwd = '';
    prevChar = null;
    while (pwd.length < size) {
      let c = randomChar();
      if (c !== prevChar) {
        pwd += c;
        prevChar = c;
      }
    }

    if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[^\w]/.test(pwd)) {
      break;
    }
  }

  const e = document.getElementById("password");
  e.value = pwd;
  e.select();
  document.execCommand('copy');
}

</script>
