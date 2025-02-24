import { observable } from "@legendapp/state";

const store$ = observable({
  urls: [],
  currentUrl: "",

  anime: false,
  defaultEngine: "Lens",
  

  addUrl(url, title) {
    if (!url || url === "Invalid URL") {
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`; // Format as DD/MM/YYYY

    store$.urls.set((prev) => [
      ...prev,
      {
        id: Date.now(),
        url,
        title: title,
        date: formattedDate,
      },
    ]);

    console.log("URL added:", url);
  },

  removeUrl(url) {
    console.log("Removing URL:", url);
    store$.urls.set((prev) =>
      prev.filter((item) => item.url?.value !== url && item.url !== url)
    );
    console.log("Updated URLs after removal:", store$.urls.get());
  },

  isBookmarked(url) {
    return store$.urls.get().some((item) => item.url === url || item.url?.value === url);
  },
});

export default store$;
