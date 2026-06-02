// inspector.js — deep data for ONE screen: UI-region annotations + colour palette + OCR text.
// Paste into mcp__browser__execute_js. Edit IMAGE_ID (a data-imageid value).
// Pulls galleryscript/inspector.php?id=.. (annotations + colours) and inspector_OCR.php?id=.. (text).
// Returns {imageid, annotations:[{label,description}], colours:[hex...], ocr:string|null}
(function(){
  var IMAGE_ID = 100623;   // <<< EDIT (a data-imageid)

  function get(url){var x=new XMLHttpRequest();x.open('GET',url,false);x.send(null);return {s:x.status,t:x.responseText||''};}
  var out={imageid:IMAGE_ID, annotations:[], colours:[], ocr:null};

  var insp=get('galleryscript/inspector.php?id='+IMAGE_ID);
  if(insp.s===200){
    var d=document.createElement('div'); d.innerHTML=insp.t;
    d.querySelectorAll('.inspectorlink').forEach(function(el){
      if(el.className.indexOf('inspectorlinkColour')>=0) return;
      var desc=el.querySelector('.description');
      var label=(el.childNodes[0]&&el.childNodes[0].textContent||el.textContent||'').replace(/\s+/g,' ').trim();
      var dtext=desc?(desc.textContent||'').replace(/\s+/g,' ').trim():'';
      if(desc) label=label.replace(dtext,'').trim();
      if(label||dtext) out.annotations.push({label:label, description:dtext});
    });
    // colours: explicit colour entries + any hex strings in the fragment
    d.querySelectorAll('.inspectorlinkColour').forEach(function(el){
      var m=(el.getAttribute('style')||el.textContent||'').match(/#([0-9a-fA-F]{6})/);
      if(m) out.colours.push('#'+m[1]);
    });
    var hexes=insp.t.match(/#[0-9a-fA-F]{6}\b/g)||[];
    out.colours=[...new Set(out.colours.concat(hexes))].slice(0,24);
  } else { out.inspectorStatus=insp.s; }

  var ocr=get('galleryscript/inspector_OCR.php?id='+IMAGE_ID);
  if(ocr.s===200 && !/404 Not Found/i.test(ocr.t)){
    var od=document.createElement('div'); od.innerHTML=ocr.t;
    var txt=(od.textContent||'').replace(/\s+/g,' ').trim();
    out.ocr=txt||null;
  } // 404 => screen has no OCR layer (normal)

  out.annotationCount=out.annotations.length;
  out.colourCount=out.colours.length;
  return JSON.stringify(out,null,1);
})()
