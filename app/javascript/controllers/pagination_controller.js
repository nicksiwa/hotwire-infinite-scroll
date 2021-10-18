import { Controller } from "@hotwired/stimulus";
import { get } from "@rails/request.js";

export default class extends Controller {
  static values = {
    url: String,
    page: Number,
    hasNextPage: Boolean,
  };

  static targets = ["lastPage"];

  initialize() {
    this.pageValue = this.pageValue || 1;
  }

  connect() {
    const options = {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      this.observeCallback.bind(this),
      options
    );

    observer.observe(document.querySelector("#bottomPage"));
  }

  observeCallback([entry], observer) {
    if (entry.isIntersecting && !this.hasLastPageTarget) {
      this._fetchNewPage();
    }
  }

  async _fetchNewPage() {
    const url = new URL(this.urlValue);
    url.searchParams.set("page", this.pageValue);

    await get(url.toString(), {
      responseKind: "turbo-stream",
    });

    this.pageValue += 1;
  }
}
