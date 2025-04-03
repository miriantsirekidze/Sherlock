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
    const filterArray = [];
    
    if (params.keyword) {
      filterArray.push(`'${params.keyword}'`);
    }
    if (params.website) {
      filterArray.push(`site:${params.website}`);
    }
    if (params.domain) {
      filterArray.push(`site:${params.domain}`);
    }
    if (params.removeWebsite) {
      filterArray.push(`*+-site:${params.removeWebsite}`);
    }
    if (params.removeDomain) {
      filterArray.push(`*+-site:${params.removeDomain}`);
    }
    if (params.language) {
      filterArray.push(`lr:${params.language}`);
    }
    if (params.country) {
      filterArray.push(`cr:Country${params.country}`);
    }
    if (params.beforeDate) {
      const d = new Date(params.beforeDate);
      filterArray.push(`before:${d.toISOString().split('T')[0]}`);
    }
    if (params.afterDate) {
      const d = new Date(params.afterDate);
      filterArray.push(`after:${d.toISOString().split('T')[0]}`);
    }

    if (filterArray.length === 0) return "";

    const firstFilter = `&q=${filterArray[0]}`;
    const additionalFilters = filterArray.slice(1).map(f => `&${f}`).join('');
    return firstFilter + additionalFilters;
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
