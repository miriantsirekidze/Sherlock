import { observable } from "@legendapp/state";

const store$ = observable({
  urls: [], // Array of saved URLs
  currentUrl: "",

  addUrl(url, title) {
    console.log('pressed')
    store$.urls.set((prev) => [...prev, { id: Date.now(), url, title }]);
  },

  removeUrl(url) {
    // Filter out the URL to remove it
    store$.urls.set((prev) => prev.filter((item) => item.url !== url));
  },

  isBookmarked(url) {
    return store$.urls.get().some((item) => item.url === url);
  },
});

export default store$;
