import { observable } from "@legendapp/state";

const store$ = observable({
  urls: [],
  currentUrl: "",
  anime: false,
  imageCheck: false,
  location: false,
  pimeyes: false,
  fullPimeyes: true,
  defaultEngine: "Lens",
  imagesParameters: observable({
    keyword: null,
    website: null,
    domain: null,
    removeWebsite: null,
    removeDomain: null,
    language: null,
    country: null,
    beforeDate: null,
    afterDate: null,
  }),

  addParameter(key, value) {
    if (!value) return;
    store$.imagesParameters[key].set(value);
    console.log(`Added parameter [${key}]:`, value);
  },

  getFilterString() {
    const params = store$.imagesParameters.get();
    const qParts = [];

    if (params.afterDate) {
      const afterDate = new Date(params.afterDate).toISOString().split('T')[0];
      qParts.push(`after:${afterDate}`);
    }
    if (params.beforeDate) {
      const beforeDate = new Date(params.beforeDate).toISOString().split('T')[0];
      qParts.push(`before:${beforeDate}`);
    }

    if (params.keyword) {
      qParts.push(`'${params.keyword}'`);
    } else if (params.website) {
      qParts.push(`site:${params.website}`);
    } else if (params.domain) {
      qParts.push(`site:${params.domain}`);
    } else if (params.removeWebsite) {
      qParts.push(`*+-site:${params.removeWebsite}`);
    } else if (params.removeDomain) {
      qParts.push(`*+-site:${params.removeDomain}`);
    }

    let qString = "";
    if (qParts.length > 0) {
      qString = "&q=" + qParts.join("%20");
    }

    let extra = "";
    if (params.language) {
      extra += `&lr=lang_${params.language}`;
    }
    if (params.country) {
      extra += `&cr=Country${params.country}`;
    }

    return qString + extra;
  },

  addUrl(url, title) {
    if (!url || url === "Invalid URL") return;
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    store$.urls.set(prev => [
      ...prev,
      { id: Date.now(), url, title, date: formattedDate },
    ]);
    console.log("URL added:", url);
  },

  removeUrl(url) {
    console.log("Removing URL:", url);
    store$.urls.set(prev =>
      prev.filter(item => item.url?.value !== url && item.url !== url)
    );
    console.log("Updated URLs after removal:", store$.urls.get());
  },

  isBookmarked(url) {
    return store$.urls.get().some(item => item.url === url || item.url?.value === url);
  },
});

export default store$;
