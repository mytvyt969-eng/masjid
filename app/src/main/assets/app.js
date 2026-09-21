const schedule = {
  Jummah: {adhan:"1:15 PM", jamaat:"1:30 PM"},
  Fajr: {adhan:"5:47 AM", iqamah:"5:55 AM", icon:"🌅"},
  Dhuhr:{adhan:"12:15 PM",iqamah:"12:30 PM",icon:"☀️"},
  Asr:{adhan:"3:30 PM",iqamah:"3:45 PM",icon:"🌤️"},
  Maghrib:{adhan:"5:49 PM",iqamah:"5:50 PM",icon:"🌇"},
  Isha:{adhan:"6:50 PM",iqamah:"6:55 PM",icon:"🌙"}
};

const astronomical = {fajrStart:"4:37 AM",fajrEnd:"6:05 AM",sunrise:"6:40 AM",sunset:"7:32 PM"};
const prayerOrder = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const themeByPrayer = {Fajr:"theme-fajr",Dhuhr:"theme-dhuhr",Asr:"theme-asr",Maghrib:"theme-maghrib",Isha:"theme-isha"};
const screen=document.getElementById("screen"),cards=document.getElementById("prayerCards"),countdownEl=document.getElementById("countdown"),nextPrayerEl=document.getElementById("nextPrayer"),nextIconEl=document.getElementById("nextIcon"),demoBadge=document.getElementById("demoBadge");

function parseTime(s,base=new Date()){
 const m=s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i); if(!m)return new Date(base);
 let h=+m[1],min=+m[2],ap=m[3].toUpperCase(); if(ap==="PM"&&h!==12)h+=12; if(ap==="AM"&&h===12)h=0;
 const d=new Date(base);d.setHours(h,min,0,0);return d;
}
function fmt(d){return d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});}
function updateHeader(now){
 document.getElementById("gregorianDate").textContent=now.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
 document.getElementById("hijriDate").textContent="29 Rabi' al-Awwal 1448 AH";
 document.getElementById("clockDigital").textContent=fmt(now);
}
function updateAnalog(now){
 const h=now.getHours()%12,m=now.getMinutes(),s=now.getSeconds();
 document.getElementById("hourHand").style.transform=`translate(-50%,-100%) rotate(${h*30+m*.5}deg)`;
 document.getElementById("minuteHand").style.transform=`translate(-50%,-100%) rotate(${m*6+s*.1}deg)`;
 document.getElementById("secondHand").style.transform=`translate(-50%,-100%) rotate(${s*6}deg)`;
}
function buildCards(active){
 cards.innerHTML=prayerOrder.map(name=>{const p=schedule[name];return `<article class="prayer ${name===active?"active":""}">
<div class="phead"><span class="icon">${p.icon}</span><span>${name}</span></div>
<div class="times"><small>Adhan</small><strong>${p.adhan}</strong><div class="sep"></div><small>Iqamah</small><strong>${p.iqamah}</strong></div>
</article>`;}).join("");
}
function setStatic(){
 document.getElementById("jummahAdhan").textContent=schedule.Jummah.adhan;
 document.getElementById("jummahJamaat").textContent=schedule.Jummah.jamaat;
 document.getElementById("fajarStart").textContent=astronomical.fajrStart;
 document.getElementById("fajarEnd").textContent=astronomical.fajrEnd;
 document.getElementById("sunrise").textContent=astronomical.sunrise;
 document.getElementById("sunset").textContent=astronomical.sunset;
}
function getNext(now){
 for(const name of prayerOrder){const d=parseTime(schedule[name].adhan,now);if(d>now)return{name,date:d};}
 const tomorrow=new Date(now);tomorrow.setDate(tomorrow.getDate()+1);return{name:"Fajr",date:parseTime(schedule.Fajr.adhan,tomorrow)};
}
function setTheme(active){screen.classList.remove(...Object.values(themeByPrayer));screen.classList.add(themeByPrayer[active]);}
function tick(){
 const now=new Date();updateHeader(now);updateAnalog(now);const next=getNext(now),diff=Math.max(0,next.date-now);
 const hh=Math.floor(diff/3600000),mm=Math.floor(diff%3600000/60000),ss=Math.floor(diff%60000/1000);
 countdownEl.textContent=[hh,mm,ss].map(v=>String(v).padStart(2,"0")).join(":");
 nextPrayerEl.textContent=next.name;nextIconEl.textContent=schedule[next.name].icon;
 let active="Isha";for(const name of prayerOrder){if(now>=parseTime(schedule[name].adhan,now))active=name;}
 setTheme(active);buildCards(active);
}
setStatic();tick();setInterval(tick,1000);

let demo=false,demoIndex=0,demoTimer=null;
document.addEventListener("keydown",e=>{
 if(e.key.toLowerCase()!=="d")return;demo=!demo;demoBadge.textContent=demo?"DEMO":"LIVE";clearInterval(demoTimer);
 if(demo){const run=()=>{const active=prayerOrder[demoIndex%prayerOrder.length];setTheme(active);buildCards(active);nextPrayerEl.textContent=active;nextIconEl.textContent=schedule[active].icon;demoIndex++;};run();demoTimer=setInterval(run,5000);}
 else tick();
});
