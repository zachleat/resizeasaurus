class ResizeASaurus extends HTMLElement {
	static delay = 1000;

	static attr = {
		disabled: "disabled",
		label: "label",
		persist: "persist",
	};

	static classes = {
		sizer: "sizer",
		active: "active",
	};

	static css = `
@supports (resize: horizontal) {
	:host {
		--resizeasaurus-color: #000;
		--resizeasaurus-background: rgba(255,255,255,.7);
	}
	@media (prefers-color-scheme: dark) {
		:host {
			--resizeasaurus-color: #ccc;
			--resizeasaurus-background: rgba(0,0,0,.7);
		}
	}
	:host(:not([${ResizeASaurus.attr.disabled}]):defined) {
		display: grid;
		padding: 0;
		resize: horizontal;
		overflow: auto;
		position: relative;
	}

	.sizer {
		color: var(--resizeasaurus-color);
		background-color: var(--resizeasaurus-background);
		position: absolute;
		right: 0;
		bottom: 0;
		font-family: system-ui, sans-serif;
		font-variant-numeric: tabular-nums;
		padding: .25em 1.5em .25em 1em;
		font-size: 0.8125em; /* 13px /16 */
		border-radius: .5em 0 0 0;
		pointer-events: none;
		opacity: 0;
		transition: .3s opacity;
	}
	.sizer.active,
	:host([${ResizeASaurus.attr.persist}]) .sizer {
		opacity: 1;
	}
}
`;

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(this.shadowRoot || !CSS.supports("resize", "horizontal") || !("replaceSync" in CSSStyleSheet.prototype) || this.hasAttribute(ResizeASaurus.attr.disabled)) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(ResizeASaurus.css);
		shadowroot.adoptedStyleSheets = [sheet];

		let slot = document.createElement("slot");
		shadowroot.appendChild(slot);

		if(this.getAttribute(ResizeASaurus.attr.label) === "disabled") {
			return;
		}

		let sizer = document.createElement("output");
		sizer.classList.add(ResizeASaurus.classes.sizer);
		sizer.textContent = "Drag to resize";
		shadowroot.appendChild(sizer);
		this.sizer = sizer;

		if("ResizeObserver" in window) {
			let timer;
			this.resizer = new ResizeObserver(() => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					sizer.classList.remove(ResizeASaurus.classes.active);
				}, ResizeASaurus.delay);
				sizer.classList.add(ResizeASaurus.classes.active);

				let width = this.clientWidth + "px";
				sizer.innerHTML = `${parseInt(width, 10) / 16}em (${width})`;
			});
			this.resizer.observe(this);
		}
	}

	resize() {
		this.sizer.innerHTML = this.outerWidth;
	}
}

if("customElements" in window) {
	customElements.define("resize-asaurus", ResizeASaurus);
}