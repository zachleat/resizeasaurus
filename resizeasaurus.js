
class ResizeASaurus extends HTMLElement {
	static needsCss = true;

	static css = `
@supports (resize: horizontal) {
	resize-asaurus:not([disabled]):defined {
		display: grid;
		padding: 0;
		resize: horizontal;
		overflow: auto;
		outline: 2px dashed #ddd;
		margin: 0 0 6em;
		background-color: #f9f9f9;
		position: relative;
	}
	/* Workaround for Safari refusing to go below initial content width */
	resize-asaurus:not([disabled]):defined:active {
		width: var(--resizeasaurus-initial-width, 1px);
	}
	.resizeasaurus-size {
		position: absolute;
		right: 0;
		bottom: 0;
		font-family: system-ui, sans-serif;
		font-variant-numeric: tabular-nums;
		padding: .25em 1.5em .25em 1em;
		font-size: 0.8125em; /* 13px /16 */
		color: #666;
		border-radius: .5em 0 0 0;
		background-color: rgba(255,255,255,.7);
		pointer-events: none;
		opacity: 0;
		transition: .3s opacity;
	}
	.resizeasaurus-size.active {
		opacity: 1;
	}
}
`;
	constructor() {
		super();

		this.delay = 1000;

		this.attrs = {
			label: "label"
		};

		this.classes = {
			sizer: "resizeasaurus-size",
			active: "active",
		};
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(!CSS.supports("resize", "horizontal") || !("replaceSync" in CSSStyleSheet.prototype) || this.hasAttribute("disabled")) {
			return;
		}

		if(ResizeASaurus.needsCss) {
			let sheet = new CSSStyleSheet();
			sheet.replaceSync(ResizeASaurus.css);
			document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
			ResizeASaurus.needsCss = false;
		}

		if(this.getAttribute(this.attrs.label) === "disabled") {
			return;
		}

		this.size = this.querySelector(`.${this.classes.sizer}`);
		if(!this.size) {
			this.size = document.createElement("output");
			this.size.classList.add(this.classes.sizer);
			this.size.textContent = "Drag to resize";
			this.appendChild(this.size);
		}

		if("ResizeObserver" in window) {
			let isSet = false;
			let timer;
			this.resizer = new ResizeObserver(entries => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					this.size.classList.remove(this.classes.active);
				}, this.delay);
				this.size.classList.add(this.classes.active);

				let width = this.clientWidth + "px";
				this.size.innerHTML = `${parseInt(width, 10) / 16}em (${width})`;
				if(!window.safari && !isSet) {
					isSet = true;
					this.style.setProperty("--resizeasaurus-initial-width", width);
				}
			});
			this.resizer.observe(this);
		}
	}

	resize() {
		this.size.innerHTML = this.outerWidth;
	}
}

if("customElements" in window) {
	customElements.define("resize-asaurus", ResizeASaurus);
}