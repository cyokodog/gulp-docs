const GulpDocs = require('./index');

GulpDocs.defineTask({

  // ルートPATH
  rootPath: './docs',

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
    profile: {
      title: 'PROFILE',
      templateFile: 'page.html'
    }
  }
});
