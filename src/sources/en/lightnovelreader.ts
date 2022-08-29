import * as cheerio from 'cheerio';
import { SourceChapter, SourceChapterItem, SourceNovelItem } from '../types';

const sourceId = 114;
const sourceName = 'LightNovelReader';
const baseUrl = 'https://lightnovelreader.org';
const searchUrl =
  'https://lightnovelreader.org/search/autocomplete?dataType=json&query=';

const popularNovels = async (page: number) => {
  let totalPages = 306;
  const url = `${baseUrl}/ranking/top-rated/${page}`;

  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels: SourceNovelItem[] = [];

  loadedCheerio('.category-items > ul > li').each(function () {
    const novelUrl =
      baseUrl + loadedCheerio(this).find('.category-name > a').attr('href');

    const novelName = loadedCheerio(this).find('.category-name > a').text();
    const novelCover = loadedCheerio(this)
      .find('.category-img > a > img')
      .attr('src');

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

const parseNovelAndChapters = async (novelUrl: string) => {
  const url = novelUrl;
  const result = await fetch(url);
  const body = await result.text();
  const loadedCheerio = cheerio.load(body);
  let novel, novelName, author, artist, genre, summary, status;

  //Novel Cover
  const novelCover = loadedCheerio('.novels-detail-left > img').attr('src');

  //Novel Description and Name (They are headers with no specific class)
  loadedCheerio('.section-header-title > h2').each(function () {
    let text = loadedCheerio(this).text();
    switch (text) {
      case 'DESCRIPTION':
        summary = loadedCheerio(this)
          .parentsUntil('.col-md-12')
          .parent()
          .next()
          .text()
          .trim();
        break;
      case 'CHAPTERS':
        break;
      case 'COMMENTS':
        break;
      default:
        novelName = text;
    }
  });

  //Details about the novel
  loadedCheerio('.novels-detail-right > ul > li').each(function () {
    let detailName = loadedCheerio(this)
      .find('.novels-detail-right-in-left')
      .text();
    let detail = loadedCheerio(this)
      .find('.novels-detail-right-in-right')
      .text()
      .trim();
    switch (detailName) {
      case 'Genres:':
        genre = detail.replace(/\s{2,}/g, ',');
        break;
      case 'Author(s):':
        author = detail;
        break;
      case 'Artist(s):':
        artist = detail;
        break;
      case 'Description':
        summary = detail;
        break;
      case 'Status:':
        status = detail;
        break;
    }
  });

  //Chapters
  let chapters: SourceChapterItem[] = [];
  loadedCheerio('.novels-detail-chapters > ul > li > a').each((j, k: any) => {
    let chapterName = k.children[0].data.trim().replace('CH ', 'Chapter ');
    let chapterUrl = k.attribs.href;
    let releaseDate = null;
    const chapter = {
      chapterName,
      releaseDate,
      chapterUrl,
    };
    chapters.unshift(chapter); // items are sorted in terms of the newest first, so order it backwards instead
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
  const result = await fetch(chapterUrl);
  const body = await result.text();
  const loadedCheerio = cheerio.load(body);
  const chapterName =
    loadedCheerio('.section-header').find('span').text().trim() ||
    loadedCheerio('title').text().trim();

  // Remove the stuff that's supposed to be hidden
  loadedCheerio('.hidden').remove();
  loadedCheerio('.display-hide').each(function () {
    let element = loadedCheerio(this);
    element.prev('br').remove();
    element.next('br').remove();
    element.remove();
  });
  // Remove the Sponsored Content texts
  loadedCheerio('center:contains("Sponsored Content")').each(function () {
    let element = loadedCheerio(this);
    element.prev('p:empty').remove();
    element.next('p:empty').remove();
    element.remove();
  });
  //Remove any empty centers (usually used on the website to place an ad)
  loadedCheerio('center').each(function () {
    let element = loadedCheerio(this);
    if (element.text() === '') {
      element.remove();
    }
  });

  const chapterText = loadedCheerio('#chapterText').html() || '';
  const chapter: SourceChapter = {
    sourceId,
    novelUrl,
    chapterUrl,
    chapterName,
    chapterText,
  };
  return chapter;
};

const searchNovels = async (searchTerm: string) => {
  let url = searchUrl + searchTerm;
  const response = await fetch(url);
  const body = await response.json();
  //Any searches less than 3 do not return any data
  if (body.length === 0) {
    return [];
  }

  let novels: SourceNovelItem[] = [];
  body.results.forEach((r: any) => {
    const novelUrl = r.link;
    const novelName = r.original_title;
    const novelCover = r.image;
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
