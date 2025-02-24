const titleStyle = { fontFamily: 'CaudexBold', fontSize: 18, marginTop: 10 }
const italizeStyle = { fontFamily: 'CaudexItalic', marginHorizontal: '10%' }
const linkStyle = { color: '#cec', textDecorationLine: 'underline', backgroundColor: '#00000050', padding: 15, borderRadius: 15 }

export const slider = [
  {
    title: "Google Lens",
    time: { date: "January, 2025", duration: "2~3 min" },
    image: require('../assets/images/lens.png'),
    shortDescription: "Differences between Google Lens and Google Images. Which to use and when to use.",
    description: [
      { text: "Google Lens is a powerful image search tool that lets you search for visually similar content or exact images across Google's indexed internet content." },
      { text: "\"What exactly is Google's index? Simply put, it's a digital record of web pages and other documents eligible to be served in Google's search results. If it's not in Google's index, you won't see it in search results.\"", style: italizeStyle },
      { text: "As of 2020, Google's web page index contained approximately 400 billion documents, though the current count (as of January 2025) is unknown." },
      { text: "Since 2022, Google Lens has gradually replaced Google Images to become Google's primary image search tool.  Like many other reverse image search tools, there is no specific way to use Google Lens; as long as you have something you want to find from an image, your best bet is to use Lens." },
      { text: "The main features of Google Lens include searching for exact matches or visually similar images to one you provide. Let's explore some use cases" },
      { text: "Exact Matches", style: titleStyle },
      { text: "In 2023, Deputy Secretary of Defense Kathleen Hicks posted an image of autonomous drones on X with the caption:" },
      { text: "We'\re making big bets—and we are going to deliver on those bets. First up: we're going to field attritable autonomous systems at a scale of multiple thousands, in multiple domains, within the next 18-to-24 months. Together, we can do this. @NDIAToday #EmergingTechETI\"", style: italizeStyle },
      { text: "https://x.com/DepSecDefHicks/status/1696141737717031362", style: linkStyle },
      { text: "When you reverse image search this with Google Lens, you'll find that the picture was uploaded several years ago by other websites." },
      { text: "https://sofrep.com/news/new-technology-is-ushering-in-the-dystopian-future-of-drone-on-drone-warfare/", style: linkStyle },
      { text: "You can search for an image from a post to verify its credibility or gain more context. This feature is also useful for checking if someone might be a catfish on social media, or for finding a higher-quality version of a blurry image on other websites. " },
      { text: "To use this Google Lens feature, simply upload an image and click \"View exact matches\" at the top." },
      { text: "Visually Similar Content", style: titleStyle },
      { text: "•  Searching for a movie or TV series, from maybe an Instagram reel that the author didn't name in the reel description, so people would keep asking in the comment section for the movie title, and they'd get more engagement on the reel." },
      { text: "•  Seeing clothes you like on someone, on social media, and wanting to find it, or maybe something similar. With the Lens selection tool, you can select the clothes, and it'll give you similar clothes as a result to shop for." },
      { text: "•  Flower or a plant that you like, maybe from the internet or a real-life picture, whose name you don't know and maybe want to get." },
      { text: "•  It could be a picture of food that you got from social media, that you don't know the name of, and you can put in Google Lens, which will find the similar or same food that you uploaded a picture of and possibly give you leads to the recipe on a website." },
      { text: "To access this feature, simply upload an image and review the results. If you need to find something specific within the image, use the selection tool." },
      { text: "Google Lens offers Translate and Text features, depending on which version you're using. Both features work with text in images—whether you want to translate text from an unknown language or use text recognition. The Text feature is particularly handy for finding social media posts by simply uploading an image of the post." },
      { text: "Cons", style: titleStyle },
      { text: "When searching for a person using an image, Google intentionally limits the number of results shown. They've also made the person search feature \"dumber\", to make it harder to find people from images, citing \"data issues\"—which, in my opinion, is just another term for \"not profitable.\" If you're trying to find a person with an image, see the \"People Searching\" article." },
      { text: "Poor social media indexing - Social media platforms like Facebook and Instagram have dynamic content that often leads to unreliable reverse image search results. For instance, when you upload an image and check the \"Exact Matches\" section, you may find many Facebook posts supposedly containing your image. However, when visiting these URLs, you might discover completely different images. The reason for this is that even though the image is not there, it is still related to, for example, a Facebook group or individual profile.. The image might have been posted in a Facebook group, shared by someone with a your uploaded image as profile picture, or posted on a specific profile at some point. This is very important to keep in mind, since if you're actually searching hard for something, you should not give up." },
    ]
  },
    //{
    //   title: "Google Images",
    //   time: { date: "January, 2025", duration: "2~3 min" },
    //   image: require('../assets/images/google_images.png'),
    //   shortDescription: "Old vs. new, what changed?",
    //   description: [
    //     { text: "In 2022, Google Lens gradually replaced Google Images; to this day, people have been asking for its return. The truth is that Google Images is still available, not as easily accessible, but everyone can still use this with a little bit of digging. In this article I'll overview this search engine and what you can do with it in this app." },
    //     { text: "Nowadays, there seem to be two types of people when it comes to Google Lens: the first one is who says they love it and actively use it, and the exact opposite of that, the one who despises it and prefers old Google Images back. Nowadays, there exist browser extensions and methods that re-enable old Google Images, meaning when you're on images.google.com and use the search by image functionality, the good old Images gives you the results instead of the dreaded Lens that, honestly, tries a little too much to give you stuff to buy." },
    //     { text: "However, it is a common misconception that Google Images is better than Google Lens at image searching. Users think that way, but technically, Lens reverse image search functionality is powered by Google Images, since it is highly unlikely that Google is maintaining two image search engines when one is basically hidden, not accessible unless users go out of their way to find it. Although that is the case, it is no placebo that Google Images and Google Lens are different by the way they work." },
    //     { text: "After doing research on both, I can say that if you're really searching for something, I'd advise using both of the technologies. Lens provides visually similar content, which can be the reason why you find a source or a context on an uploaded image; the old images don't have this feature. What Google Images has is finding exact matches of an image, which it is in some cases better than Lens, considering I have been getting more results in Images compared to Lens, but note that there were instances where for some reason Lens gave me more results of duplicate or exact documents of my uploaded image." },
    //     { text: "What Google Images is unmatched at is a thing called Google Dorking, which Lens is unable to do. What is Google Dorking, and how does it make images better than Lens?" },
    //     { text: "\"Google Dorking, also known as Google hacking, is a technique that utilizes advanced search operators to uncover information on the internet that may not be readily available through standard search queries. \"", style: italizeStyle },
    //     { text: "https://www.imperva.com/learn/application-security/google-dorking-hacking/", style: linkStyle },
    //     { text: "There are different types of Google Dorking queries; these are the main ones that are included in this app:" },
    //     { text: "•  site: example.com - Get results only from the specified website, like example.com." },
    //     { text: "•  site: *.com - Results only from specified domain extensions like .com, .org, etc." },
    //     { text: "•  +site: facebook.com - Include a website from results. Only needed if you only want results from 2 or more websites. If you want to get results from all websites, no need to use this." },
    //     { text: "•  site: facebook.com - Exclude a website from results." },
    //     { text: "•  before: 2025-01-28 - You'll get results that are from before the specified date. The date format is year-month-day." },
    //     { text: "•  \"some\" OR \"example\" - Find results that have either some or example." },
    //     { text: "•  \"some\" AND \"example\" - Find results that have both." },
    //     { text: "•  after: 2025-01-28 - Get results only after the date; the date format is the same." },
    //     { text: "•  \"example\" - Results that contain the specified word in quotation marks, in this case, example." },
    //     { text: "•  lr=lang_da - Get only the results that are in the specified language, in this case, Danish." },
    //     { text: "•  cr=countryGE - Results that you would likely get if you were from the specified region/country, in this case, Georgia." },
    //     { text: "•  intitle: \"example\" - You'll get results from websites that have the specified word in the website/tab title." },
    //     { text: "There is no need to memorize any of this; the application has custom filters that you can apply to the image you’re searching. Just know that these exist and there are more out there." },
    //     { text: "To access this feature, first upload an image in the app and press the filter icon next to it, where you can apply different types of queries to search to get your desired result." }
  
    //   ]
    // },
  {
    title: "Yandex Images",
    time: { date: "January, 2025", duration: "1~2 min" },
    image: require('../assets/images/yandex.png'),
    shortDescription: "Yandex Images - What's different from Google Lens? ",
    description: [
      { text: "Yandex Images is another very popular reverse image search engine, which is based in Russia. People consider Yandex Images a big player in reverse image search game, some even saying that it's better than Lens in face recognition, but how true are those claims?" },
      { text: "From my research, current Yandex Images is not better or even close to Google Lens in people searching. I have couple different results I got from comparing these two image search engines in practice. Every time I found success with searches with Yandex, I found success on Lens. There were results where I found success only on Lens and not Yandex and there were searches where there were no results on either of them." },
      { text: "I'm sure there are niche things that Yandex Images can do that Lens can't, like finding obscure Russian content or searching on Russian social medias and forums mostly, instead of western social medias, but the main functionality of giving you good face recognition results is not better than Lens." },
      { text: "People say, Yandex Images is superior compared to Lens if you're searching for people from Eastern Europe, which is not entirely true, maybe from Russia or people that are more popular in Russia, but there were instances were fairly popular people would not even come up in searches but in Lens, it would." },
      { text: "Although that is the case, Yandex Images is still powerful and can be well utilized. We can start from the fact that Yandex does not restrict results if it has people in it, while Lens intentionally limits amount of results you see in some cases, when searching for people. Yandex Images does not try to sell you products, by displaying them in search results, unlike Lens. Although Yandex Images is not good at giving perfect results regarding people, it is better at giving visually similar people as results compared to Google Lens, where you might find person you're searching for." },
      { text: "Despite all, Yandex Images and Google Lens are like two different people, from same field but are good at different things. Theoretically Yandex can still find you more things from Europe than Google, since it indexes different pages and has different indexing rules than Google." },
      { text: "Yandex also has Translate, Selection and Text Recognition features, which are as good as Lens. You can find those features after uploading your image and seeing results." },
      { text: "In the end, when searching for something, everything should be utilized. Yandex Images is maybe not as good in general people searching as Lens but better than everything after the Lens, it is definitely powerful and in some cases can get you results no other search engine can." }
    ]
  },
  {
    title: "About People Search",
    time: { date: "January, 2025", duration: "2 min" },
    image: require('../assets/images/search.png'),
    shortDescription: "Realistic approach to reverse image searching people.",
    description: [
      {text: "In an era where images are everywhere in the digital landscape, reverse image search has become a crucial tool for verifying identities, tracking down social media profiles, and uncovering online personas. Whether you're looking for a long-lost friend, verifying someone’s authenticity, or identifying potential scams, learning how to use people search effectively can make all the difference."},
      {text: "Although, It is important to have realistic expectations. The image search engines made sure everyone would have hard time using their technology for finding people, some just failed at good face recognition, but mainly it still comes down to image indexing. Search engines index pages, which mean they analyze page for its text, images, videos, files and save them on in a big database. If your uploaded photo has not been indexed, which happens more often than the opposite, then it would be impossible to find matches. In some case, Google and other search engines don’t index pages, for their own reasons and other times, websites prevent search engines to crawl and index their pages."},
      {text: "First of all, you should note how these images are indexed. Googlebot looks at websites robots.txt which includes sets of rules for it, telling it, what Googlebot is and isn’t allowed. In this case, different websites allow Google to get their images differently and big social medias aren’t very lenient about it, so there is a good chance that even if your uploaded image does exist, somewhere on the internet, Google is either not allowed to index it, or just hasn’t indexed it. Also, you should understand that if a person did have images online and they deleted it, it will be impossible to reverse image search them."},
      {text: "Different tools yield different results, so using multiple platforms is essential for thorough searching. Below are the most effective services for reverse image searching people:"},
      {text: "Google Lens - Best reverse image search engine."},
      {text: "Google Images - Gives you options to narrow down results that might suit your needs."},
      {text: "Yandex Images - Could be better than Lens, considering it indexes pages that are considerably different than Google Lens."},
      {text: "Bing - Alternative image search engine, gives slightly different results."},
      {text: "There are two key strategies for successful reverse image searching of people: searching for visually similar content and searching for exact matches."},
      {text: "To appeal to visually similar content, it is important to find a image where the person is facing towards the camera so their face shown well, also could be easier if the photo is unique, so visually identifying is easier. It is important that the image is high quality and not blurry, also make sure to pick image that is not heavily altered with filters."},
      {text: "To appeal to exact match/duplicate results, there are not much you can do other than hope that your uploaded image has been reposted many times, or maybe the person with that profile picture has been active in social media groups. This happens because search engines index dynamic content. For example, when indexing Facebook group pages, they may also index related images like post authors' profile pictures and other associated images."}
    ]
  },
  {
    title: "Videos",
    time: { date: "February, 2025", duration: "1~2 min" },
    image: require('../assets/images/video.png'),
    shortDescription: "How to find videos using reverse image search engines.",
    description: [
      {text: "Reverse video search is quite a niche but simple technology. There is nothing new that we haven’t seen that these video search engines use. First there is a specified interval, for example, 1 second. Then the engine takes frames from videos at a specified interval and searches for those frames using reverse image search. We can use this approach to get desired results just using existing reverse image search engines like Lens, Yandex Images, Bing and others."},
      {text: "We do know that we can search for video frames by screenshotting them and using reverse image search engines, but what frames are actually worth searching for?"},
      {text: "First is always the thumbnail or 00:00 seconds of the video. In the end, we’re looking for results that recognize our search results either by visually similar content or exact matches. Searching for the thumbnail, be it YouTube or Instagram video, has a higher chance of finding good results, considering people just repost videos on the internet, and in some cases don’t even edit them."},
      {text: "Second is finding a key moment in the video or a snippet. Could be the most memorable or iconic moment in the video. In this case, if the first method didn’t work, then you need to find the best frame. Of course, you should avoid choosing blurry frames."},
      {text: "Fine-tuning - It could be useful to use Google Images filtering functionality to search for maybe YouTube or Instagram specifically. You could also use Lens’ text detection functionality if the video has text as a caption. The selection tool for visual searches is important and acts as a cropping tool. In some cases, it would be better to use it, than not to. Use different search engines, considering each is good for different things and if not one, maybe another is going to find your desired results."},
      {text: "Also, note that if the first and second methods don’t work, you might have to search more thoroughly for a more suited frame from the video. For example, TikTok’s preview frame could be different from the actual frame at 00:00."}
    ]
  },
  {
    title: "Search Ideas",
    time: { date: "February, 2025", duration: "2~3 min" },
    image: require('../assets/images/idea.png'),
    shortDescription: "Search ideas for reverse image searching.",
    description: [
      {text: "There is no specific thing to find when it comes to reverse image search. As long as you have something to find from an image, you can use image search engines. In this article I’ll tell you ways you can use Lens, Yandex Images, Bing, etc. to get desired results from an image."},
      {text: "Movies and TV Shows", style: titleStyle},
      {text: "Have you ever come across an Instagram reel, TikTok, or YouTube short where you’re shown an edit or maybe part of the movie/tv show, but the author decided that instead of naming the title in the caption, they would make people beg for it in the comments section so they would get more engagement on their video? There is a pretty good chance you have, but now you can get your way by getting a frame from the video by screenshot and putting that screenshot in Sherlock to find more information."},
      {text: "Plants", style: titleStyle},
      {text: "Like I said, there is not only one specific thing that is searchable using reverse image search engines. You can get images off the internet or maybe take a picture of a flower to learn its name. If the flower or plant is a specific type, you might come across its botanical name and family. The name Daffodil has the scientific name of Narcissus and the family name of Amaryllidaceae."},
      {text: "Social media posts", style: titleStyle},
      {text: "There are many cases where you’ll come across social media posting screenshots within posts on social media. In some cases, lots of that is when people repost jokes on the internet. But there is a way to find the original post from the screenshot, and for that you need to upload the image to Sherlock or any other reverse image search platform, so Lens and Yandex Images do their job. As far as I know, Lens can search for posts if you use its text detection features. If that doesn’t do its job, use the Google Images filtering function, and for matching sentences, put social media captions or a status that you’re trying to find. You should only get results that have the same photo and text, including the post, unless it has been deleted by the author before."},
      {text: "Food", style: titleStyle},
      {text: "Surprisingly, reverse image search engines, especially Lens, are very good at detecting the type of food from an image. It uses visual recognition and possibly gives you your name directly if it is confident enough that it’s giving you the right food. Considering how Lens works, just below the picture, you can probably see articles on food websites that give you exact recipes to make that meal."},
      {text: "Products/Items", style: titleStyle},
      {text: "Google has spent a lot of time and probably a lot of time making Lens a lot more consumer-friendly, meaning if you’re trying to find a social media profile by uploading a picture of a person, in some cases, Lens will use selection automatically to select people's clothes and give you products based on it that look visually similar. If you come across clothes or items on Instagram or other social media platforms, you can take that picture and give it to Lens by uploading it either to Sherlock or directly on the Lens app/website."},
      {text: "Verify news and media", style: titleStyle},
      {text: "Nowadays, spreading misinformation is as easy as it’s ever been. A good tool for learning the validity of a post or news article is to fact-check it, and for that, reverse image search could be perfect depending on the situation, especially if they’re using images. Upload images from a post or article on various image search engines with Sherlock. There you might find exact images that have been uploaded on different news outlets or social media platforms that give completely different context. There might even be websites that debunk the misinformation. Using Lens, Google Images, and Yandex, you can find these results."},
      {text: "Geographical locations", style: titleStyle},
      {text: "You can also use reverse image search to learn attraction, geographical and landmark names. Currently, there are many streets and locations you might not be able to find, but if the image contains maybe a church, a museum, a known local building, or even a restaurant, there is a very high chance of you finding a name for it, even if a country attraction you’re searching for might be a little unknown."},
      {text: "Ultimately, even if these are the main reasons people use reverse image search engines, as long as you have something you need to find from a photo, like getting a better quality version or finding the age of the image, then you can always get help from image search engines."}
    ]
  },
  {
    title: "Sherlock",
    time: { date: "February, 2025", duration: "1 min" },
    image: require('../assets/images/sherlock_inverted.png'),
    shortDescription: "About Sherlock.",
    description: [
      {text: "I’d like to start with saying that, none of the actual reverse image search engines are made by me, nor I had any contributions in making them. The problem Sherlock is solving is that now less time is spent on trivial things and more for actually searching."},
      {text: "What normal reverse image search experience, without any other third party tools is manually going on multiple websites by typing the URL, uploading same image on each of them, if one doesn’t work you have to upload different image on every one of them, again."},
      {text: "There are many other apps that operate with the same idea as Sherlock - websites are already typed in and they all receive the image from user. I personally use reverse image search quite often, but when I need to search on mobile, it is not the best experience so sometimes I would just switch to PC, but not anymore. I put everything in Sherlock that I would want in reverse image search app, including little bit of passion in these short articles, feature to bookmark and save URLs and Google Images filtering function."},
      {text: "If you have any feedback, feel free to contact me at miriani.tsirekidze@gmail.com. I’d love to hear your thoughts on Sherlock and how I can improve it."}
    ]
  }
]