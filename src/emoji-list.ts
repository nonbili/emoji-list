import { emojilib } from "./emojilib";

const template = document.createElement("template");

template.innerHTML = `
<style>
:host {
  display: block;
}

.list div:first-child {
  margin-top: 0.5rem;
}

.list div {
  margin: 1.5rem 0 0.5rem;
  padding: 0 0.5rem;
}

.list span {
  font-size: var(--emoji-font-size, 1.25rem);
  padding: var(--emoji-padding, 0.5rem);
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
}

.list span:hover {
  background-color: var(--emoji-hover-bg, lightblue);
}
</style>
<div class="list"></div>
`;

const categories: Array<keyof typeof emojilib> = [
  "people",
  "animals_and_nature",
  "food_and_drink",
  "activity",
  "travel_and_places",
  "objects",
  "symbols",
  "flags"
];

/**
 * A custom element to render a list of emojis.
 *
 * @observedAttributes: ["filter"]
 * @events: ["change"]
 */
export class EmojiList extends HTMLElement {
  // Root element.
  $list: HTMLDivElement;

  // Every emoji is rendered inside a <span>
  $emojis: Array<HTMLSpanElement> = [];

  // Use `document.querySelector('emoji-list').value` to get selected emoji.
  value: string = "";

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.$list = shadow.querySelector(".list") as HTMLDivElement;

    this.$list.addEventListener("click", this.onClick);
  }

  connectedCallback() {
    this.render();
    this.$emojis = Array.from(this.$list.querySelectorAll("span"));
  }

  static get observedAttributes() {
    return ["filter"];
  }

  attributeChangedCallback(_: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      this.onFilter(newVal);
    }
  }

  onFilter = (term: string) => {
    if (term) {
      for (let el of this.$emojis) {
        if (el.title.includes(term) || el.dataset?.keywords?.includes(term)) {
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      }
      this.toggleCategory(false);
    } else {
      for (let el of this.$emojis) {
        el.style.display = "";
      }
      this.toggleCategory(true);
    }
  };

  onClick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.tagName.toLowerCase() === "span") {
      this.value = el.textContent || "";
      this.dispatchEvent(new Event("change"));
    }
  };

  capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }

  toggleCategory(show: boolean) {
    for (let el of this.$list.querySelectorAll("div")) {
      el.style.display = show ? "" : "none";
    }
  }

  renderCategory(category: string) {
    const words = category.split("_").filter(x => x !== "and");
    const text = words.map(this.capitalize).join(" & ");
    return `<div part="category">${text}</div>`;
  }

  render() {
    let list = "";
    for (let category of categories) {
      list += this.renderCategory(category);
      for (let [emoji, title, ...keywords] of emojilib[category]) {
        list += `<span title="${title}" data-keywords="${keywords}">${emoji}</span>`;
      }
    }
    this.$list.innerHTML = list;
  }
}

customElements.define("emoji-list", EmojiList);
