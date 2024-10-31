const S = async () => {
    var c;
    try {
      console.log("This is cdn");
      const a =
        (c = document.querySelector("html")) == null
          ? void 0
          : c.getAttribute("data-wf-site");
      if (!a) throw new Error("Site ID not found");
      const n = await fetch(
        `https://advanced-search-backend-production.up.railway.app/api/search/getSearchSettingsAndItems/${a}`
      );
      if (!n.ok) throw new Error("Failed to fetch data");
      const r = await n.json();
      console.log("search settings", r.data), I(r);
    } catch (a) {
      console.error("Error fetching data:", a);
    }
  },
  I = (c) => {
    const a = c.data.searchSettings;
    c.data.items.results;
    const n = document.getElementById("flowappz-asa-item-container"),
      r = document.querySelector(".flowappz-asa-card");
    if (!n || !r) {
      console.error("Container or card template not found");
      return;
    }
    (n.innerHTML = ""), (r.style.display = "none");
    const h = document.getElementById("flowappz-asa-search-button"),
      g = document.getElementById("flowappz-asa-search-input");
    h.addEventListener("click", async (u) => {
      var p;
      u.preventDefault(), (n.innerHTML = "");
      const w = g.value,
        m =
          (p = document.querySelector("html")) == null
            ? void 0
            : p.getAttribute("data-wf-site");
      if (!m) return;
      const y = `https://advanced-search-backend-production.up.railway.app/api/search/getSearchedItems/${m}?searchedItem=${encodeURIComponent(
        w
      )}`;
      try {
        const s = await fetch(y);
        if (!s.ok) throw new Error(`Error: ${s.status}`);
        const f = (await s.json()).data;
        console.log("search results", f),
          f.forEach((o) => {
            const l = a.find((e) => e.itemCollection === o.index);
            if (l)
              if (l.dataField)
                try {
                  const e = JSON.parse(l.dataField),
                    i = r.cloneNode(!0);
                  if (((i.style.display = "flex"), e.title && o[e.title])) {
                    const t = i.querySelector(
                      '[flowappz-asa-data-field="title"]'
                    );
                    if (t) {
                      const d = o[e.title].replace(/<\/?[^>]+(>|$)/g, "");
                      t.innerText = d;
                    }
                  }
                  if (e.description && o[e.description]) {
                    const t = i.querySelector(
                      '[flowappz-asa-data-field="description"]'
                    );
                    if (t) {
                      const d = o[e.description].replace(/<\/?[^>]+(>|$)/g, "");
                      t.innerText = d;
                    }
                  }
                  if (e.image && o[e.image]) {
                    const t = i.querySelector(
                      '[flowappz-asa-data-field="image"]'
                    );
                    console.log("image url", o[e.image].url),
                      console.log("image element", t),
                      t && ((t.src = o[e.image].url), (t.srcset = ""));
                  }
                  n.appendChild(i);
                } catch (e) {
                  console.error("Error parsing fieldData:", e);
                }
              else
                console.warn(
                  `dataField is undefined or empty for itemCollection: ${l.itemCollection}`
                );
          });
      } catch (s) {
        console.error("Error fetching search results:", s);
      }
    });
  };
S();
