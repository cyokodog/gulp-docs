const GulpDocs = require('./index');

GulpDocs.defineTask({

  // ルートPATH
  rootPath: './docs',

  // mdファイルを管理する場所
  srcPath: '/src',

  // バンドルするjsのエントリポイント
  bundleEntryPath: '/scripts/index.js',

  indexesSort: [
    {key: 'date', isDesc: true},
    {key: 'no'}
  ],

  // グルーピングするキーワード
  groupingKeys: [
    { id: 'category', title: 'CATEGORY'},
    { id: 'tags',     title: 'TAGS'}
  ],

  // グルーピング用画面に適用するテンプレート
  groupTemplateFile: 'post.html',

  // ページ設定
  pages: {
    blog: {
      title: 'BLOG',
      templateFile: 'post.html'
    },
    about: {
      title: 'ABOUT',
      templateFile: 'page.html'
    }
  }
});
