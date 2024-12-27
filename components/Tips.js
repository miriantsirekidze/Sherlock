import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tip from './Tip';

const Tips = () => {
  return (
    <View style={styles.container}>
      <Tip title={"Google Lens vs Google Images"} description={"In 2022, Google Lens replaced Google Images that people refer to Old Google Images. There is a lot of talks on the internet how Google Images are better than Google Lens and they want their favorite Old Google Images back. Many people will tell you that Google Lens' - 'Find image source' and Old Google Images work very similar to each other, they both give you duplicates of your image, somewhere on a website. I've done little bit of research with both and found that 'Find image source' from Google Lens worked better with my use case, where i got more results from different websites and when tested on Old Google Images, it gave me results only from Facebook groups and when I visited the URL, it simply wasn't there, reason was that the image was posted in the group and was indexed badly i guess, but point stands that results weren't useful. Interesting thing is that both gave different results, despite one being more useful than the other, one had results that other didn't so maybe depending on your use case Old Google Images could also be useful, maybe even more useful than 'Find image source'. On default Old Google Images isn't turned on, it is only Google Lens, so if you visit the Settings, you'll see option to have only Google Lens (which is default), only Old Google Images, or both."} image={require('../assets/image/reverse.jpg')} />
      <Tip title={"People Search"} description={"People search nowadays is harder than it used to be, reason for that is that Google has changed way their search engine works and now it works differently. People have been saying that Google Lens biggest purpose is to sell you products and things from its search engine and that's why it's not as good with people finding anymore and I can't really say otherwise either. Yandex has better people search compared to other general purpose reverse image searches, especially if the person you're searching is from Eastern Europe or is known there, either way Yandex has a chance of being better than Google Lens, no matter you're searching for. Other search engines are not that realiable when it comes to people searching, and considerably fall off compared to Yandex Images and Google Lens. Just to note that there exist services and websites that are designed solely for finding faces and people, which are not included in this app, considering Sherlock is free and those services cost money."} image={require('../assets/image/people.jpg')} />
      <Tip title={"Google Lens"} description={"Google Lens is a powerful tool that lets you search for either same or similar images on the internet that have been indexed by Google. Google Lens could be used for finding either exact or similar things from the uploaded photo, like food, clothes and items, plant names etc. there are two main ways to use Google Lens. The first is to use its cropping/selecting only thing that you want to search, for example for there are multiple people in the photo and you only want to search for something only one is wearing, then select the clothes on that person and wait for it to update, you'll see new results on your right. The second way to use is its ability to find exact pictures on the internet, if that's what you want. Upload a picture that you want to see duplicates of, search and after Google Lens has been loaded press on 'Find image source' on the top of the image, like the button says this helps you find source, more information about the picture or simply find out which websites have the duplicate images. "} image={require('../assets/image/google.jpg')} />
      <Tip title={"Yandex"} description={"Yandex is Russian based reverse image search engine. If you search a bit, you'll find number of people arguing between Yandex Images and Google Lens' efficiency, especially when according to people (and me), Google Lens has gotten less better results when it comes to people, while its main competitor Yandex is fairly good at finding people especially if they're from Eastern Europe. Yandex also has selection feature, where you're presented with crop-like moving square on your picture and can select what you need to search, for example if you uploaded an image of multiple items and you want to search for certain item in the image, then you can 'point' selection to that item and Yandex will show you more of similar items, Google Lens can also do the same, so if this is the functionality you need at the moment, it is recommended that you use both of these search engines. When searching on Yandex, you might see images that have Russian text below them, this doesn't mean Yandex Images search engine is configured for Russian, just that image is from Russian speaking website and it is referenced there."} image={require('../assets/image/yandex.jpg')} />
      <Tip title={"Videos"} description={"If you're trying to find any type of Video, you need to screenshot the thumbnail of the video and upload it on Sherlock, or you might need to find a point in video where you might think people would share it most and upload & search it on Sherlock. Currently that is the best bet for finding Videos from a snippet or a trailer."} image={require('../assets/image/video.jpg')} />
      <Tip title={"Social Media Posts"} description={"If you come across an image of a social media post, then you can actually find that post with the help of Google Lens. First get the image and upload it on Sherlock, then once Google Lens loads up, notice three different options below the image. Search is on as default, and you have two other options which are Text and Translate, in this case you press on Text and then Select All button on your right, after the which you should see associated post(s). You can also use Translate function to translate image text to your desired language."} image={require('../assets/image/post.jpg')} />
      <Tip title={"Movies/Series"} description={"If you come across one of those Instagram page reels that post the movie but not the title, I have good news for you. Screenshot what you think is pretty important and/or memorable moment from the reel or a video and upload & search in Sherlock. Thankfully, it is pretty easy to detect movies nowadays, all search engines, maybe except Tineye will tell you the name of the movie. This also applies on TV Series as well."} image={require('../assets/image/movies.jpg')} />
      <Tip title={"Plants"} description={"One of the functionalities of reverse image searching is finding type of plants from a picture. You take a picture of a flower, or maybe you find image of a flower online and then upload in this app, if the picture is fairly clean, it should tell you exactly kind of flower it is. Google Lens is currently the best for these types of searches."} image={require('../assets/image/plants.jpeg')} />
      <Tip title={"Food"} description={"If you come across image of a meal online and you want to know what it is to perhaps make it yourself later, you can use reverse image search engines here to find the name of the meal by uploading the image from Sherlocks' upload button and searching for it. Google Images used to work better but Google Lens is better nowadays, as it is designed specifically for these kind of searches."} image={require('../assets/image/food.jpg')} />
      <Tip title={"Items"} description={"For clothes, products or items, in general all can be searched by reverse image search engines. Upload and search your chosen image, once you're on Google Lens page you select the item in the picture that you want to see more of and just wait, after a bit you'll see more suggestions on your right. "} image={require('../assets/image/items.jpg')} />
      <Tip title={"Comics/Manga"} description={"You might come across poster of Comics, maybe panel of a Manga on the internet. People usually not put source in title of post since people that see the post and want to know the name of Comics/Manga start to ask in the comments section to find out the title, which boosts posters engagement, what you can do instead is put the posts image in Sherlocks upload and search function and find the source. Note that you might need to use selection function from search engines. You'll get desired results according to how much character/panel/poster from image is posted on the internet, so more popular the works, easier it'll be. Note that Comics will be found most easily. With Manga you might need to select actual characters from the panel to see better results. If you're searching for Webtoons, unless they're big names, you most likely won't find them."} image={require('../assets/image/comics.jpg')} />
      <Tip title={"Sherlock"} description={"None of the Search Engines are made by me, neither have I worked on any of them. Sherlock is designed for your convenience, so you don't have to type in 5 URLs every single time you need to reverse image search and pick the same image for each of those, every single time. This app also has couple different features that I think other apps don't, so I believe Sherlock can be of use for you, wether to save time or to learn better reverse image searching."} image={require('../assets/image/sherlock.jpg')} />

    </View>
  );
};

export default Tips;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
