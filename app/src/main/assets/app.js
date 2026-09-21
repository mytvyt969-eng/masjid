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
}

function weatherIcon(code){
 if(code===0)return "☀️"; if([1,2].includes(code))return "🌤️"; if(code===3)return "☁️";
 if([45,48].includes(code))return "🌫️"; if([51,53,55,56,57,61,63,65,80,81,82].includes(code))return "🌧️";
 if([71,73,75,77,85,86].includes(code))return "🌨️"; if([95,96,99].includes(code))return "⛈️"; return "🌤️";
}
function weatherText(code){
 if(code===0)return "Clear"; if([1,2].includes(code))return "Partly Cloudy"; if(code===3)return "Cloudy";
 if([45,48].includes(code))return "Fog"; if([51,53,55,56,57,61,63,65,80,81,82].includes(code))return "Rain";
 if([95,96,99].includes(code))return "Thunderstorm"; return "Cloudy";
}
async function updateWeather(){
 const apply=w=>{
  document.getElementById("weatherTemp").textContent=w.temp;
  document.getElementById("weatherDesc").textContent=w.desc;
  document.getElementById("weatherHigh").textContent=w.high;
  document.getElementById("weatherLow").textContent=w.low;
  document.getElementById("weatherIcon").textContent=w.icon;
 };
 const fallback={temp:"28°C",desc:"Light Rain",high:"H:32°",low:"L:25°",icon:"🌧️"};
 try{
  const u="https://api.open-meteo.com/v1/forecast?latitude=23.6693&longitude=86.1511&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=1";
  const r=await fetch(u); if(!r.ok)throw new Error("weather");
  const d=await r.json(),c=d.current,day=d.daily;
  apply({temp:Math.round(c.temperature_2m)+"°C",desc:weatherText(c.weather_code),high:"H:"+Math.round(day.temperature_2m_max[0])+"°",low:"L:"+Math.round(day.temperature_2m_min[0])+"°",icon:weatherIcon(c.weather_code)});
 }catch(e){apply(fallback);}
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
setStatic();tick();updateWeather();setInterval(tick,1000);setInterval(updateWeather,600000);

let demo=false,demoIndex=0,demoTimer=null;
document.addEventListener("keydown",e=>{
 if(e.key.toLowerCase()!=="d")return;demo=!demo;demoBadge.textContent=demo?"DEMO":"LIVE";clearInterval(demoTimer);
 if(demo){const run=()=>{const active=prayerOrder[demoIndex%prayerOrder.length];setTheme(active);buildCards(active);nextPrayerEl.textContent=active;nextIconEl.textContent=schedule[active].icon;demoIndex++;};run();demoTimer=setInterval(run,5000);}
 else tick();
});
