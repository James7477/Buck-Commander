/* Waypoint Manager v1: standalone enhancement for Buck Command & Fish Command. */
(function () {
  'use strict';
  const buck = !!document.getElementById('mapBottom');
  const bridgeName = buck ? 'buckWaypointsBridge' : 'fishWaypointsBridge';
  const key = buck ? 'buckcommand_v13u_waypoints' : 'fishcommand-v1-spots';
  const visibilityKey = buck ? 'buckcommand_v13u_waypoints_visible' : 'fishcommand_waypoints_visible';
  const types = buck
    ? ['Scouting Spot','Deer Stand','Feeder','Trail Camera','Food Plot','Truck / Access','Trail','Other']
    : ['Fishing Hole','Brush Pile','Reef','Wreck','Boat Ramp','Channel','Hazard','Other'];
  const $ = id => document.getElementById(id);
  let selected = null, editing = null, pickMode = false, gpsFix = null;
  let visible = true;
  try { visible = localStorage.getItem(visibilityKey) !== 'false'; } catch (_) {}
  const valid = p => p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)) &&
    Math.abs(Number(p.lat)) <= 90 && Math.abs(Number(p.lon)) <= 180;
  function read() {
    try {
      const a = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(a) ? a.filter(valid).map(p => ({...p,lat:Number(p.lat),lon:Number(p.lon)})) : [];
    } catch (_) { return []; }
  }
  function bridge() { return window[bridgeName]; }
  function redraw() { try { bridge()?.refresh(read(),visible); } catch(e) { notice('Map update failed: '+e.message); } renderList(); }
  function saveRecords(a) {
    try { localStorage.setItem(key,JSON.stringify(a)); redraw(); return true; }
    catch (_) { notice('Could not save. Check available browser storage.'); return false; }
  }
  function notice(msg) { const n=$('wpStatus'); if(n) n.textContent=msg; }
  function element(tag,cls,text) {
    const e=document.createElement(tag);
    if(cls)e.className=cls;
    if(text!==undefined)e.textContent=text;
    return e;
  }
  const css=element('style');css.textContent=
    '#wpDialog{color:#eff9f0;background:#10281f;border:1px solid #769985;border-radius:16px;padding:0;width:min(535px,calc(100vw - 18px));max-height:92dvh;box-shadow:0 18px 55px #000a;overflow:auto;font:14px system-ui,Arial,sans-serif;z-index:9999}' +
    '#wpDialog::backdrop{background:#000b}#wpDialog *{box-sizing:border-box}#wpDialog header{position:static;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;max-width:none;background:#1b4130;border:none;border-radius:0;pointer-events:auto}' +
    '#wpDialog h2{margin:0;font-size:17px;color:white}#wpDialog .wpBody{padding:14px}#wpDialog label{display:block;font-size:12px;color:#ddede2;margin:10px 0 4px}#wpDialog input,#wpDialog textarea,#wpDialog select{width:100%;border:1px solid #719484;border-radius:9px;background:#071b14;color:white;padding:10px;font:16px system-ui}' +
    '#wpDialog textarea{min-height:65px}#wpDialog button{border-radius:9px;border:1px solid #79a38c;background:#225c3d;color:white;font-size:13px;font-weight:700;padding:9px;cursor:pointer}#wpDialog .wpRow{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0}#wpDialog .wpRow>*{flex:1 1 auto}' +
    '#wpDialog .wpPrimary{background:#e2bd59;color:#142018;border:0}#wpDialog .wpDanger{background:#503030;border-color:#bd8989}#wpDialog .wpNote{font-size:12px;color:#c8dacc;line-height:1.5;margin:8px 0}#wpDialog .wpItem{border:1px solid #537b65;border-radius:11px;padding:10px;margin:8px 0;background:#1b392b}' +
    '#wpDialog .wpItem strong{display:block;color:#fff2bd}#wpDialog .wpItem small{display:block;color:#d6e1d8;line-height:1.45;margin-top:4px;overflow-wrap:anywhere}#wpStatus{font-size:12px;color:#ffe29c;min-height:17px}#wpPickHint{position:fixed;z-index:115;left:50%;bottom:86px;transform:translateX(-50%);padding:11px;border-radius:12px;background:#102a21;border:1px solid #e9ce7b;color:#fff;display:flex;gap:10px;align-items:center;box-shadow:0 7px 24px #000a;max-width:95vw;font:13px system-ui}' +
    '#wpPickHint[hidden]{display:none}#wpPickHint button{background:#c18b39;color:#151c18;border:0;border-radius:7px;padding:8px}#wpOpen{white-space:nowrap}' +
    (buck?'':'#wpDialog{background:#082d3d;border-color:#4b91a5}#wpDialog header{background:#0e5061}#wpDialog .wpItem{background:#103c4c}#wpDialog button{background:#17647b}#wpDialog input,#wpDialog textarea,#wpDialog select{background:#082534;border-color:#438194}#wpDialog .wpPrimary{background:#f4ba63}');
  document.head.append(css);
  const target=buck?$('mapBottom'):document.querySelector('#app .mapButtons');
  if(!target)return;
  const open=element('button',null,'📍 Waypoints');
  open.id='wpOpen';open.type='button';open.setAttribute('aria-label','Open saved waypoints');
  target.append(open);
  const dialog=element('dialog');dialog.id='wpDialog';
  dialog.innerHTML='<header><h2>📍 My Waypoints</h2><button id="wpClose" type="button">✕ Close</button></header>'+
    '<div class="wpBody">'+
    '<p class="wpNote">Save a point anywhere on the map or use phone GPS. Waypoints stay on this browser/device until you export or clear them.</p>'+
    '<div class="wpRow"><button id="wpPick" type="button">📍 Pick on Map</button><button id="wpCenter" type="button">◎ Selected / Center</button><button id="wpGPS" type="button">📡 Phone GPS</button></div>'+
    '<div id="wpCoords" class="wpNote">Choose a map point or use GPS.</div>'+
    '<label for="wpName">Waypoint name</label><input id="wpName" maxlength="90" placeholder="Name this location">'+
    '<label for="wpType">Type of waypoint</label><select id="wpType"></select>'+
    '<label for="wpNotes">Notes</label><textarea id="wpNotes" maxlength="500" placeholder="What did you find here?"></textarea>'+
    '<div class="wpRow"><button class="wpPrimary" id="wpSave" type="button">Save Waypoint</button><button id="wpNew" type="button">Clear / New</button></div>'+
    '<p id="wpStatus" role="status" aria-live="polite"></p><hr style="border:0;border-top:1px solid #4b765e;margin:15px 0">'+
    '<div class="wpRow"><button id="wpToggle" type="button">Hide Pins</button><button id="wpExport" type="button">⬇ Export Backup</button></div>'+
    '<label for="wpSearch">Find a saved waypoint</label><input id="wpSearch" placeholder="Search name or type">'+
    '<div id="wpList"></div>'+
    '<p class="wpNote">Distance and bearing use the most recent GPS fix if available, and are straight-line estimates. External Maps directions may not work on trails or water. Not a substitute for safe land or marine navigation.</p>'+
    '</div>';
  document.body.append(dialog);
  const hint=element('div');hint.id='wpPickHint';hint.hidden=true;
  const hintText=element('span',null,'Tap the spot on your map to mark it.');
  const cancel=element('button',null,'Cancel');cancel.type='button';hint.append(hintText,cancel);document.body.append(hint);
  for(const t of types) $('wpType').add(new Option(t,t));
  function show() { if(!dialog.open)dialog.showModal(); renderList(); }
  function stopPick() { pickMode=false;hint.hidden=true; }
  function setCoords(lat,lon) {
    const p={lat:Number(lat),lon:Number(lon)};
    if(!valid(p)){notice('Map coordinates not available yet.');return false;}
    selected=p;
    $('wpCoords').textContent='📌 Latitude '+p.lat.toFixed(6)+' · Longitude '+p.lon.toFixed(6);
    return true;
  }
  function fresh() {
    editing=null; $('wpName').value='';$('wpNotes').value='';$('wpType').value=types[0];
    selected=null;$('wpCoords').textContent='Choose a map point or use GPS.';
    $('wpSave').textContent='Save Waypoint'; notice('');
  }
  function fetchGPS(onFix) {
    if(!navigator.geolocation || !window.isSecureContext){notice('Phone GPS needs HTTPS and a device with location permissions.');return;}
    notice('Requesting GPS permission and a location fix…');
    navigator.geolocation.getCurrentPosition(p=>{
      gpsFix={lat:p.coords.latitude,lon:p.coords.longitude,accuracy:p.coords.accuracy};
      onFix(gpsFix);
      notice('GPS fix received (reported accuracy ±'+Math.round(p.coords.accuracy)+' m).');
      renderList();
    },err=>notice('GPS unavailable: '+err.message+'. Use Pick on Map instead.'),{enableHighAccuracy:true,timeout:17000,maximumAge:30000});
  }
  function toRadians(n) {return n*Math.PI/180;}
  function distanceAndBearing(p) {
    if(!gpsFix)return null;
    const a=toRadians(gpsFix.lat),b=toRadians(p.lat),delta=toRadians(p.lon-gpsFix.lon);
    const q=Math.sin((b-a)/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(delta/2)**2;
    const miles=3958.7613*2*Math.atan2(Math.sqrt(q),Math.sqrt(Math.max(0,1-q)));
    const deg=(Math.atan2(Math.sin(delta)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(delta))*180/Math.PI+360)%360;
    return miles.toFixed(2)+' mi · '+Math.round(deg)+'° bearing';
  }
  function renderList() {
    const root=$('wpList');root.replaceChildren();
    const q=$('wpSearch').value.trim().toLowerCase();
    const items=read().filter(p=>(String(p.name||'')+' '+String(p.category||'')).toLowerCase().includes(q));
    $('wpToggle').textContent=visible?'👁 Hide Waypoint Pins':'👁 Show Waypoint Pins';
    if(!items.length){root.append(element('p','wpNote',q?'No matching waypoints.':'No waypoints saved yet.'));return;}
    for(const p of items.slice().reverse()){
      const item=element('div','wpItem'),label=element('strong',null,(p.category||'📍 Waypoint')+' · '+(p.name||'Untitled'));
      const detail=element('small',null,p.lat.toFixed(5)+', '+p.lon.toFixed(5)+(distanceAndBearing(p)?' · '+distanceAndBearing(p):''));
      const note=element('small',null,String(p.notes||'').slice(0,500)),actions=element('div','wpRow');
      function action(text,fn,cls){const b=element('button',cls,text);b.type='button';b.onclick=fn;actions.append(b);}
      action('🗺 Show',()=>{
        if(!bridge()){notice('Map is not ready. Open the map and try again.');return;}
        bridge().goTo(p.lat,p.lon,String(p.name||'Waypoint'));dialog.close();
      });
      action('Edit',()=>{editing=String(p.id);setCoords(p.lat,p.lon);$('wpName').value=p.name||'';$('wpType').value=types.includes(p.category)?p.category:types[0];$('wpNotes').value=p.notes||'';$('wpSave').textContent='Update Waypoint';notice('Editing '+(p.name||'waypoint'));dialog.scrollTop=0;});
      action('Maps ↗',()=>{const u=new URL('https://www.google.com/maps/dir/');u.searchParams.set('api','1');u.searchParams.set('destination',p.lat+','+p.lon);u.searchParams.set('travelmode',buck?'walking':'driving');window.open(u.toString(),'_blank','noopener,noreferrer');});
      action('Delete',()=>{if(confirm('Delete waypoint '+(p.name||'')+'?')){if(saveRecords(read().filter(x=>String(x.id)!==String(p.id)))){if(editing===String(p.id))fresh();notice('Waypoint deleted.');}}},'wpDanger');
      item.append(label,detail,note,actions);root.append(item);
    }
  }
  open.onclick=()=>{show();notice('');};
  $('wpClose').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  $('wpNew').onclick=fresh;
  $('wpPick').onclick=()=>{
    if(!bridge()){notice('Open the map first, then select a waypoint.');return;}
    stopPick();pickMode=true;hint.hidden=false;dialog.close();
  };
  cancel.onclick=()=>{stopPick();show();};
  $('wpCenter').onclick=()=>{const p=bridge()?.getSelection();if(p&&setCoords(p.lat,p.lon))notice('Selected point loaded. Give it a name and save.');else notice('Map is not available yet.');};
  $('wpGPS').onclick=()=>fetchGPS(p=>{setCoords(p.lat,p.lon);if(!dialog.open)show();});
  $('wpSave').onclick=()=>{
    const name=$('wpName').value.trim().slice(0,90),notes=$('wpNotes').value.trim().slice(0,500);
    if(!name){notice('Please enter a waypoint name.');$('wpName').focus();return;}
    if(!valid(selected)){notice('Pick a map point or use GPS before saving.');return;}
    const a=read(),idx=editing===null?-1:a.findIndex(p=>String(p.id)===editing);
    const item={...(idx>=0?a[idx]:{}),id:idx>=0?a[idx].id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),
      name,category:$('wpType').value,notes,lat:selected.lat,lon:selected.lon,
      created:idx>=0?(a[idx].created||new Date().toISOString()):new Date().toISOString(),
      updated:new Date().toISOString()};
    if(idx<0)a.push(item);else a[idx]=item;
    if(saveRecords(a)){fresh();notice('✓ Saved '+name+' on this device.');}
  };
  $('wpToggle').onclick=()=>{visible=!visible;try{localStorage.setItem(visibilityKey,String(visible));}catch(_){}redraw();notice(visible?'Waypoint pins are visible.':'Waypoint pins are hidden; saved coordinates remain.');};
  $('wpSearch').oninput=renderList;
  $('wpExport').onclick=()=>{
    const data=JSON.stringify({format:'command-waypoints-v1',app:buck?'buck':'fish',exportedAt:new Date().toISOString(),waypoints:read()},null,2);
    const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=(buck?'buck-command':'fish-command')+'-waypoints.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),2500);notice('Waypoints backup exported. Keep the file somewhere safe.');
  };
  function setupBridge() {
    if(!bridge())return;
    try {
      bridge().onTap(p=>{
        if(!pickMode||!valid(p))return;
        stopPick();setCoords(p.lat,p.lon);show();notice('Map point selected. Name it and press Save Waypoint.');
      });
      redraw();
    } catch(e) {notice('Waypoint map connection failed: '+e.message);}
  }
  window.addEventListener(buck?'buck-waypoint-ready':'fish-waypoint-ready',setupBridge,{once:true});
  if(bridge())setupBridge();
  renderList();
})();