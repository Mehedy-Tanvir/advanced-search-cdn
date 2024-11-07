const $ = async () => {
    var s;
    try {
      // console.log("This is cdn");
      const e =
        (s = document.querySelector("html")) == null
          ? void 0
          : s.getAttribute("data-wf-site");
      if (!e) throw new Error("Site ID not found");
      const h = await fetch(
        `https://advanced-search-backend-production.up.railway.app/api/search/getSearchSettingsAndItems/${e}`
      );
      if (!h.ok) throw new Error("Failed to fetch data");
      const n = await h.json();
      console.log("search settings", n.data);
      const l = await fetch(
        `https://advanced-search-backend-production.up.railway.app/api/search/getSearchResultSettings/${e}`
      );
      if (!l.ok) throw new Error("Failed to fetch search result settings");
      const f = (await l.json()).data;
      b(n, f);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  },
  b = (s, e) => {
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
    const y = document.getElementById("flowappz-asa-search-button");
    y && !e.showSearchButton && (y.style.display = "none");
    const f = document.getElementById("flowappz-asa-search-input"),
      E = async () => {
        var g;
        n.innerHTML = "";
        const a = f.value,
          w =
            (g = document.querySelector("html")) == null
              ? void 0
              : g.getAttribute("data-wf-site");
        if (!w) return;
        const u = `https://advanced-search-backend-production.up.railway.app/api/search/getSearchedItems/${w}?searchedItem=${encodeURIComponent(
          a
        )}`;
        try {
          const m = await fetch(u);
          if (!m.ok) throw new Error(`Error: ${m.status}`);
          const x = (await m.json()).data;
          (n.style.display = "none"),
            x.slice(0, e.itemLimit).forEach((r) => {
              const i = h.find((o) => o.itemCollection === r.index);
              if (i)
                if (i.dataField)
                  try {
                    const o = JSON.parse(i.dataField),
                      c = l.cloneNode(!0);
                    if (
                      ((n.style.display = "flex"),
                      (c.style.display = "flex"),
                      o.title && r[o.title])
                    ) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="title"]'
                      );
                      if (t) {
                        const p = r[o.title].replace(/<\/?[^>]+(>|$)/g, "");
                        t.innerText = p;
                      }
                    }
                    if (
                      i != null &&
                      i.itemName &&
                      e != null &&
                      e.showCategory
                    ) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="category"]'
                      );
                      t && (t.innerText = i.itemName);
                    } else {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="category"]'
                      );
                      t && (t.style.display = "none");
                    }
                    if (o.description && r[o.description]) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="description"]'
                      );
                      if (t) {
                        const p = r[o.description].replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        );
                        if (e != null && e.descriptionLength) {
                          const L =
                            p.length > e.descriptionLength
                              ? p.slice(0, e.descriptionLength) + "..."
                              : p;
                          t.innerText = L;
                        } else t.innerText = p;
                      }
                    }
                    if (o.image && r[o.image]) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="image"]'
                      );
                      t && ((t.src = r[o.image].url), (t.srcset = ""));
                    }
                    const I = c,
                      d = r[o.link];
                    d &&
                      (typeof d == "string"
                        ? (I.href = d)
                        : typeof d == "object" && d.url && (I.href = d.url)),
                      n.appendChild(c);
                  } catch (o) {
                    console.error("Error parsing fieldData:", o);
                  }
                else
                  console.warn(
                    `dataField is undefined or empty for itemCollection: ${i.itemCollection}`
                  );
            });
        } catch (m) {
          console.error("Error fetching search results:", m);
        }
      };
    function C(a, w) {
      let u;
      return function (...g) {
        clearTimeout(u), (u = setTimeout(() => a.apply(this, g), w));
      };
    }
    y.addEventListener(
      "click",
      C(async (a) => {
        a.preventDefault(), await E();
      }, 500)
    );
    const T = async () => {
      console.log("search input changed"),
        e != null &&
          e.autoComplete &&
          e != null &&
          e.minCharacters &&
          f.value.length >= e.minCharacters &&
          (await E());
    };
    f.addEventListener(
      "input",
      C(async (a) => {
        a.preventDefault(), await T();
      }, 500)
    );
  };
$();
