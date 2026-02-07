alert("Wait for the alert to close, Click ok");

console.log("Hello Javascript");
window.console.log("Hello2");

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('text-form');
	const input = document.getElementById('textInput');
	const result = document.getElementById('result');

	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const value = input ? input.value : '';
		if (result) result.textContent = 'Sending...';
		try {
			const resp = await fetch('/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: value })
			});

			if (!resp.ok) {
				const txt = await resp.text();
				if (result) result.textContent = `Error ${resp.status}: ${txt}`;
				return;
			}

			// Try parse JSON, fallback to text
			let parsed = null;
			try { parsed = await resp.json(); } catch (_) { /* ignore */ }

			if (parsed) {
				// Display common fields if present
				const out = parsed.result ?? parsed.text ?? parsed.output ?? JSON.stringify(parsed);
				if (result) result.textContent = out;
			} else {
				const text = await resp.text();
				if (result) result.textContent = text || 'No response body';
			}
		} catch (err) {
			if (result) result.textContent = 'Request failed: ' + (err && err.message ? err.message : err);
		}
	});
});