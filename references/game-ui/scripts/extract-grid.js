// extract-grid.js — extract every screen tile currently in the page DOM.
// Paste into mcp__browser__execute_js. Use AFTER navigating to a filtered/browse view
// (index.php?set=1&tag=.., ?scrn=<typeID>, ?text=.., ?hex=..) and scrolling to load tiles.
// Handles both data-title shapes: UI-element categories (game page) OR game name+link (set=1 grid).
// Returns {count, screens:[{imageid,title,game,gameId,size,full,thumb,scrn}]} (deduped by imageid).
(function(){
  var seen={}, screens=[];
  document.querySelectorAll('[data-imageid]').forEach(function(node){
    var id=node.getAttribute('data-imageid'); if(!id||seen[id])return; seen[id]=1;
    var rawTitle=node.getAttribute('data-title')||'';
    var game=null, gameId=null, title=rawTitle;
    var tt=document.createElement('div'); tt.innerHTML=rawTitle;
    var a=tt.querySelector('a[href*="gameData.php"]');
    if(a){ // cross-game grid: data-title is the game link
      game=(a.textContent||'').replace(/\s+/g,' ').trim();
      var m=a.getAttribute('href').match(/id=(\d+)/); gameId=m?parseInt(m[1],10):null;
      title=null;
    } else {
      title=(tt.textContent||rawTitle).replace(/\s+/g,' ').trim();
    }
    screens.push({
      imageid:id, title:title, game:game, gameId:gameId,
      size:node.getAttribute('data-size')||null,
      full:node.getAttribute('href')||null,
      thumb:node.getAttribute('data-thumb')||null,
      scrn:node.getAttribute('data-url')||null
    });
  });
  return JSON.stringify({count:screens.length, screens:screens},null,1);
})()
