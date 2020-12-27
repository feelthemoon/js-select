const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? "Default placeholder";
  const items = data.map((item) => {
    let classes = "";
    if (item.id === +selectedId) {
      text = item.value;
      classes = "selected";
    }
    return `<li class="select__item ${classes}" data-type="item" data-id="${item.id}">${item.value}</li>`;
  });
  return `
<div class="select__backdrop" data-type="backdrop"></div>
<div class="select__input" data-type="input">
               <span class="select__text" data-type="value">
                   ${text}
               </span>
               <i class="fa fa-chevron-down" aria-hidden="true" data-type="arrow"></i>
           </div>
           <div class="select__dropdown">
               <ul class="select__list">
                   ${items.join("")}
               </ul>
</div>`;
};

export class Select {
  constructor(selector, options) {
    this._$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = options.selectedId;
    this.#render();
    this.#setup();
  }

  open = () => {
    this._$el.classList.add("open");
    this._$arrow.classList.remove("fa-chevron-down");
    this._$arrow.classList.add("fa-chevron-up");
  };
  close = () => {
    this._$el.classList.remove("open");
    this._$arrow.classList.add("fa-chevron-down");
    this._$arrow.classList.remove("fa-chevron-up");
  };

  #render = () => {
    const { placeholder, data } = this.options;
    this._$el.classList.add("select");
    this._$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
  };

  clickHandler = (event) => {
    const { type, id } = event.target.dataset;
    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      this.select(id);
    } else {
      this.close();
    }
  };

  get isOpen() {
    return this._$el.classList.contains("open");
  }
  get current() {
    return this.options.data.find((item) => item.id === +this.selectedId);
  }
  select = (id) => {
    this.selectedId = id;
    this._$value.textContent = this.current.value;
    this._$el
      .querySelectorAll(`[data-type="item"]`)
      .forEach((el) => el.classList.remove("selected"));
    this._$el.querySelector(`[data-id="${id}"]`).classList.add("selected");
    this.options.onSelect ? this.options.onSelect(this.current) : null;
    this.close();
  };
  toggle = () => {
    this.isOpen ? this.close() : this.open();
  };

  #setup = () => {
    this._$el.addEventListener("click", this.clickHandler);
    this._$arrow = this._$el.querySelector('[data-type="arrow"]');
    this._$value = this._$el.querySelector('[data-type="value"]');
  };

  destroy = () => {
    this._$el.removeEventListener("click", this.clickHandler);
    this._$el.innerHTML = "";
  };
}
