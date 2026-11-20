// Margin notes, in the manner of Asterisk Magazine.
//
// Hugo renders Markdown footnotes as <sup><a class="footnote-ref" href="#fn:N">
// in the text and a <div class="footnotes"> list at the end. On wide screens
// each note is copied into the right margin, level with its reference and
// pushed down as needed so notes never overlap. On narrow screens tapping a
// reference opens the note in a box below the paragraph.
(function () {
	const WIDE = window.matchMedia("(min-width: 1200px)");
	const GAP = 12; // minimum vertical space between consecutive margin notes, px

	function init() {
		const list = document.querySelector(".footnotes");
		const body = document.querySelector('[itemprop="articleBody"]');
		if (!list || !body) return;
		const section = body.closest("section") || body.parentElement;
		section.classList.add("has-sidenotes");

		const refs = [...body.querySelectorAll("a.footnote-ref")];
		const notes = refs.map(ref => {
			const id = decodeURIComponent(ref.hash.slice(1));
			const item = document.getElementById(id);
			if (!item) return null;
			const aside = document.createElement("aside");
			aside.className = "sidenote";
			aside.setAttribute("role", "note");
			aside.innerHTML = item.innerHTML;
			aside.querySelectorAll(".footnote-backref").forEach(a => a.remove());
			const num = document.createElement("span");
			num.className = "sidenote-number";
			num.textContent = ref.textContent;
			const first = aside.querySelector("p") || aside;
			first.prepend(num);
			section.appendChild(aside);
			return { ref, aside, open: null };
		}).filter(Boolean);

		function layout() {
			const wide = WIDE.matches;
			section.classList.toggle("sidenotes-wide", wide);
			if (!wide) return;
			const top0 = section.getBoundingClientRect().top;
			let floor = 0;
			notes.forEach(({ ref, aside }) => {
				let y = ref.getBoundingClientRect().top - top0;
				y = Math.max(y, floor);
				aside.style.top = y + "px";
				floor = y + aside.offsetHeight + GAP;
			});
		}

		// Narrow screens: tap a reference to toggle the note below its paragraph.
		notes.forEach(note => {
			note.ref.addEventListener("click", e => {
				if (WIDE.matches) {
					e.preventDefault();
					note.aside.classList.remove("flash");
					void note.aside.offsetWidth;
					note.aside.classList.add("flash");
					return;
				}
				e.preventDefault();
				if (note.open) {
					note.open.remove();
					note.open = null;
					return;
				}
				const box = note.aside.cloneNode(true);
				box.className = "sidenote-inline";
				const block = note.ref.closest("p, li, blockquote") || note.ref.parentElement;
				block.after(box);
				note.open = box;
			});
		});

		layout();
		new ResizeObserver(layout).observe(section);
		WIDE.addEventListener("change", () => {
			notes.forEach(n => { if (n.open) { n.open.remove(); n.open = null; } });
			layout();
		});
		window.addEventListener("load", layout);
		if (document.fonts) document.fonts.ready.then(layout);
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
