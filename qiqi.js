(() => {
  const $=id=>document.getElementById(id);
  const sources=[
    ['北京旅游网 · 秦皇岛美食图鉴','https://www.visitbeijing.com.cn/article/4MwMXhfa6Mh'],
    ['北京旅游网 · 秦皇岛小馆推荐','https://www.visitbeijing.com.cn/article/4Nn0twWlkVN'],
    ['高德地图 · 秦皇岛烟火小店','https://www.amap.com/ranking/qinhuangdao/shop'],
    ['澎湃新闻 · 秦皇岛豆腐脑','https://m.thepaper.cn/newsDetail_forward_32225495'],
    ['高德地图 · 老李烧烤','https://www.amap.com/place/B0FFIXSGFP']
  ];
  // Editorial meal suitability, not sales or review scores.
  const dishes=[
    ['豆腐脑配烧饼',3,[12,1,1,2]],['一份包子',0,[12,3,2,2]],
    ['羊汤配麻酱烧饼',0,[10,4,3,3]],['煎饼果子',1,[12,2,1,1]],
    ['鸡蛋灌饼',1,[10,3,2,2]],['一份手工饺子',2,[0,10,10,5]],
    ['一份春饼',2,[0,10,10,3]],['肉夹馍',2,[2,9,7,5]],
    ['炒凉皮',1,[0,8,8,5]],['锅包肉配米饭',1,[0,10,10,2]],
    ['地三鲜配米饭',1,[0,10,10,2]],['一份煎焖子',0,[2,3,4,9]],
    ['一份烧烤',4,[0,1,8,12]]
  ];
  const names=['早餐','午餐','晚餐','夜宵'];
  const places={gym:'秦皇岛海港区动力健身',home:'秦皇岛禾苑小区'};
  function period(date){
    const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',hourCycle:'h23'}).format(date));
    return h>=5&&h<10?0:h>=10&&h<16?1:h>=16&&h<21?2:3;
  }
  function select(date,last,random=Math.random){
    const index=period(date),pool=dishes.filter(d=>d[2][index]>0&&d[0]!==last);
    let point=random()*pool.reduce((sum,d)=>sum+d[2][index],0);
    return pool.find(d=>(point-=d[2][index])<0)||pool.at(-1);
  }
  const result=$('takeawayResult'),lastByPlace={};
  function stamp(){$('mealPeriod').textContent=names[period(new Date())]+'时间';}
  stamp();setInterval(stamp,60000);
  $('deliveryPlace').onchange=()=>{result.textContent='已切换地点，看看这次吃什么。';};
  $('pickTakeaway').onclick=()=>{
    const now=new Date(),place=$('deliveryPlace').value,food=select(now,lastByPlace[place]);
    lastByPlace[place]=food[0];
    $('mealPeriod').textContent=names[period(now)]+' · '+now.toLocaleTimeString('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'});
    const card=document.createElement('article');card.className='pick-result';
    const title=document.createElement('h3');title.textContent=food[0];card.append(title);
    const text=document.createElement('p');text.textContent=names[period(now)]+'灵感 · '+places[place];card.append(text);
    const note=document.createElement('p');note.className='muted';note.textContent='秦皇岛美食候选 · 整理于 2026-10-19。店铺、营业时间及配送范围以搜索结果为准。';card.append(note);
    const links=document.createElement('div');links.className='actions';
    for(const [label,url] of [
      ['搜索附近这道餐','https://www.baidu.com/s?wd='+encodeURIComponent(places[place]+' 附近 '+food[0]+' 外卖')],
      ['来源：'+sources[food[1]][0],sources[food[1]][1]]
    ]){const link=document.createElement('a');link.textContent=label;link.href=url;link.target='_blank';link.rel='noopener noreferrer';links.append(link);}
    card.append(links);result.replaceChildren(card);
  };
  const dock=document.createElement('div');dock.className='mobile-generate';
  const generate=document.createElement('button');generate.type='button';generate.className='btn primary';generate.textContent='生成我的营养餐单';
  generate.onclick=()=>{$('generate').click();$('metrics').scrollIntoView({behavior:'smooth',block:'start'});};dock.append(generate);document.body.append(dock);
  document.querySelector('a[href="#foodLibrary"]').onclick=()=>{document.querySelector('.food-library-fold').open=true;};
})();
