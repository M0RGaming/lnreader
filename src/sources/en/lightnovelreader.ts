import * as cheerio from 'cheerio';
import { SourceChapter, SourceChapterItem, SourceNovelItem } from '../types';

const sourceId = 111;
const sourceName = 'LightNovelReader';
const baseUrl = 'https://lightnovelreader.org';
const searchUrl = 'https://lightnovelreader.org/search/autocomplete?dataType=json&query=';

const popularNovels = async (page: number) => {
  let totalPages = 306;
  const url = `${baseUrl}/ranking/top-rated/${page}`;

  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels: SourceNovelItem[] = [];

  loadedCheerio('.category-items > ul > li').each(function () {
    const novelUrl = baseUrl + loadedCheerio(this).find('.category-name > a').attr('href');

    const novelName = loadedCheerio(this).find('.category-name > a').text();
    const novelCover = loadedCheerio(this).find('.category-img > a > img').attr('src');

    const novel = {
      sourceId,
      novelName,
      novelCover,
      novelUrl,
    };

    novels.push(novel);
  });

  return { totalPages, novels };
};
//TODO: DO THIS
const parseNovelAndChapters = async (novelUrl: string) => {
  const url = novelUrl;

  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novel;

  const novelName = loadedCheerio('.block-title > h1').text();

  const novelCover =
    baseUrl + loadedCheerio('.novel-cover > a > img').attr('src');

  let author, artist, genre, summary, status;

  loadedCheerio('.novel-detail-item').each(function () {
    const detailName = loadedCheerio(this)
      .find('.novel-detail-header > h6')
      .text();
    const detail = loadedCheerio(this).find('.novel-detail-body').text().trim();

    switch (detailName) {
      case 'Genre':
        genre = detail.trim().replace(/\s{2,}/g, ',');

        break;
      case 'Author(s)':
        author = detail;
        break;
      case 'Artist(s)':
        artist = detail;
        break;
      case 'Description':
        summary = detail;
        break;
      case 'Status':
        status = detail;
        break;
    }
  });

  let chapters: SourceChapterItem[] = [];

  loadedCheerio('.panel').each(function () {
    let volumeName = loadedCheerio(this).find('h4.panel-title').text();

    loadedCheerio(this)
      .find('ul.chapter-chs > li')
      .each(function () {
        const chapterUrl = baseUrl + loadedCheerio(this).find('a').attr('href');

        let chapterName = loadedCheerio(this).find('a').text();

        const releaseDate = null;

        if (volumeName.includes('Volume')) {
          chapterName = volumeName + ' ' + chapterName;
        }

        const chapter = {
          chapterName,
          releaseDate,
          chapterUrl,
        };

        chapters.push(chapter);
      });
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

const parseChapter = async (novelUrl: string, chapterUrl: string) => {
  const url = chapterUrl;

  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('.block-title > h1').find('a').remove();

  const chapterName = loadedCheerio('.block-title > h1')
    .text()
    .replace(' - ', '');

  loadedCheerio('.alert').remove();
  loadedCheerio('.hidden').remove();
  loadedCheerio('iframe').remove();
  loadedCheerio('button').remove();
  loadedCheerio('.hid').remove();
  loadedCheerio('center').remove();
  loadedCheerio(
    'div[style="float: left; margin-top: 20px; font-style: italic;margin-left: 50px; font-size: 14px;"]',
  ).remove();
  loadedCheerio(
    'div[style="float:left;margin-top:15px;margin-bottom:15px;"]',
  ).remove();

  const chapterText = loadedCheerio('.desc').html() || '';

  const chapter: SourceChapter = {
    sourceId: 2,
    novelUrl,
    chapterUrl,
    chapterName,
    chapterText,
  };

  return chapter;
};

const searchNovels = async (searchTerm: string) => {
  let url = `${searchUrl}${searchTerm}`;

  //console.log(url)
  const response = await fetch(url);
  //console.log(response)
  const body = await response.json();
  if (body.length == 0) {
    return []
  }
  //console.log(body.results)

  //let body = await result.json();



  let novels: SourceNovelItem[] = [];

  body['results'].forEach((r: any) => {
    const novelUrl = r['link']
    const novelName = r['original_title']
    const novelCover = r['image']

    const novel = {
      sourceId,
      novelName,
      novelCover,
      novelUrl,
    };

    novels.push(novel);
  });

  return novels;
};

const LightNovelReaderScraper = {
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};

export default LightNovelReaderScraper;
