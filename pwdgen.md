---
title: Pretty Good Password Generator
---


<button onclick="gen()">Gen</button>
<textarea id="password"></textarea>
<script>
	function gen() {
		let buf=new Uint8Array(16);
		const chars='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let pwd;

		while (true) {

			window.crypto.getRandomValues(buf);

			pwd='';
			for (b of buf) {
				pwd += chars[b % chars.length]; 
			}

			// \d.*[A-Z].*[a-z]
			if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) {
				break;
			}

			console.log(pwd);
		}

		const e = document.getElementById("password");
		e.value = pwd;
		e.select();
		document.execCommand('copy');
	}
</script>

