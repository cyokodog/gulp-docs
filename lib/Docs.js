/*global Buffer*/

'use strict';

const through = require('through2');
const fs = require('fs-extra');
const Doc = require('node-docs');
const DocsGroup = require('./DocsGroup');

/**
 * ドキュメントサイトを生成する
 */
class Docs {

  constructor (){

  }

  /**
   * ドキュメントのインデックスを生成する
   */
  static indexing (params){

    const config = Object.assign({
      pageId: '',
      indexDest: '',
      noIndexingHref: [],
      groupingKeys: '',
      groupIndexDest: '',
      groupDocDest: '',
      docDest: ''
    }, params);

    if( !config.pageId ) throw new Error('Docs.indexing: pageIdが指定されてません');
    if( !config.indexDest ) throw new Error('Docs.indexing: indexDestが指定されてません');

    const docsGroup = new DocsGroup(params);
    const indexes = [];
    const transform = function(file, enc, cb){
      const href = '/' + file.path.split(file.base)[1];

      if( !(config.noIndexingHref||[]).some( v => v === href) ){
        const doc = new Doc();
        const index = doc.parse({
          srcDoc: file.contents.toString('utf8')
        }).getIndex();

        index.href = href;
        index.pageId = config.pageId;
        index.pageTitle = config.pageTitle;
        index.pageHref = config.pageHref;
        indexes.push(index);
        docsGroup.setIndexes(index);
      }
      this.push(file);
      cb();
    };
    const flush = cb => {
      if(!fs.existsSync(config.indexDest)) fs.mkdirpSync(config.indexDest);
      fs.writeFileSync(config.indexDest + '/' + config.pageId + '.json', JSON.stringify(indexes), {encoding: 'utf-8'});
      docsGroup.writeGroupFile();
      cb();
    };
    return through.obj(transform, flush);
  }

  /**
   * テンプレートエンジンによるレンダリングを行う
   */
  static render (params){
    const config = Object.assign({
      templateFile: '',
      templatePath: '',
      indexPath: '',
      indexPages: '',
indexingOnlyHref: [],
indexing: true,
      pageId: '',
      groupingKeys: '',
      groupIndexDest: ''
    }, params);

    if( !config.templateFile ) throw new Error('Docs.render: templateFileが指定されてません');
    if( !config.templatePath ) throw new Error('Docs.render: templatePathが指定されてません');

    const docsGroup = new DocsGroup(params);
    const data = {
      allIndexes: {},
      groups: []
    };
    if( config.indexPages && config.indexPages.length && config.indexPath) {
      config.indexPages.forEach(pageId => {
        const jsonString = fs.readFileSync(config.indexPath + '/' + pageId + '.json', 'utf-8');
        data.allIndexes[pageId] = JSON.parse(jsonString);
      });
    }
    if( config.pageId && data.allIndexes[config.pageId] ){
      data.indexes = data.allIndexes[config.pageId];
    }

    docsGroup.bindToDoc(data);

    const transform = function(file, enc, cb){
      const doc = new Doc();
      doc.parse({
        srcDoc: file.contents.toString('utf8')
      });

      const href = '/' + file.path.split(file.base)[1];
      const index = doc.getIndex();
      if( data.indexes ){
        Object.assign(index, data.indexes.find(item => item.href === href));
      }

index.href = index.href || href;
index.pageId = index.pageId || config.pageId;
index.pageTitle = index.pageTitle || config.pageTitle;
index.pageHref = index.pageHref || config.pageHref;

      docsGroup.bindToGroupDoc(index, data);

      Object.assign(doc.getData(), data);

      doc.render({
        // template: fs.readFileSync(config.templatePath + '/' + (doc.getIndex().template || config.templateFile), 'utf-8'),
        template: fs.readFileSync(config.templatePath + '/' + (config.templateFile), 'utf-8'),
        // template: fs.readFileSync(config.templatePath + '/__page.html', 'utf-8'),
        templatePath: config.templatePath
      });

      const html = doc.getHtml();

      file.contents = Buffer(html);
      this.push(file);
      cb();
    };
    const flush = cb => {
      cb();
    };
    return through.obj(transform, flush);
  }

}

module.exports = Docs;
