const GulpDocs = require('./index');

GulpDocs.defineTask({

  // ルートPATH
  rootPath: './docs',

  // グルーピングするキーワード
  groupingKeys: [
    { id: 'category', title: 'CATEGORY'},
    { id: 'tags',     title: 'TAGS'}
  ],

  // ページ設定
  pages: {
    blog: {
      isBlog: true,
      title: 'BLOG'
    },
    profile: {
      title: 'PROFILE'
    }
  }
});
