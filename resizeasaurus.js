
class ResizeASaurus extends HTMLElement {
	static needsCss = true;

	static css = `
@supports (resize: horizontal) {
	resize-asaurus:not([disabled]):defined {
		display: grid;
		padding: 0;
		resize: horizontal;
		overflow: auto;
		outline: 4px dashed #ccc;
		margin: 0 0 6em;
		background-color: #f9f9f9;
	}
	/* Workaround for Safari refusing to go below initial content width */
	resize-asaurus:not([disabled]):defined:active {
		width: var(--resizeasaurus-initial-width, 1px);
	}
	.resizeasaurus-size {
		display: flex !important;
		align-items: center;
		justify-content: flex-end;
		gap: 1.5em;
		bottom: 0;
		font-family: system-ui, sans-serif;
		font-variant-numeric: tabular-nums;
		padding-right: 1.5em;
		font-size: 0.8125em; /* 13px /16 */
		color: #666;
	}
}
`;
	constructor() {
		super();

		this.attrs = {
			label: "label"
		};

		this.classes = {
			sizer: "resizeasaurus-size"
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
			this.size.style.display = "none"; // in case css isn’t available.
			this.size.classList.add(this.classes.sizer);
			this.size.textContent = "Drag to resize";
			this.appendChild(this.size);
		}

		if("ResizeObserver" in window) {
			let isSet = false;
			this.resizer = new ResizeObserver(entries => {
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