// extract-game.js — all screens for ONE game, grouped by category section.
// Paste into mcp__browser__execute_js (challenge cleared first). Edit GAME_ID.
// gameData.php?id=N returns the WHOLE game in one response (no pagination).
// Returns {id, game, year, totalScreens, sections:[{section,id,screens:[{imageid,title,size,full,thumb,scrn}]}], flat:[...]}
//   full  = full-res image URL (download THIS for the agent to view)
//   title = the screen's UI-element categories (comma-separated)
//   section = high-level group: Title and System / Modals and Text / Game States /
//             Stats and Resources / Information & Extras / HUD and Overlays
(function(){
  var GAME_ID = 2403;   // <<< EDIT

  function get(url){var x=new XMLHttpRequest();x.open('GET',url,false);x.send(null);return {s:x.status,t:x.responseText||''};}
  var r=get('gameData.php?id='+GAME_ID);
  if(r.s!==200) return JSON.stringify({id:GAME_ID,error:'gameData.php returned '+r.s},null,1);
  var doc=document.implementation.createHTMLDocument(''); doc.documentElement.innerHTML=r.t;

  var titleEl=doc.querySelector('title');
  var gameName=(titleEl?titleEl.textContent:'').replace(/^Game UI Database\s*[-|]\s*/i,'').trim();
  // year lives in a .font_roboto_header_lg element near the title (e.g. "2022")
  var year=null;
  doc.querySelectorAll('.font_roboto_header_lg').forEach(function(e){
    var t=(e.textContent||'').trim(); if(!year && /^(19|20)\d{2}$/.test(t)) year=t;
  });
  var out={id:GAME_ID, game:gameName, year:year, totalScreens:0, sections:[], flat:[]};

  // Walk the document in order, tracking the most recent category heading.
  // Stop collecting at "RELATED TITLES" — that trailing section lists OTHER games, not this game's screens.
  var walker=doc.createTreeWalker(doc.body||doc.documentElement, NodeFilter.SHOW_ELEMENT, null);
  var node, curSection=null, stop=false;
  function pushSection(name,id){ curSection={section:name||'(uncategorised)', id:id||null, screens:[]}; out.sections.push(curSection); }
  pushSection(null,null);
  while((node=walker.nextNode())){
    if(stop) break;
    var cls=node.className||'';
    if(typeof cls==='string' && cls.indexOf('gamedata_category')>=0){
      var name=(node.textContent||'').replace(/\s+/g,' ').replace(/\s*\d+\s*$/,'').trim(); // strip trailing count if any
      if(/RELATED TITLES/i.test(name)){ stop=true; break; }
      pushSection(name, node.id||null);
      continue;
    }
    if(node.hasAttribute && node.hasAttribute('data-imageid')){
      var t=node.getAttribute('data-title')||'';
      // strip any embedded anchor markup (cross-game grids put a link here; game pages put categories)
      var tt=document.createElement('div'); tt.innerHTML=t; var titleText=(tt.textContent||t).replace(/\s+/g,' ').trim();
      var s={
        imageid:node.getAttribute('data-imageid'),
        title:titleText,
        size:node.getAttribute('data-size')||null,
        full:node.getAttribute('href')||null,
        thumb:node.getAttribute('data-thumb')||null,
        scrn:node.getAttribute('data-url')||null
      };
      curSection.screens.push(s);
      out.flat.push(Object.assign({section:curSection.section}, s));
    }
  }
  // drop empty leading "(uncategorised)" if it has no screens
  out.sections=out.sections.filter(function(s){return s.screens.length>0;});
  out.totalScreens=out.flat.length;
  out.sectionSummary=out.sections.map(function(s){return s.section+': '+s.screens.length;});
  return JSON.stringify(out,null,1);
})()
