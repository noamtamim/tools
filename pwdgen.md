---
title: Pretty Good Password Generator
---

## Password Generator

<script>

	const alnum = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	const punct = '!@#$%^&*-=+';
	const allChars = alnum + punct;
	
	function randomChar(chars) {
	  let buf = new Uint8Array(1);
	  window.crypto.getRandomValues(buf);
	
	  return chars[buf[0] % chars.length];
	}
	
	function gen(size, chars) {
	
	  let pwd;
	
	  while (true) {
	    pwd = '';
	    prevChar = null;
	    while (pwd.length < size) {
	      let c = randomChar(chars);
	      if (c !== prevChar) {
	        pwd += c;
	        prevChar = c;
	      }
	    }

		 if (chars === alnum) {
	 	    if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) {
		      break;
		    }

		 } else {
		    if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[^\w]/.test(pwd)) {
		      break;
		    }
		 }
	  }
	
	  const e = document.getElementById("password");
	  e.value = pwd;
	  e.select();
	  document.execCommand('copy');
	}

</script>

<button onclick="gen(16, allChars)">Letters+Digits+Punctuation (16)</button>
<button onclick="gen(8, allChars)">Letters+Digits+Punctuation (8)</button>
<button onclick="gen(16, alnum)">Letters+Digits (16)</button>
<textarea id="password" rows="1"></textarea>
