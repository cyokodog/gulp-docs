module.exports = (params) => {

  const defaults = {

    // mdファイルを管理する場所
    srcPath: '/src',

    // 生成したドキュメントを出力する場所
    docOutputPath: '/dest',

    // ドキュメントのリストデータを出力する場所
    indexOutputPath: '/dest/_index',

    // テンプレートファイルの場所
    templatePath: '/theme/default',

    // テンプレート資産の場所
    templateAssetsPath: '/assets',

    // バンドルするjsのエントリポイント
    bundleEntryPath: '/scripts/index.js',

    // ドキュメントのグルーピングデータを出力する場所
    groupIndexOutputPath: '/dest/_group',

    // グルーピングで自動生成したページファイルを一時出力する場所
    groupDocOutputPath: '/__temp/group_doc',

    // グルーピングするキーワード
    groupingKeys: [],

    // グルーピング用画面に適用するテンプレート
    groupTemplateFile: 'post.html',

    indexesSort: [
      {key: 'date', isDesc: true},
      {key: 'no'}
    ],

    indexPages: []

  };

  const settings = Object.assign({}, defaults);

  Object.assign(settings, params);

  // PATH関連にrootPathを追加
  if( settings.rootPath ){
    [
      'srcPath',
      'docOutputPath',
      'indexOutputPath',
      'templatePath',
      'groupIndexOutputPath',
      'groupDocOutputPath'
    ].forEach( name => {
      settings[name] = settings.rootPath + settings[name];
    });
  }

  const pageDefaults = {
    title: '',
    href: '/__pageId__/index.html',
    templateFile: 'page.html',
    src: settings.srcPath + '/**/__pageId__/**/*.md',
    indexing: true,
    noIndexingHref: '/__pageId__/index.html'
  };

  if( settings.pages ){
    const pages = {};
    Object.keys(settings.pages).forEach((key) => {
      const page = settings.pages[key];
      const pageSettings = Object.assign({}, pageDefaults, page);

      [
        'href',
        'src',
        'noIndexingHref'
      ].forEach( name => {
        pageSettings[name] = pageSettings[name].replace('__pageId__', key);
        // if( name === 'src') pageSettings[name] = settings.rootPath + pageSettings[name];
        if( /^(src|noIndexingHref)$/.test(name) ){
          pageSettings[name] = [pageSettings[name]];
        }
      });

      pages[key] = pageSettings;
    });
    settings.pages = pages;
  }

  settings.pages = settings.pages || {};

  const page = settings.pages.page = Object.assign({}, pageDefaults, {
    src: [
      settings.srcPath + '/*.md'
    ],
    indexingOnlyHref: [],
    href: '',
    noIndexingHref: ''
  });

  Object.keys(settings.pages).forEach((key) => {
    page.src.push(settings.srcPath + '/**/' + key + '/index.md');
    page.indexingOnlyHref.push('/' + key + '/index.html');
  });

  settings.pages.group = {
    templateFile: settings.groupTemplateFile,
    src: [settings.groupDocOutputPath + '/**/*.md'],
    indexing: false
  };

  settings.indexPages = Object.keys(settings.pages).filter(pageId => {
    const page = settings.pages[pageId];
    return page.indexing;
  });

  return settings;

};
