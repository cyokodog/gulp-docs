'use strict';

const fs = require('fs-extra');

class DocsGroup {

  constructor (params){
    const config = this.config = Object.assign({
      pageId: '',
      pageTitle: '',
      indexing: '',
      groupingKeys: '',
      groupIndexDest: '',
      groupDocDest: ''
    }, params);
    if( !config.pageId ) throw new Error('DocsGroup: pageIdが指定されてません');
    if( !config.groupingKeys ) throw new Error('DocsGroup: groupingKeysが指定されてません');

    const GROUPS = this.GROUPS = [];
    config.groupingKeys.forEach(item => {
      const group = Object.assign({
        id: '',
        title: '',
        items: []
      }, item);
      group.title = group.title || group.id;
      if( !group.id ) throw new Error('groupingKeys.idが指定されてません');
      GROUPS.push(group);
    });
  }

  setIndexes (index){
    const config = this.config;
    const GROUPS = this.GROUPS;

    GROUPS.forEach(group => {
      const groupValue = index[group.id];
      const groupTitle = index[group.id + '_title'];
      if( groupValue ){
        let item = group.items.find(item => {
          return item.id === groupValue;
        });
        if( !item ){
          item = {
            id: groupValue,
            href: '/' + config.pageId + '/' + group.id + '/' + groupValue,
            title: '',
            indexes: []
          };
          group.items.push(item);
        }
        item.title = groupTitle || item.title || groupValue;
        item.indexes.push(index);
      }
    });
  }

  writeGroupFile (){
    const config = this.config;
    const GROUPS = this.GROUPS;

    if( config.groupIndexDest ){
      const path = config.groupIndexDest + '/' + config.pageId;
      if(!fs.existsSync(path)) fs.mkdirpSync(path);
      GROUPS.forEach(group => {
        if(group.items.length){
          fs.writeFileSync(path + '/' + group.id + '.json', JSON.stringify(group), {encoding: 'utf-8'});
        }
      });
    }

    if( config.groupDocDest ){
      GROUPS.forEach(group => {
        if(group.items.length){
          group.items.forEach(item => {
            const path = config.groupDocDest + '/' + config.pageId + '/' + group.id + '/' + item.id;
            if(!fs.existsSync(path)) fs.mkdirpSync(path);
            const con = `---
title: ${item.title}
pageId: ${config.pageId}
pageTitle: ${config.pageTitle}
pageHref: ${config.pageHref}
groupId: ${group.id}
groupValue: ${item.id}
---`;
            fs.writeFileSync(path + '/index.md', con, {encoding: 'utf-8'});
          });
        }
      });
    }
  }

  bindToDoc (data){
    const config = this.config;
    const GROUPS = this.GROUPS;

    if(config.indexing){
      if( config.groupIndexDest ){
        data.groups = [];
        GROUPS.forEach(group => {
          const path = config.groupIndexDest + '/' + config.pageId + '/' + group.id + '.json';
          if( fs.existsSync(path) ){
            const json = fs.readFileSync(path, 'utf-8');
            data.groups.push(JSON.parse(json));
          }
        });
      }
    }
  }

  bindToGroupDoc (groupIndex, data){
    const config = this.config;
    const GROUPS = this.GROUPS;

    if(!config.indexing){
      const jsonString = fs.readFileSync(config.indexPath + '/' + groupIndex.pageId + '.json', 'utf-8');
      data.indexes = JSON.parse(jsonString);
      data.groups = [];
      GROUPS.forEach(group => {
        const path = config.groupIndexDest + '/' + groupIndex.pageId + '/' + group.id + '.json';
        if( fs.existsSync(path) ){
          const jsonText = fs.readFileSync(path, 'utf-8');

          // const json = data.groups[group.id] = JSON.parse(jsonText);
          const json = JSON.parse(jsonText);
          data.groups.push(json);

          if( group.id === groupIndex.groupId ){
            data.group = json.items.find(item => item.id === groupIndex.groupValue);
          }
        }
      });
    }
  }
}

module.exports = DocsGroup;
