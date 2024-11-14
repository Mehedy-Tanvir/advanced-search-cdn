const C = "https://advanced-search-backend-production.up.railway.app",
  z = async () => {
    var l;
    try {
      // console.log("This is cdn");
      const e =
        (l = document.querySelector("html")) == null
          ? void 0
          : l.getAttribute("data-wf-site");
      if (!e) throw new Error("Site ID not found");
      const h = await fetch(`${C}/api/search/getSearchSettingsAndItems/${e}`);
      if (!h.ok) throw new Error("Failed to fetch data");
      const o = await h.json();
      console.log("search settings", o.data);
      const s = await fetch(`${C}/api/search/getSearchResultSettings/${e}`);
      if (!s.ok) throw new Error("Failed to fetch search result settings");
      const d = (await s.json()).data;
      b(o, d);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  },
  b = (l, e) => {
    console.log("search result settings", e);
    const h = l.data.searchSettings;
    l.data.items.results, console.log("search settings", l.data);
    const o = document.getElementById("flowappz-asa-item-container"),
      s = document.getElementById("flowappz-asa-card");
    if (!o || !s) {
      console.error("Container or card template not found");
      return;
    }
    (o.innerHTML = ""), (s.style.display = "none"), (o.style.display = "none");
    const m = document.getElementById("flowappz-asa-search-button");
    (m.type = "button"), m && !e.showSearchButton && (m.style.display = "none");
    const d = document.getElementById("flowappz-asa-search-input"),
      E = async () => {
        var g;
        o.innerHTML = "";
        const r = d.value;
        if (r.length < 1) {
          (o.innerHTML = ""),
            (s.style.display = "none"),
            (o.style.display = "none");
          return;
        }
        const w =
          (g = document.querySelector("html")) == null
            ? void 0
            : g.getAttribute("data-wf-site");
        if (!w) return;
        const u = `${C}/api/search/getSearchedItems/${w}?searchedItem=${encodeURIComponent(
          r
        )}`;
        try {
          const y = await fetch(u);
          if (!y.ok) throw new Error(`Error: ${y.status}`);
          const L = (await y.json()).data;
          (o.style.display = "none"),
            L.slice(0, e.itemLimit).forEach((i) => {
              const c = h.find((n) => n.itemCollection === i.index);
              if (c)
                if (c.dataField)
                  try {
                    const n = JSON.parse(c.dataField),
                      a = s.cloneNode(!0);
                    if (
                      ((o.style.display = "flex"),
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
                          const x =
                            f.length > e.descriptionLength
                              ? f.slice(0, e.descriptionLength) + "..."
                              : f;
                          t.innerText = x;
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
                      o.appendChild(a);
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
    function I(r, w) {
      let u;
      return function (...g) {
        clearTimeout(u), (u = setTimeout(() => r.apply(this, g), w));
      };
    }
    m.addEventListener(
      "click",
      I(async (r) => {
        r.preventDefault(), r.stopPropagation(), await E();
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
    d.addEventListener("keydown", async (r) => {
      r.key === "Enter" && (r.preventDefault(), await E());
    }),
      d.addEventListener(
        "input",
        I(async (r) => {
          r.preventDefault(), await $();
        }, 500)
      );
  };
z();
