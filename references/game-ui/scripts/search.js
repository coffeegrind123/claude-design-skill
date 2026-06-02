// search.js — universal search via search.php?t=QUERY
// Paste into mcp__browser__execute_js (browser must have cleared the Cloudflare challenge first).
// Edit QUERY below. Returns {query, textSearch, screenTypes[], games[], filters[]}.
//   textSearch  -> {url, results}            : OCR "find in screenshots"  (index.php?text=..&set=1)
//   screenTypes -> [{name, scrn, url}]        : UI-element categories       (index.php?scrn=<typeID>)
//   games       -> [{name, year, id, url}]    : game pages                  (gameData.php?id=N)
//   filters     -> [{name, tag, url}]         : design-attribute filters    (index.php?tag=N)
(function(){
  var QUERY = "inventory";   // <<< EDIT

  function get(url){var x=new XMLHttpRequest();x.open('GET',url,false);x.send(null);return {s:x.status,t:x.responseText||''};}
  var abs=function(h){return h&&h.indexOf('http')===0?h:'https://www.gameuidatabase.com/'+(h||'').replace(/^\//,'');};
  var r=get('search.php?t='+encodeURIComponent(QUERY));
  var out={query:QUERY, status:r.s, textSearch:null, screenTypes:[], games:[], filters:[], other:[]};
  if(r.s!==200){out.error='search.php returned '+r.s+' (challenge not cleared?)';return JSON.stringify(out,null,1);}
  var d=document.createElement('div'); d.innerHTML=r.t;
  d.querySelectorAll('.search_result').forEach(function(row){
    var a=row.querySelector('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    var label=row.textContent.replace(/\s+/g,' ').trim();
    if(/text=/.test(href)){
      var n=(label.match(/([\d,]+)\s*RESULTS/i)||[])[1];
      out.textSearch={url:abs(href), results:n?parseInt(n.replace(/,/g,''),10):null, label:label};
    } else if(/gameData\.php\?id=(\d+)/.test(href)){
      var gid=href.match(/id=(\d+)/)[1];
      var ym=label.match(/(\d{4})\s*$/); var year=ym?ym[1]:null;
      var name=label.replace(/\s*\d{4}\s*$/,'').trim();
      out.games.push({name:name, year:year, id:parseInt(gid,10), url:abs(href)});
    } else if(/scrn=(\d+)/.test(href)){
      out.screenTypes.push({name:label.replace(/SCREEN TYPE\s*$/i,'').trim(), scrn:parseInt(href.match(/scrn=(\d+)/)[1],10), url:abs(href)});
    } else if(/tag=(\d+)/.test(href)){
      out.filters.push({name:label.replace(/FILTER\s*$/i,'').trim(), tag:parseInt(href.match(/tag=(\d+)/)[1],10), url:abs(href)});
    } else {
      out.other.push({label:label, url:abs(href)});
    }
  });
  out.counts={games:out.games.length, screenTypes:out.screenTypes.length, filters:out.filters.length};
  return JSON.stringify(out,null,1);
})()
