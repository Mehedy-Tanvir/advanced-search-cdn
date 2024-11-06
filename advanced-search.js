const q = async () => {
    var a;
    try {
      console.log("This is cdn");
      const e =
        (a = document.querySelector("html")) == null
          ? void 0
          : a.getAttribute("data-wf-site");
      if (!e) throw new Error("Site ID not found");
      const m = await fetch(
        `https://advanced-search-backend-production.up.railway.app/api/search/getSearchSettingsAndItems/${e}`
      );
      if (!m.ok) throw new Error("Failed to fetch data");
      const n = await m.json();
      console.log("search settings", n.data);
      const s = await fetch(
        `https://advanced-search-backend-production.up.railway.app/api/search/getSearchResultSettings/${e}`
      );
      if (!s.ok) throw new Error("Failed to fetch search result settings");
      const p = (await s.json()).data;
      L(n, p);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  },
  L = (a, e) => {
    console.log("search result settings", e);
    const m = a.data.searchSettings;
    a.data.items.results, console.log("search settings", a.data);
    const n = document.getElementById("flowappz-asa-item-container"),
      s = document.getElementById("flowappz-asa-card");
    if (!n || !s) {
      console.error("Container or card template not found");
      return;
    }
    (n.innerHTML = ""), (s.style.display = "none"), (n.style.display = "none");
    const h = document.getElementById("flowappz-asa-search-button");
    h && !e.showSearchButton && (h.style.display = "none");
    const p = document.getElementById("flowappz-asa-search-input"),
      w = async () => {
        var u;
        n.innerHTML = "";
        const y = p.value,
          g =
            (u = document.querySelector("html")) == null
              ? void 0
              : u.getAttribute("data-wf-site");
        if (!g) return;
        const I = `https://advanced-search-backend-production.up.railway.app/api/search/getSearchedItems/${g}?searchedItem=${encodeURIComponent(
          y
        )}`;
        try {
          const f = await fetch(I);
          if (!f.ok) throw new Error(`Error: ${f.status}`);
          const x = (await f.json()).data;
          (n.style.display = "none"),
            x.slice(0, e.itemLimit).forEach((r) => {
              const i = m.find((o) => o.itemCollection === r.index);
              if (i)
                if (i.dataField)
                  try {
                    const o = JSON.parse(i.dataField),
                      c = s.cloneNode(!0);
                    if (
                      ((n.style.display = "flex"),
                      (c.style.display = "flex"),
                      o.title && r[o.title])
                    ) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="title"]'
                      );
                      if (t) {
                        const d = r[o.title].replace(/<\/?[^>]+(>|$)/g, "");
                        t.innerText = d;
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
                        const d = r[o.description].replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        );
                        if (e != null && e.descriptionLength) {
                          const T =
                            d.length > e.descriptionLength
                              ? d.slice(0, e.descriptionLength) + "..."
                              : d;
                          t.innerText = T;
                        } else t.innerText = d;
                      }
                    }
                    if (o.image && r[o.image]) {
                      const t = c.querySelector(
                        '[flowappz-asa-data-field="image"]'
                      );
                      t && ((t.src = r[o.image].url), (t.srcset = ""));
                    }
                    const E = c,
                      l = r[o.link];
                    l &&
                      (typeof l == "string"
                        ? (E.href = l)
                        : typeof l == "object" && l.url && (E.href = l.url)),
                      n.appendChild(c);
                  } catch (o) {
                    console.error("Error parsing fieldData:", o);
                  }
                else
                  console.warn(
                    `dataField is undefined or empty for itemCollection: ${i.itemCollection}`
                  );
            });
        } catch (f) {
          console.error("Error fetching search results:", f);
        }
      };
    h.addEventListener("click", async (y) => {
      y.preventDefault(), await w();
    });
    const C = async () => {
      console.log("search input changed"),
        e != null &&
          e.autoComplete &&
          e != null &&
          e.minCharacters &&
          p.value.length >= e.minCharacters &&
          (await w());
    };
    p.addEventListener("input", C);
  };
q();
