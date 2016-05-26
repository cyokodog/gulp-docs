"use strict";

const through = require("through2");
const fs = require('fs-extra');
const Doc = require('node-docs');

/**
 * ドキュメントサイトを生成する
 */
class Docs {

  constructor (){
    
  }

  /**
   * ドキュメントのインデックスを生成する
   */
  indexing (params){
    const config = Object.assign({
      pageId: '',
      indexDest: '',
      noIndexingHref: [],
      indexTitle: '',
      groupingKeys: '',
      groupIndexDest: '',
      groupDocDest: '',
      docDest: ''
    }, params);

    if( !config.pageId ) throw new Error('Docs.indexing: pageIdが指定されてません');
    if( !config.indexDest ) throw new Error('Docs.indexing: indexDestが指定されてません');

    const indexes = [];
    const groups = {};
    const transform = function(file, enc, cb){
      const href = '/' + file.path.split(file.base)[1];

      if( !(config.noIndexingHref||[]).some( v => v === href) ){

      const doc = new Doc();
      const index = doc.parse({
        srcDoc: file.contents.toString('utf8')
      }).getIndex();

      index.href = '/' + file.path.split(file.base)[1];
      indexes.push(index);

      if( config.groupingKeys ){
        // config.groupingKeys.forEach(key => {
        Object.keys(config.groupingKeys).forEach(key => {
          const groupId = index[key];
          if( groupId ){
// console.log(key,config.groupingKeys[key].title)


            const title = index[key + '_title'];
            const group = groups[key] || (groups[key] = {});
            const section = (group[groupId] = group[groupId] || {id: groupId, indexes: []});
            section.title = index[key + '_title'] || section.title || groupId;
            section.href = '/' + config.pageId + '/' + key + '/' + groupId;
            section.indexes.push(index);
            section.indexes.forEach(index => index[key + '_title'] = section.title);
          }
        });
      }



      }


      this.push(file);
      cb();
    }
    const flush = cb => {

      if(!fs.existsSync(config.indexDest)) fs.mkdirpSync(config.indexDest);

const indexArr = {
  title: config.indexTitle,
  items: indexes
};

      // fs.writeFileSync(config.indexDest + '/' + config.pageId + '.json', JSON.stringify(indexes), {encoding: 'utf-8'});
      fs.writeFileSync(config.indexDest + '/' + config.pageId + '.json', JSON.stringify(indexArr), {encoding: 'utf-8'});

      if( config.groupIndexDest ){
        const groupsArr = [];
        Object.keys(groups).forEach(key => {
          const path = config.groupIndexDest + '/' + params.pageId;
          if(!fs.existsSync(path)) fs.mkdirpSync(path);
          groupsArr.push({
            id: key,
            title: config.groupingKeys[key].title,
            items: groups[key]
          });
          // fs.writeFileSync(path + '/' + key + '.json', JSON.stringify(groups[key]), {encoding: 'utf-8'});
          fs.writeFileSync(path + '/' + key + '.json', JSON.stringify(groupsArr), {encoding: 'utf-8'});
        });
      }

      if( config.groupDocDest ){
        Object.keys(groups).forEach(key => {
          Object.keys(groups[key]).forEach(groupId => {
            const path = config.groupDocDest + '/' + params.pageId + '/' + key + '/' + groupId;


            const groupIndexes = JSON.stringify({
              title: groups[key][groupId].title,
              items: groups[key][groupId].indexes
            });

            // const contetns = '---\ntitle: ' + groups[key][groupId].title + '\n__groupIndexes: ' + JSON.stringify(groups[key][groupId].indexes) + '\ntemplate: list.html\n---';
            const contetns = '---\ntitle: ' + groups[key][groupId].title + '\n__groupIndexes: ' + groupIndexes + '\ntemplate: list.html\n---';
            // const contetns = '---\ntitle: ' + groups[key][groupId].title + '\ntemplate: group.html\n---';
            if(!fs.existsSync(path)) fs.mkdirpSync(path);
            fs.writeFileSync(path + '/index.md', contetns, {encoding: 'utf-8'});
          });

        });
      }

      cb();      
    }
    return through.obj(transform, flush);
  }

  /**
   * テンプレートエンジンによるレンダリングを行う
   */
  render (params){
    const config = Object.assign({
      templateFile: '',
      templatePath: '', 
      indexPath: '',
      indexPages: '',
indexingOnlyHref: [],
      pageId: '',
      groupingKeys: '',
      groupIndexDest: '',
    }, params);

    if( !config.templateFile ) throw new Error('Docs.render: templateFileが指定されてません');
    if( !config.templatePath ) throw new Error('Docs.render: templatePathが指定されてません');

    const data = {
      allIndexes: {},
      group: {}
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

    if( config.groupingKeys ){
      // config.groupingKeys.forEach(key => {
      Object.keys(config.groupingKeys).forEach(key => {



        const path = config.groupIndexDest + '/' + config.pageId + '/' + key + '.json';
        if( fs.existsSync(path) ){
          const jsonString = fs.readFileSync(path, 'utf-8');
          data.group[key] = JSON.parse(jsonString);
        }

      });
    }



    const transform = function(file, enc, cb){
      const doc = new Doc();
      doc.parse({
        srcDoc: file.contents.toString('utf8')
      });

// console.log('/' + file.path.split(file.base)[1])


      const groupIndexes = doc.getIndex().__groupIndexes;
      if( groupIndexes ){
        data.indexes = groupIndexes; 
      }

      Object.assign(doc.getData(), data);

      doc.render({
        template: fs.readFileSync(config.templatePath + '/' + (doc.getIndex().template || config.templateFile), 'utf-8'),
        templatePath: config.templatePath
      });

      const html = doc.getHtml();

      file.contents = Buffer(html);
      this.push(file);
      cb();
    }
    const flush = cb => {
      cb();      
    }
    return through.obj(transform, flush);
  }

}

module.exports = Docs;
