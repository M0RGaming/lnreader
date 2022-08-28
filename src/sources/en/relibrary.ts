import * as cheerio from 'cheerio';
import { SourceChapter, SourceChapterItem, SourceNovelItem } from '../types';

const sourceId = 112;
const sourceName = 'ReLibrary';
const baseUrl = 'https://re-library.com/';

let urls: any = {
  "https://re-library.com/translations/abyss-domination/": "https://re-library.com/wp-content/uploads/2019/07/abyss-domination.png",
  "https://re-library.com/translations/ace-evolution/": "https://i.imgur.com/ZSuMnxe.jpg?1",
  "https://re-library.com/translations/another-world-transfer-in-game-character/": "https://re-library.com/wp-content/uploads/2019/07/another-world-transfer.png",
  "https://re-library.com/translations/aspirations-for-nation-and-beauty/": "https://re-library.com/wp-content/uploads/2017/01/921fd-0fazv2o.png",
  "https://re-library.com/translations/blue-sky/": "https://re-library.com/wp-content/uploads/2020/05/Blue-Sky-2.jpg",
  "https://re-library.com/translations/the-guilds-cheat-receptionist/": "https://re-library.com/wp-content/uploads/2021/04/guildcheatrep.jpg",
  "https://re-library.com/translations/bu-ni-mi/": "https://re-library.com/wp-content/uploads/2019/07/bu-ni-mu.jpg",
  "https://re-library.com/translations/the-creator-god-was-enslaved-by-her-yandere-sister/": "https://re-library.com/wp-content/uploads/2020/04/Loli-Elf-e1587659777777.jpg",
  "https://re-library.com/translations/the-demon-kings-daughter/": "https://re-library.com/wp-content/uploads/2019/01/165ee-bb0e4-demon-kings-daughter.jpg",
  "https://re-library.com/translations/arifureta/": "https://re-library.com/wp-content/uploads/2019/07/Arifureta-2.jpg",
  "https://re-library.com/translations/female-knight-dark-elf/": "https://re-library.com/wp-content/uploads/2019/08/knight-dark-elf.jpg",
  "https://re-library.com/translations/dragon-princess/": "https://re-library.com/wp-content/uploads/2019/10/Dragon-Princess-cover.jpg",
  "https://re-library.com/translations/heros-redo/": "https://re-library.com/wp-content/uploads/2020/04/Heros-Redo.jpg",
  "https://re-library.com/translations/blade-maiden/": "https://re-library.com/wp-content/uploads/2019/07/demon-sword-maiden.png",
  "https://re-library.com/translations/the-devils-evolution-catalog/": "https://re-library.com/wp-content/uploads/2020/08/Devils-Evolution.jpg",
  "https://re-library.com/translations/https://re-library.com/translations/how-can-the-saintess-be-a-boy/": "https://re-library.com/wp-content/uploads/2020/01/saintess.png",
  "https://re-library.com/translations/high-comprehension-low-strength/": "https://re-library.com/wp-content/uploads/2019/07/HCLS.jpg",
  "https://re-library.com/translations/hero-king/": "https://re-library.com/wp-content/uploads/2020/04/Hero-King-e1587374103108.jpg",
  "https://re-library.com/translations/heros-daughter/": "https://re-library.com/wp-content/uploads/2019/10/Heros-Daughter.jpg",
  "https://re-library.com/translations/magic-language/": "https://re-library.com/wp-content/uploads/2017/01/49029-q4fmcev.jpg",
  "https://re-library.com/translations/my-brother-has-turned-into-a-loli/": "https://re-library.com/wp-content/uploads/2020/05/My-Brother-turned-into-Loli.jpg",
  "https://re-library.com/translations/life-with-a-tail/": "https://re-library.com/wp-content/uploads/2019/12/Life-with-a-Tail.jpg",
  "https://re-library.com/translations/this-overlord-doesnt-care-about-anything/": "https://re-library.com/wp-content/uploads/2020/06/Overlord-1.jpg",
  "https://re-library.com/translations/mysterious-world-beast-god/": "https://re-library.com/wp-content/uploads/2019/07/Beast-God.png",
  "https://re-library.com/translations/levelmaker/": "https://re-library.com/wp-content/uploads/2019/10/Levelmaker.jpg",
  "https://re-library.com/translations/nine-yang-sword-saint/": "https://re-library.com/wp-content/uploads/2019/07/NYSS.png",
  "https://re-library.com/translations/otherworld-nation-founding-chronicles/": "https://i.imgur.com/pyCrFVv.png",
  "https://re-library.com/translations/not-sure-another-world-reincarnation/": "https://re-library.com/wp-content/uploads/2019/09/another-world-reincarnation.jpg",
  "https://re-library.com/translations/rezero/": "https://i.imgur.com/NmNK1w9.jpg?1",
  "https://re-library.com/translations/reborn-as-a-transcendent/": "https://re-library.com/wp-content/uploads/2020/02/reborn-as-transcendence.jpg",
  "https://re-library.com/translations/outcast-magician-and-the-power-of-heretics/": "https://re-library.com/wp-content/uploads/2019/07/no-image.png",
  "https://re-library.com/translations/rinkan-no-madoushi/": "https://i.imgur.com/ReAp227.jpg?1",
  "https://re-library.com/translations/strongest-player-cultivation/": "https://re-library.com/wp-content/uploads/2020/11/Strongest-Player-Cultivation.jpg",
  "https://re-library.com/translations/pupil-of-the-wiseman/": "https://re-library.com/wp-content/uploads/2020/02/wiseman.jpg",
  "https://re-library.com/translations/slutty-chivalrous-woman/": "https://re-library.com/wp-content/uploads/2017/02/4705c-cover-1.jpg",
  "https://re-library.com/translations/reincarnation-into-the-barrier-master/": "https://re-library.com/wp-content/uploads/2019/07/barrier-master-reincarnation.png",
  "https://re-library.com/translations/starting-anew-as-the-new-me/": "https://re-library.com/wp-content/uploads/2019/07/starting-anew.png",
  "https://re-library.com/translations/strongest-swordmans-restart/": "https://re-library.com/wp-content/uploads/2021/10/Swordmans-ReStart.jpg",
  "https://re-library.com/translations/the-ancestor-of-our-sect/": "https://re-library.com/wp-content/uploads/2019/09/cover-1-e1568620761760.jpg",
  "https://re-library.com/translations/song-of-adolescence/": "https://re-library.com/wp-content/uploads/2020/08/Song-of-Adolescence.jpg",
  "https://re-library.com/translations/the-little-villages-ultimate-doctor/": "https://re-library.com/wp-content/uploads/2019/09/Ultimate-Doctor.jpg",
  "https://re-library.com/translations/the-strongest-system/": "https://re-library.com/wp-content/uploads/2019/07/strongest-system-e1562667981294.jpg",
  "https://re-library.com/translations/succubus-life-in-another-world/": "https://re-library.com/wp-content/uploads/2020/07/Succubus-1-1.jpg",
  "https://re-library.com/translations/the-rising-of-the-shield-hero/": "https://re-library.com/wp-content/uploads/2019/08/Shield-Hero.jpg",
  "https://re-library.com/translations/the-author-reincarnated/": "https://re-library.com/wp-content/uploads/2019/07/no-image.png",
  "https://re-library.com/translations/until-two-competitive-girls-bloom-into-lilies/": "https://re-library.com/wp-content/uploads/2020/02/two-girls.jpg",
  "https://re-library.com/translations/vampire-princess/": "https://re-library.com/wp-content/uploads/2020/01/Vampire-Princess-cover.png",
  "https://re-library.com/translations/two-as-one-princesses/": "https://re-library.com/wp-content/uploads/2019/12/Two-as-One-Princesses.jpg",
  "https://re-library.com/translations/the-villainess-becomes-a-commoner/": "https://re-library.com/wp-content/uploads/2021/08/Villainess.jpg",
  "https://re-library.com/translations/vpna-prequel/": "https://re-library.com/wp-content/uploads/2019/07/VPNA.jpg",
  "https://re-library.com/translations/a-wild-last-boss-appeared/": "https://re-library.com/wp-content/uploads/2020/06/Wild-Last-Boss.jpg",
  "https://re-library.com/translations/6-year-old-sage/": "https://re-library.com/wp-content/uploads/2019/07/no-image.png",
  "https://re-library.com/translations/world-of-immortals/": "https://re-library.com/wp-content/uploads/2017/01/dd77b-ajvb3bb.jpg"
}


const popularNovels = async (page: number) => {
  let totalPages = 1
  let url = baseUrl+"translations/"

  let result = await fetch(url);
  let body = await result.text();

  let $ = cheerio.load(body);

  //console.log("Parsing")


  let novels: SourceNovelItem[] = [];

  $('table a').each(function () {
    let ele = $(this)
    let url = ele.attr('href') || ''


    /*
    fetch(url).then((res) => {
      res.text().then((text) => {
        let loadedCheerio = cheerio.load(text);
        console.log(`"${url}": "${loadedCheerio('img.rounded').attr('src')}"`)
      })
    });

    */



    const novel = {
      sourceId,
      novelName: ele.text(),
      novelCover: urls[url] || '',
      novelUrl: url,
    };
    novels.push(novel);
  })

  return { totalPages, novels };
};

const parseNovelAndChapters = async (novelUrl: string) => {
  const url = novelUrl;
  const result = await fetch(url);
  const body = await result.text();
  const $ = cheerio.load(body);
  let novel, novelName, author, artist, genre, summary, status;

  //Novel Cover
  const novelCover = $('img.rounded').attr('src');
  novelName = $('.entry-title').text();

  let desc = $('#synopsis').nextUntil('hr').text()

  let details = $('.entry-content > .rounded td > span')
  summary = `${desc}\n\n${details.text()}`;
  genre = details.nextUntil('p:contains("Category")').next().text().replace("Category:", "")
  author = ""
  artist = ""
  status = details.parent().find("p:contains('Status')").text().replace("Status: ", "") || ""

  //Chapters
  let chapters: SourceChapterItem[] = [];
  $('.su-subpages a').each(function () {
    let loaded = $(this)
    let chapterName = loaded.text().trim();
    let chapterUrl = loaded.attr('href') || '';
    let releaseDate = null;
    const chapter = {
      chapterName,
      releaseDate,
      chapterUrl,
    };
    chapters.push(chapter);
  });

  novel = {
    sourceId,
    sourceName,
    url,
    novelUrl,
    novelName,
    novelCover,
    genre,
    author,
    status,
    artist,
    summary,
    chapters,
  };

  return novel;
};




//TODO: DO PARSE CHAPTER
const parseChapter = async (novelUrl: string, chapterUrl: string) => {
  const result = await fetch(chapterUrl);
  const body = await result.text();
  const $ = cheerio.load(body);
  const chapterName =
    $('.entry-title').text().trim() ||
    $('title').text().trim();

  $('.pgAdWrapper').remove();
  $('.entry-content > .code-block').remove()

  $('.prevPageLink').each(function () {
    let element = $(this);
    element.prev('hr').remove()
    element.nextUntil('hr').remove();
    element.next('hr').remove()
    element.remove();
  });
  $('.sharedaddy').remove()

  const chapterText = $('.entry-content').html() || '';
  const chapter: SourceChapter = {
    sourceId,
    novelUrl,
    chapterUrl,
    chapterName,
    chapterText,
  };
  return chapter;
};





//TODO: DO SEARCH NOVELS
const searchNovels = async (searchTerm: string) => {
  let allDetails = await popularNovels(0)
  let novels = allDetails.novels.filter((x) => {
    return x.novelName.includes(searchTerm)
  })
  return novels
};

const ReLibraryScraper = {
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};

export default ReLibraryScraper;
