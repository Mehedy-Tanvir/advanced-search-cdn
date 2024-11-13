const BaseUrl = "https://advanced-search-backend-production.up.railway.app";

const L = async () => {
    var s;
    try {
      console.log("This is cdn");
      const e =
        (s = document.querySelector("html")) == null
          ? void 0
          : s.getAttribute("data-wf-site");
      if (!e) throw new Error("Site ID not found");
      const h = await fetch(
        `${BaseUrl}/api/search/getSearchSettingsAndItems/${e}`
      );
      if (!h.ok) throw new Error("Failed to fetch data");
      const n = await h.json();
      console.log("search settings", n.data);
      const l = await fetch(
        `${BaseUrl}/api/search/getSearchResultSettings/${e}`
      );
      if (!l.ok) throw new Error("Failed to fetch search result settings");
      const m = (await l.json()).data;
      $(n, m);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  },
  $ = (s, e) => {
    console.log("search result settings", e);
    const h = s.data.searchSettings;
    s.data.items.results, console.log("search settings", s.data);
    const n = document.getElementById("flowappz-asa-item-container"),
      l = document.getElementById("flowappz-asa-card");
    if (!n || !l) {
      console.error("Container or card template not found");
      return;
    }
    (n.innerHTML = ""), (l.style.display = "none"), (n.style.display = "none");
    const f = document.getElementById("flowappz-asa-search-button");
    (f.type = "button"), f && !e.showSearchButton && (f.style.display = "none");
    const m = document.getElementById("flowappz-asa-search-input"),
      E = async () => {
        var g;
        n.innerHTML = "";
        const r = m.value,
          w =
            (g = document.querySelector("html")) == null
              ? void 0
              : g.getAttribute("data-wf-site");
        if (!w) return;
        const u = `${BaseUrl}/api/search/getSearchedItems/${w}?searchedItem=${encodeURIComponent(
          r
        )}`;
        try {
          const y = await fetch(u);
          if (!y.ok) throw new Error(`Error: ${y.status}`);
          const x = (await y.json()).data;
          (n.style.display = "none"),
            x.slice(0, e.itemLimit).forEach((i) => {
              const c = h.find((o) => o.itemCollection === i.index);
              if (c)
                if (c.dataField)
                  try {
                    const o = JSON.parse(c.dataField),
                      a = l.cloneNode(!0);
                    if (
                      ((n.style.display = "flex"),
                      (a.style.display = "flex"),
                      o.title && i[o.title])
                    ) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="title"]'
                      );
                      if (t) {
                        const p = i[o.title].replace(/<\/?[^>]+(>|$)/g, "");
                        t.innerText = p;
                      }
                    }
                    if (
                      c != null &&
                      c.itemName &&
                      e != null &&
                      e.showCategory
                    ) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="category"]'
                      );
                      t && (t.innerText = c.itemName);
                    } else {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="category"]'
                      );
                      t && (t.style.display = "none");
                    }
                    if (o.description && i[o.description]) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="description"]'
                      );
                      if (t) {
                        const p = i[o.description].replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        );
                        if (e != null && e.descriptionLength) {
                          const b =
                            p.length > e.descriptionLength
                              ? p.slice(0, e.descriptionLength) + "..."
                              : p;
                          t.innerText = b;
                        } else t.innerText = p;
                      }
                    }
                    if (o.image && i[o.image]) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="image"]'
                      );
                      t && ((t.src = i[o.image].url), (t.srcset = ""));
                    }
                    const I = a,
                      d = i[o.link];
                    d &&
                      (typeof d == "string"
                        ? (I.href = d)
                        : typeof d == "object" && d.url && (I.href = d.url)),
                      n.appendChild(a);
                  } catch (o) {
                    console.error("Error parsing fieldData:", o);
                  }
                else
                  console.warn(
                    `dataField is undefined or empty for itemCollection: ${c.itemCollection}`
                  );
            });
        } catch (y) {
          console.error("Error fetching search results:", y);
        }
      };
    function C(r, w) {
      let u;
      return function (...g) {
        clearTimeout(u), (u = setTimeout(() => r.apply(this, g), w));
      };
    }
    f.addEventListener(
      "click",
      C(async (r) => {
        r.preventDefault(), r.stopPropagation(), await E();
      }, 500)
    );
    const T = async () => {
      console.log("search input changed"),
        e != null &&
          e.autoComplete &&
          e != null &&
          e.minCharacters &&
          m.value.length >= e.minCharacters &&
          (await E());
    };
    m.addEventListener(
      "input",
      C(async (r) => {
        r.preventDefault(), await T();
      }, 500)
    );
  };
L();
