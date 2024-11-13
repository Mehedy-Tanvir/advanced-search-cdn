const C = "https://advanced-search-backend-production.up.railway.app",
  L = async () => {
    var s;
    try {
      console.log("This is cdn");
      const e =
        (s = document.querySelector("html")) == null
          ? void 0
          : s.getAttribute("data-wf-site");
      if (!e) throw new Error("Site ID not found");
      const h = await fetch(`${C}/api/search/getSearchSettingsAndItems/${e}`);
      if (!h.ok) throw new Error("Failed to fetch data");
      const r = await h.json();
      console.log("search settings", r.data);
      const l = await fetch(`${C}/api/search/getSearchResultSettings/${e}`);
      if (!l.ok) throw new Error("Failed to fetch search result settings");
      const d = (await l.json()).data;
      b(r, d);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  },
  b = (s, e) => {
    console.log("search result settings", e);
    const h = s.data.searchSettings;
    s.data.items.results, console.log("search settings", s.data);
    const r = document.getElementById("flowappz-asa-item-container"),
      l = document.getElementById("flowappz-asa-card");
    if (!r || !l) {
      console.error("Container or card template not found");
      return;
    }
    (r.innerHTML = ""), (l.style.display = "none"), (r.style.display = "none");
    const m = document.getElementById("flowappz-asa-search-button");
    (m.type = "button"), m && !e.showSearchButton && (m.style.display = "none");
    const d = document.getElementById("flowappz-asa-search-input"),
      E = async () => {
        var g;
        r.innerHTML = "";
        const o = d.value,
          w =
            (g = document.querySelector("html")) == null
              ? void 0
              : g.getAttribute("data-wf-site");
        if (!w) return;
        const u = `${C}/api/search/getSearchedItems/${w}?searchedItem=${encodeURIComponent(
          o
        )}`;
        try {
          const y = await fetch(u);
          if (!y.ok) throw new Error(`Error: ${y.status}`);
          const k = (await y.json()).data;
          (r.style.display = "none"),
            k.slice(0, e.itemLimit).forEach((i) => {
              const c = h.find((n) => n.itemCollection === i.index);
              if (c)
                if (c.dataField)
                  try {
                    const n = JSON.parse(c.dataField),
                      a = l.cloneNode(!0);
                    if (
                      ((r.style.display = "flex"),
                      (a.style.display = "flex"),
                      n.title && i[n.title])
                    ) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="title"]'
                      );
                      if (t) {
                        const f = i[n.title].replace(/<\/?[^>]+(>|$)/g, "");
                        t.innerText = f;
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
                    if (n.description && i[n.description]) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="description"]'
                      );
                      if (t) {
                        const f = i[n.description].replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        );
                        if (e != null && e.descriptionLength) {
                          const z =
                            f.length > e.descriptionLength
                              ? f.slice(0, e.descriptionLength) + "..."
                              : f;
                          t.innerText = z;
                        } else t.innerText = f;
                      }
                    }
                    if (n.image && i[n.image]) {
                      const t = a.querySelector(
                        '[flowappz-asa-data-field="image"]'
                      );
                      t && ((t.src = i[n.image].url), (t.srcset = ""));
                    }
                    const T = a,
                      p = i[n.link];
                    p &&
                      (typeof p == "string"
                        ? (T.href = p)
                        : typeof p == "object" && p.url && (T.href = p.url)),
                      r.appendChild(a);
                  } catch (n) {
                    console.error("Error parsing fieldData:", n);
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
    function I(o, w) {
      let u;
      return function (...g) {
        clearTimeout(u), (u = setTimeout(() => o.apply(this, g), w));
      };
    }
    m.addEventListener(
      "click",
      I(async (o) => {
        o.preventDefault(), o.stopPropagation(), await E();
      }, 500)
    );
    const $ = async () => {
      console.log("search input changed"),
        e != null &&
          e.autoComplete &&
          e != null &&
          e.minCharacters &&
          d.value.length >= e.minCharacters &&
          (await E());
    };
    d.addEventListener("keydown", async (o) => {
      o.key === "Enter" && (o.preventDefault(), await E());
    }),
      d.addEventListener(
        "input",
        I(async (o) => {
          o.preventDefault(), await $();
        }, 500)
      );
  };
L();
