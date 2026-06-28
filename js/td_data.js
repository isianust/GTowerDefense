/* ============================================
   三國塔防 — 資料表（純資料，無依賴）
   TOWERS（武將塔）／ENEMIES（雜兵）／ULTIMATES（六大絕 UIOJKL）／BOSSES（50 關）
   全繁體中文。沿用既有平衡數值，僅換皮成三國主題。
   ============================================ */

/* ---------- 武將防禦塔（15 種） ----------
   stats 與既有版本一致；range 為「格」、fireRate 為「幀」。
   skill = 主動/被動技能描述（給「技能表」面板用）。 */
const TD_TOWERS = {
  archer:    { key:"archer",    name:"弓兵營",   icon:"🏹", color:"#22c55e", cost:50,  range:3,   damage:8,   fireRate:30,  projSpeed:6,  splash:0,   slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"快速射擊的基礎弓手", skill:"【連射】攻速快、單體傷害穩定，後期可升級為強弓。" },
  cannon:    { key:"cannon",    name:"投石車",   icon:"💣", color:"#ef4444", cost:75,  range:2.5, damage:25,  fireRate:70,  projSpeed:4,  splash:1.2, slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"範圍濺射攻城器", skill:"【濺射】命中時對周圍敵人造成範圍傷害，剋大量小兵。" },
  ice:       { key:"ice",       name:"寒冰陣",   icon:"❄️", color:"#38bdf8", cost:60,  range:2.5, damage:5,   fireRate:40,  projSpeed:5,  splash:0,   slow:0.4,  slowDur:90,  chain:0, chainRange:0, desc:"鐵索連環減速", skill:"【減速】命中敵人降低其移動速度，拖住快速騎兵。" },
  lightning: { key:"lightning", name:"連弩車",   icon:"⚡", color:"#a78bfa", cost:100, range:3,   damage:12,  fireRate:50,  projSpeed:20, splash:0,   slow:0,    slowDur:0,   chain:3, chainRange:2, desc:"諸葛連弩，鏈式打擊", skill:"【連環】箭矢在多個敵人之間彈跳，剋密集隊形。" },
  sniper:    { key:"sniper",    name:"神射手",   icon:"🎯", color:"#f59e0b", cost:120, range:5,   damage:40,  fireRate:90,  projSpeed:15, splash:0,   slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"百步穿楊的遠程射手", skill:"【穿楊】超遠射程、高單體傷害，專點精英與 BOSS。" },
  flame:     { key:"flame",     name:"火攻營",   icon:"🔥", color:"#f97316", cost:90,  range:2.5, damage:15,  fireRate:35,  projSpeed:5,  splash:0.8, slow:0.15, slowDur:45,  chain:0, chainRange:0, desc:"赤壁火計，灼燒範圍", skill:"【火計】範圍灼燒並輕微減速，持續壓制成群敵兵。" },
  mortar:    { key:"mortar",    name:"霹靂車",   icon:"💥", color:"#6b7280", cost:150, range:5.0, damage:60,  fireRate:120, projSpeed:3,  splash:2.0, slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"大範圍轟擊攻城車", skill:"【轟擊】超大範圍重傷，攻速慢但清場力極強。" },
  poison:    { key:"poison",    name:"南蠻瘴氣", icon:"☠️", color:"#84cc16", cost:80,  range:3.0, damage:4,   fireRate:25,  projSpeed:6,  splash:0,   slow:0.6,  slowDur:180, chain:0, chainRange:0, desc:"南蠻毒瘴，長時間減速", skill:"【瘴氣】極長時間重度減速，黏住重甲與 BOSS。" },
  tesla:     { key:"tesla",     name:"雷法陣",   icon:"🌩️", color:"#818cf8", cost:130, range:2.8, damage:20,  fireRate:45,  projSpeed:20, splash:0.5, slow:0,    slowDur:0,   chain:4, chainRange:2.2, desc:"雷法連擊＋震盪", skill:"【雷擊】連鎖閃電並帶小範圍震盪，剋群體。" },
  laser:     { key:"laser",     name:"強弩連射", icon:"🔴", color:"#f43f5e", cost:110, range:3.5, damage:6,   fireRate:12,  projSpeed:25, splash:0,   slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"極速連發弩", skill:"【速射】極高攻速持續輸出，剋高血量單體。" },
  catapult:  { key:"catapult",  name:"巨型投石", icon:"🪃", color:"#92400e", cost:160, range:3.5, damage:100, fireRate:150, projSpeed:3,  splash:1.0, slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"單發超重打擊", skill:"【重砲】單發爆發極高，專破精英與 BOSS 護甲。" },
  frost:     { key:"frost",     name:"玄冰陣",   icon:"🌨️", color:"#7dd3fc", cost:85,  range:3.0, damage:7,   fireRate:45,  projSpeed:5,  splash:0.8, slow:0.7,  slowDur:120, chain:0, chainRange:0, desc:"範圍重度冰封", skill:"【冰封】範圍命中並大幅減速，凍住成群敵兵。" },
  venom:     { key:"venom",     name:"毒箭營",   icon:"🐍", color:"#4d7c0f", cost:95,  range:3.5, damage:10,  fireRate:55,  projSpeed:7,  splash:0,   slow:0.5,  slowDur:200, chain:0, chainRange:0, desc:"遠程毒箭削弱", skill:"【毒箭】遠程附加長時間減速，削弱強敵。" },
  ballista:  { key:"ballista",  name:"床弩",     icon:"🏹", color:"#b45309", cost:140, range:5.5, damage:55,  fireRate:80,  projSpeed:16, splash:0,   slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"超遠程巨弩", skill:"【巨弩】超遠射程高傷，遠端狙殺。" },
  railgun:   { key:"railgun",   name:"諸葛神弩", icon:"✨", color:"#06b6d4", cost:200, range:6.0, damage:180, fireRate:200, projSpeed:30, splash:0,   slow:0,    slowDur:0,   chain:0, chainRange:0, desc:"終極精準神弩", skill:"【神弩】全圖最遠、單發毀滅級傷害，BOSS 殺手。" },
};
const TD_TOWER_ORDER = ["archer","cannon","ice","lightning","sniper","flame","mortar","poison","tesla","laser","catapult","frost","venom","ballista","railgun"];

/* ---------- 雜兵（敵人）----------
   沿用既有平衡數值；boss 由 BOSSES 另行定義。 */
const TD_ENEMIES = {
  huangjin:  { key:"huangjin",  name:"黃巾賊",   hp:30,   speed:1.5, reward:5,  color:"#eab308", size:0.5,  damage:1 },
  bandit:    { key:"bandit",    name:"山賊",     hp:20,   speed:2.0, reward:4,  color:"#a16207", size:0.45, damage:1 },
  spearman:  { key:"spearman",  name:"刀盾兵",   hp:80,   speed:1.0, reward:10, color:"#65a30d", size:0.6,  damage:1 },
  cavalry:   { key:"cavalry",   name:"西涼鐵騎", hp:50,   speed:2.5, reward:8,  color:"#a1a1aa", size:0.5,  damage:1 },
  assassin:  { key:"assassin",  name:"死士刺客", hp:80,   speed:2.8, reward:12, color:"#1e293b", size:0.5,  damage:2 },
  deathsoldier:{key:"deathsoldier",name:"陷陣死士",hp:180,speed:0.9, reward:18, color:"#6366f1", size:0.65, damage:2 },
  shaman:    { key:"shaman",    name:"妖術士",   hp:250,  speed:1.2, reward:25, color:"#818cf8", size:0.55, damage:3 },
  elephant:  { key:"elephant",  name:"南蠻象兵", hp:400,  speed:0.6, reward:30, color:"#78716c", size:0.8,  damage:3 },
  rattan:    { key:"rattan",    name:"藤甲兵",   hp:600,  speed:0.4, reward:40, color:"#a3a300", size:0.85, damage:4 },
  heavy:     { key:"heavy",     name:"重甲銳士", hp:1500, speed:0.5, reward:80, color:"#d4a574", size:1.0,  damage:8 },
  berserker: { key:"berserker", name:"狂戰",     hp:200,  speed:1.3, reward:20, color:"#dc2626", size:0.6,  damage:2 },
  raider:    { key:"raider",    name:"烏桓游騎", hp:45,   speed:3.2, reward:8,  color:"#c084fc", size:0.45, damage:1 },
};

/* ---------- 六大絕招（玩家主動技，熱鍵 U I O J K L）----------
   cast/cd 單位：秒。effect 由引擎解讀。 */
const TD_ULTIMATES = [
  { key:"U", id:"fireChain", name:"火燒連環", cast:1.5, cd:35, effect:"burnPath",  desc:"沿敵人路徑點燃，造成大範圍持續燒傷。" },
  { key:"I", id:"arrowRain", name:"萬箭齊發", cast:1.0, cd:25, effect:"arrowRain", desc:"全螢幕落箭，對所有敵人造成高額單體傷害。" },
  { key:"O", id:"baguaLock", name:"八卦鎖陣", cast:0.8, cd:30, effect:"lockField", desc:"大範圍定身＋減速，並可打斷 BOSS 詠唱。" },
  { key:"J", id:"healQi",    name:"青囊療傷", cast:0.0, cd:40, effect:"healBase",  desc:"立即回復基地生命，並給予全體短暫護盾。" },
  { key:"K", id:"thunder",   name:"雷引天罰", cast:2.0, cd:45, effect:"thunder",   desc:"連鎖落雷反覆轟擊，後期清場利器。" },
  { key:"L", id:"slayBoss",  name:"無雙·斬將", cast:2.5, cd:60, effect:"slayBoss",  desc:"對全場 BOSS 造成斬殺級重擊。" },
];

/* ---------- 50 關 BOSS 資料 ----------
   每關：大BOSS（lord 代表）＋中/小BOSS（adds）。
   skill = 招牌技；cast=詠唱秒數；cd=冷卻秒數；effect=引擎處理的技能類型；
   weak = 弱點提示；lord=true 代表第 10/20/30/40/50「魔王關」同場多 BOSS。
   效果類型：summon 召怪 / shield 護盾 / heal 治療 / enrage 狂暴(加攻)
            dash 突進(加速) / aoe 大範圍傷害 / slowTower 減速我方塔
            silenceTower 沉默我方塔 / buffAll 強化全場敵人 */
const TD_BOSSES = [
  { lv:1,  name:"程遠志", skill:"蜂擁",       cast:0.5, cd:8,  effect:"summon",       weak:"群攻塔",   adds:["鄧茂","黃巾力士"] },
  { lv:2,  name:"張寶",   skill:"妖風",       cast:1.0, cd:12, effect:"slowTower",    weak:"遠程塔",   adds:["高昇","黃巾妖術士"] },
  { lv:3,  name:"張梁",   skill:"黃天蔽日",   cast:1.5, cd:15, effect:"shield",       weak:"高爆發",   adds:["卜己","管亥"] },
  { lv:4,  name:"張角",   skill:"太平要術",   cast:2.0, cd:20, effect:"heal",         weak:"高DPS",    adds:["馬元義","波才"] },
  { lv:5,  name:"華雄",   skill:"溫酒斬",     cast:1.0, cd:14, effect:"dash",         weak:"減速塔",   adds:["李肅","胡軫"] },
  { lv:6,  name:"紀靈",   skill:"三尖刀",     cast:1.0, cd:16, effect:"enrage",       weak:"減速塔",   adds:["荀正","陳蘭"] },
  { lv:7,  name:"顏良",   skill:"河北名將",   cast:1.2, cd:18, effect:"enrage",       weak:"爆發塔",   adds:["呂曠","呂翔"] },
  { lv:8,  name:"文醜",   skill:"追魂",       cast:0.8, cd:12, effect:"dash",         weak:"減速塔",   adds:["蔣義渠","韓猛"] },
  { lv:9,  name:"高覽",   skill:"鐵壁",       cast:1.0, cd:20, effect:"shield",       weak:"穿透/高爆", adds:["焦觸","張南"] },
  { lv:10, name:"董卓",   skill:"火燒洛陽",   cast:2.5, cd:25, effect:"aoe",          weak:"持久戰",   adds:["李傕","郭汜","樊稠"], lord:true },
  { lv:11, name:"張濟",   skill:"西涼鐵騎",   cast:1.0, cd:15, effect:"summon",       weak:"群攻塔",   adds:["段煨","胡車兒"] },
  { lv:12, name:"樊稠",   skill:"衝陣",       cast:0.8, cd:12, effect:"dash",         weak:"減速塔",   adds:["王方","李蒙"] },
  { lv:13, name:"韓遂",   skill:"西涼八部",   cast:1.5, cd:18, effect:"summon",       weak:"群攻塔",   adds:["成宜","李堪"] },
  { lv:14, name:"馬騰",   skill:"槍出如龍",   cast:1.0, cd:16, effect:"enrage",       weak:"爆發塔",   adds:["馬鐵","馬休"] },
  { lv:15, name:"龐德",   skill:"抬櫬決死",   cast:1.2, cd:18, effect:"enrage",       weak:"減速塔",   adds:["馬岱","梁興"] },
  { lv:16, name:"張繡",   skill:"北地槍王",   cast:1.0, cd:15, effect:"enrage",       weak:"爆發塔",   adds:["胡車兒","賈詡護衛"] },
  { lv:17, name:"紀靈·改", skill:"山賊伏擊",  cast:0.8, cd:12, effect:"summon",       weak:"群攻塔",   adds:["雷薄","陳蘭"] },
  { lv:18, name:"嚴白虎", skill:"江東之亂",   cast:1.0, cd:16, effect:"summon",       weak:"群攻塔",   adds:["嚴輿","王朗兵"] },
  { lv:19, name:"王朗",   skill:"舌戰",       cast:1.0, cd:20, effect:"silenceTower", weak:"快速擊殺", adds:["虞翻","華歆"] },
  { lv:20, name:"袁紹",   skill:"河北霸業",   cast:2.5, cd:25, effect:"buffAll",      weak:"持久戰",   adds:["顏良","文醜","審配"], lord:true },
  { lv:21, name:"高順",   skill:"陷陣營",     cast:1.2, cd:18, effect:"enrage",       weak:"爆發塔",   adds:["曹性","侯成"] },
  { lv:22, name:"張遼",   skill:"威震逍遙津", cast:1.5, cd:20, effect:"aoe",          weak:"減速塔",   adds:["樂進","李典"] },
  { lv:23, name:"臧霸",   skill:"泰山賊",     cast:1.0, cd:15, effect:"summon",       weak:"群攻塔",   adds:["孫觀","吳敦"] },
  { lv:24, name:"太史慈", skill:"神射",       cast:0.8, cd:14, effect:"enrage",       weak:"高血量塔", adds:["宋謙","賈華"] },
  { lv:25, name:"甘寧",   skill:"百騎劫營",   cast:1.2, cd:18, effect:"dash",         weak:"減速塔",   adds:["蔣欽","淩統"] },
  { lv:26, name:"周泰",   skill:"身披百創",   cast:1.0, cd:20, effect:"shield",       weak:"穿透/高爆", adds:["韓當","周倉"] },
  { lv:27, name:"黃蓋",   skill:"苦肉火攻",   cast:1.5, cd:18, effect:"slowTower",    weak:"遠程塔",   adds:["闞澤","丁奉"] },
  { lv:28, name:"程普",   skill:"江表虎臣",   cast:1.0, cd:16, effect:"buffAll",      weak:"持久戰",   adds:["徐盛","潘璋"] },
  { lv:29, name:"孫策",   skill:"小霸王",     cast:1.2, cd:18, effect:"enrage",       weak:"減速塔",   adds:["周瑜護衛","陳武"] },
  { lv:30, name:"呂布",   skill:"方天畫戟·無雙", cast:2.5, cd:22, effect:"aoe",       weak:"持久戰",   adds:["張遼","高順","貂蟬"], lord:true },
  { lv:31, name:"夏侯惇", skill:"拔矢啖睛",   cast:1.0, cd:16, effect:"enrage",       weak:"爆發塔",   adds:["夏侯恩","韓浩"] },
  { lv:32, name:"夏侯淵", skill:"神速",       cast:0.8, cd:14, effect:"dash",         weak:"減速塔",   adds:["杜襲","張既"] },
  { lv:33, name:"曹仁",   skill:"鐵壁八門",   cast:1.5, cd:20, effect:"shield",       weak:"穿透/高爆", adds:["牛金","曹純"] },
  { lv:34, name:"張郃",   skill:"巧變",       cast:1.0, cd:15, effect:"dash",         weak:"減速塔",   adds:["朱靈","路招"] },
  { lv:35, name:"徐晃",   skill:"長驅直入",   cast:1.2, cd:18, effect:"enrage",       weak:"爆發塔",   adds:["滿寵","史渙"] },
  { lv:36, name:"許褚",   skill:"虎痴",       cast:1.0, cd:16, effect:"enrage",       weak:"爆發塔",   adds:["典韋護衛","曹彰"] },
  { lv:37, name:"龐統",   skill:"連環計",     cast:1.5, cd:20, effect:"silenceTower", weak:"快速擊殺", adds:["法正護衛","士兵"] },
  { lv:38, name:"魏延",   skill:"反骨",       cast:1.0, cd:18, effect:"enrage",       weak:"爆發塔",   adds:["王平","馬岱"] },
  { lv:39, name:"姜維",   skill:"九伐中原",   cast:1.5, cd:20, effect:"summon",       weak:"群攻塔",   adds:["夏侯霸","廖化"] },
  { lv:40, name:"關羽",   skill:"青龍偃月·水淹七軍", cast:2.5, cd:22, effect:"aoe",   weak:"持久戰",   adds:["周倉","關平","赤兔"], lord:true },
  { lv:41, name:"張飛",   skill:"當陽斷橋",   cast:1.2, cd:18, effect:"aoe",          weak:"減速塔",   adds:["范疆","張達"] },
  { lv:42, name:"趙雲",   skill:"七進七出",   cast:1.5, cd:20, effect:"dash",         weak:"減速塔",   adds:["鄧芝","張翼"] },
  { lv:43, name:"馬超",   skill:"西涼錦馬超", cast:1.2, cd:18, effect:"dash",         weak:"減速塔",   adds:["龐德","馬岱"] },
  { lv:44, name:"黃忠",   skill:"百步穿楊",   cast:1.0, cd:16, effect:"enrage",       weak:"高血量塔", adds:["嚴顏","鄧賢"] },
  { lv:45, name:"周瑜",   skill:"赤壁東風",   cast:2.0, cd:22, effect:"aoe",          weak:"持久戰",   adds:["魯肅","呂蒙"] },
  { lv:46, name:"陸遜",   skill:"火燒連營",   cast:2.0, cd:22, effect:"aoe",          weak:"持久戰",   adds:["朱然","韓當"] },
  { lv:47, name:"司馬懿", skill:"鷹視狼顧",   cast:1.5, cd:20, effect:"buffAll",      weak:"持久戰",   adds:["司馬師","司馬昭"] },
  { lv:48, name:"鄧艾",   skill:"偷渡陰平",   cast:1.2, cd:18, effect:"dash",         weak:"減速塔",   adds:["師纂","諸葛緒"] },
  { lv:49, name:"鍾會",   skill:"劍閣強攻",   cast:1.5, cd:20, effect:"aoe",          weak:"持久戰",   adds:["衛瓘","胡烈"] },
  { lv:50, name:"諸葛亮", skill:"八陣圖·借東風", cast:3.0, cd:20, effect:"aoe",       weak:"極限持久", adds:["司馬懿","呂布","姜維"], lord:true },
];

/* 依關卡（1-based）取得 BOSS 定義 */
function tdBossForLevel(levelIndex1) {
  return TD_BOSSES[(levelIndex1 - 1) % TD_BOSSES.length];
}

/* effect → 中文說明（給 BOSS 表面板用） */
const TD_EFFECT_DESC = {
  summon:       "召喚大量雜兵增援",
  shield:       "獲得護盾，短時間大幅減傷",
  heal:         "持續回復自身與周圍敵人生命",
  enrage:       "狂暴，提升移動與抗性",
  dash:         "突進，大幅提升移動速度",
  aoe:          "釋放大範圍能量，對基地造成額外威脅",
  slowTower:    "降低我方防禦塔攻速",
  silenceTower: "沉默我方防禦塔，短時間無法攻擊",
  buffAll:      "強化全場敵人血量與速度",
};

if (typeof window !== "undefined") {
  window.TD_TOWERS = TD_TOWERS;
  window.TD_TOWER_ORDER = TD_TOWER_ORDER;
  window.TD_ENEMIES = TD_ENEMIES;
  window.TD_ULTIMATES = TD_ULTIMATES;
  window.TD_BOSSES = TD_BOSSES;
  window.TD_EFFECT_DESC = TD_EFFECT_DESC;
  window.tdBossForLevel = tdBossForLevel;
}
