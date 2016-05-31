module.exports = (params) => {

  const defaults = {

    // 生成したドキュメントを出力する場所
    docOutputPath: '/dest',

    // ドキュメントのリストデータを出力する場所
    indexOutputPath: '/dest/_index',
    
    // テンプレートファイルの場所
    templatePath: '/theme/default',

    // ドキュメントのグルーピングデータを出力する場所
    groupIndexOutputPath: '/dest/_group',

    // グルーピングで自動生成したページファイルを一時出力する場所
    groupDocOutputPath: '/__temp/group_doc',

    // グルーピングするキーワード
    groupingKeys: [],

    // グルーピング用画面に適用するテンプレート
    groupTemplateFile: 'post.html',

    indexPages: []

  }

  const settings = Object.assign({}, defaults);

  // PATH関連にrootPathを追加
  if( params.rootPath ){
    [
      'docOutputPath',
      'indexOutputPath',
      'templatePath',
      'groupIndexOutputPath',
      'groupDocOutputPath',
    ].forEach( name => {
      settings[name] = params.rootPath + defaults[name];
    })
  }

  Object.assign(settings, params);

  const pageDefaults = {
    title: '',
    href: '/__pageId__/index.html',
    templateFile: 'page.html',
    src: '/src/**/__pageId__/**/*.md',
    indexing: true,
    noIndexingHref: '/__pageId__/index.html'
  };

  if( params.pages ){
    const pages = {};
    Object.keys(params.pages).forEach((key) => {
      const page = params.pages[key];
      const pageSettings = Object.assign({}, pageDefaults, page);

      if( page.isBlog ) pageSettings.templateFile = 'post.html';
      [
        'href',
        'src',
        'noIndexingHref'
      ].forEach( name => {
        pageSettings[name] = pageSettings[name].replace('__pageId__', key);
        if( name === 'src') pageSettings[name] = params.rootPath + pageSettings[name];
        if( /^(src|noIndexingHref)$/.test(name) ){
          pageSettings[name] = [pageSettings[name]];
        }
      })

      pages[key] = pageSettings;
    });
    settings.pages = pages;
  }

  settings.pages = settings.pages || {};

  const page = settings.pages.page = Object.assign({}, pageDefaults, {
    src: [
      params.rootPath + '/src/*.md',
    ],
    indexingOnlyHref: [],
    href: '',
    noIndexingHref: ''
  });
  Object.keys(params.pages).forEach((key) => {
    page.src.push(params.rootPath + '/src/**/' + key + '/index.md');
    page.indexingOnlyHref.push('/' + key + '/index.html');
  });

  // Object.keys(settings.groupingKeys).forEach(key => {
  //   settings.pages[key] = {
  //     templateFile: settings.groupTemplateFile,
  //     src: [settings.groupDocOutputPath + '/**/*.md'],
  //     indexing: false
  //   }
  // });
  settings.pages.group = {
    templateFile: settings.groupTemplateFile,
    src: [settings.groupDocOutputPath + '/**/*.md'],
    indexing: false
  }



  settings.indexPages = Object.keys(settings.pages).filter(pageId => {
    const page = settings.pages[pageId];
    return page.indexing;
  });

  return settings;
  
};