/* ============================================
   I18N — Bilingual Localization (EN / 繁體中文)
   ============================================ */

const I18N = (() => {
    const STORAGE_KEY = "td_lang";
    const DEFAULT_LANG = "en";

    const LANG = {
        en: {
            // Menu
            title: "⚔️ Guardians of the Realm ⚔️",
            subtitle: "Tower Defense",
            play: "▶ Play",
            howToPlay: "📖 How to Play",

            // How to Play
            howTitle: "📖 How to Play",
            objective: "Objective",
            objectiveText: "Defend your base by placing towers along the enemy path. Don't let enemies reach the end!",
            towers: "Towers",
            controls: "Controls",
            archerDesc: "Archer Tower — Fast attacks, moderate damage",
            cannonDesc: "Cannon Tower — Slow but powerful splash damage",
            iceDesc: "Ice Tower — Slows enemies down",
            lightningDesc: "Lightning Tower — Chain lightning hits multiple enemies",
            sniperDesc: "Sniper Tower — Extreme range, high single-target damage",
            control1: "Click a tower from the shop, then click an empty cell to place it",
            control2: "Click an existing tower to upgrade or sell it",
            control3: "Press Start Wave to begin each wave",
            control4: "Press ⏩ to toggle fast-forward",

            // Navigation
            back: "← Back",
            selectLevel: "🗺️ Select Level",

            // HUD
            startWave: "▶ Start Wave",
            towerShop: "🏪 Towers",

            // Tower Info
            upgrade: "⬆ Upgrade",
            sell: "💰 Sell",
            close: "✕ Close",
            max: "MAX",
            damage: "Damage",
            range: "Range",
            fireRate: "Fire Rate",
            splash: "Splash",
            slow: "Slow",
            chain: "Chain",

            // Overlay
            victory: "🎉 Victory!",
            defeat: "💀 Defeat",
            defeatMsg: "The enemy broke through!",
            score: "Score",
            retry: "🔄 Retry",
            nextLevel: "▶ Next Level",
            menu: "🏠 Menu",

            // Language
            language: "Language",
            level: "Level",
            wave: "Wave",
            lv: "Lv",

            // Tower names
            tower_archer: "Archer",
            tower_cannon: "Cannon",
            tower_ice: "Ice",
            tower_lightning: "Lightning",
            tower_sniper: "Sniper",

            // Tower descriptions
            towerDesc_archer: "Fast attacks",
            towerDesc_cannon: "Splash damage",
            towerDesc_ice: "Slows enemies",
            towerDesc_lightning: "Chain attack",
            towerDesc_sniper: "Long range",

            // Enemy names
            enemy_goblin: "Goblin",
            enemy_orc: "Orc",
            enemy_wolf: "Wolf",
            enemy_darkKnight: "Dark Knight",
            enemy_troll: "Troll",
            enemy_demon: "Demon",
            enemy_dragon: "Dragon",
            enemy_lich: "Lich",
            enemy_titan: "Titan",
            enemy_phoenix: "Phoenix",

            // Level names
            level_0: "The Meadow",
            level_1: "Forest Trail",
            level_2: "Desert Crossing",
            level_3: "River Bridge",
            level_4: "Mountain Pass",
            level_5: "Haunted Marsh",
            level_6: "Volcanic Ridge",
            level_7: "Frozen Tundra",
            level_8: "Shadow Citadel",
            level_9: "Dragon's Lair",
            level_10: "Crystal Cave",
            level_11: "Misty Valley",
            level_12: "Ancient Forest",
            level_13: "Coral Reef",
            level_14: "Thunderstorm Peak",
            level_15: "Goblin Fortress",
            level_16: "Cursed Cemetery",
            level_17: "Dark Swamp",
            level_18: "Underground Mine",
            level_19: "The Abyss",
            level_20: "Fire Temple",
            level_21: "Ice Cavern",
            level_22: "Wind Plateau",
            level_23: "Earth Canyon",
            level_24: "Storm Citadel",
            level_25: "Fairy Forest",
            level_26: "Demon Gate",
            level_27: "Angel Falls",
            level_28: "Dragon Valley",
            level_29: "Chaos Realm",
            level_30: "Siege Wall",
            level_31: "Battlefront",
            level_32: "War Camp",
            level_33: "Fallen Kingdom",
            level_34: "Last Stand",
            level_35: "Star Bridge",
            level_36: "Moon Temple",
            level_37: "Sun Palace",
            level_38: "Void Gate",
            level_39: "Cosmic Arena",
            level_40: "Infinity Tower",
            level_41: "Time Rift",
            level_42: "Mirror Realm",
            level_43: "Phantom Citadel",
            level_44: "Nightmare Domain",
            level_45: "Apocalypse Plain",
            level_46: "Shadow Throne",
            level_47: "Eternal Forge",
            level_48: "Heaven's Gate",
            level_49: "Final Judgment",
        },

        "zh-TW": {
            // Menu
            title: "⚔️ 守護者之境 ⚔️",
            subtitle: "塔防遊戲",
            play: "▶ 開始遊戲",
            howToPlay: "📖 遊戲教學",

            // How to Play
            howTitle: "📖 遊戲教學",
            objective: "遊戲目標",
            objectiveText: "在敵人的路徑上放置防禦塔來守護基地。不要讓敵人到達終點！",
            towers: "防禦塔",
            controls: "操作說明",
            archerDesc: "弓箭塔 — 快速攻擊，中等傷害",
            cannonDesc: "加農砲塔 — 緩慢但強力的範圍傷害",
            iceDesc: "冰霜塔 — 減緩敵人速度",
            lightningDesc: "閃電塔 — 連鎖閃電攻擊多個敵人",
            sniperDesc: "狙擊塔 — 超遠射程，高單體傷害",
            control1: "從商店選擇防禦塔，然後點擊空格放置",
            control2: "點擊已放置的防禦塔可以升級或出售",
            control3: "按下開始波次來開始每一波",
            control4: "按 ⏩ 切換快進模式",

            // Navigation
            back: "← 返回",
            selectLevel: "🗺️ 選擇關卡",

            // HUD
            startWave: "▶ 開始波次",
            towerShop: "🏪 防禦塔商店",

            // Tower Info
            upgrade: "⬆ 升級",
            sell: "💰 出售",
            close: "✕ 關閉",
            max: "已滿級",
            damage: "傷害",
            range: "射程",
            fireRate: "攻擊速度",
            splash: "範圍",
            slow: "減速",
            chain: "連鎖",

            // Overlay
            victory: "🎉 勝利！",
            defeat: "💀 失敗",
            defeatMsg: "敵人突破了防線！",
            score: "分數",
            retry: "🔄 重試",
            nextLevel: "▶ 下一關",
            menu: "🏠 主選單",

            // Language
            language: "語言",
            level: "關卡",
            wave: "波次",
            lv: "等級",

            // Tower names
            tower_archer: "弓箭手",
            tower_cannon: "加農砲",
            tower_ice: "冰霜",
            tower_lightning: "閃電",
            tower_sniper: "狙擊手",

            // Tower descriptions
            towerDesc_archer: "快速攻擊",
            towerDesc_cannon: "範圍傷害",
            towerDesc_ice: "減緩敵人",
            towerDesc_lightning: "連鎖攻擊",
            towerDesc_sniper: "遠程攻擊",

            // Enemy names
            enemy_goblin: "哥布林",
            enemy_orc: "獸人",
            enemy_wolf: "狼",
            enemy_darkKnight: "黑暗騎士",
            enemy_troll: "巨魔",
            enemy_demon: "惡魔",
            enemy_dragon: "龍",
            enemy_lich: "巫妖",
            enemy_titan: "泰坦",
            enemy_phoenix: "鳳凰",

            // Level names
            level_0: "翠綠草原",
            level_1: "森林小徑",
            level_2: "沙漠穿越",
            level_3: "河流之橋",
            level_4: "山間隘口",
            level_5: "鬼魅沼澤",
            level_6: "火山山脊",
            level_7: "冰封凍土",
            level_8: "暗影城塞",
            level_9: "龍之巢穴",
            level_10: "水晶洞窟",
            level_11: "迷霧山谷",
            level_12: "古老森林",
            level_13: "珊瑚礁岸",
            level_14: "雷暴之巔",
            level_15: "哥布林要塞",
            level_16: "詛咒墓園",
            level_17: "黑暗沼澤",
            level_18: "地底礦坑",
            level_19: "深淵之境",
            level_20: "烈焰神殿",
            level_21: "冰封洞穴",
            level_22: "風之高原",
            level_23: "大地峽谷",
            level_24: "風暴堡壘",
            level_25: "精靈森林",
            level_26: "魔界之門",
            level_27: "天使瀑布",
            level_28: "龍谷",
            level_29: "混沌領域",
            level_30: "圍城之牆",
            level_31: "戰爭前線",
            level_32: "軍營要地",
            level_33: "隕落王國",
            level_34: "最後防線",
            level_35: "星橋",
            level_36: "月之神殿",
            level_37: "太陽宮殿",
            level_38: "虛空之門",
            level_39: "宇宙競技場",
            level_40: "無盡之塔",
            level_41: "時空裂縫",
            level_42: "鏡像世界",
            level_43: "幻影堡壘",
            level_44: "噩夢領域",
            level_45: "末日平原",
            level_46: "暗影王座",
            level_47: "永恆熔爐",
            level_48: "天堂之門",
            level_49: "最終審判",
        },
    };

    let currentLang = DEFAULT_LANG;

    function init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && LANG[stored]) {
            currentLang = stored;
        }
    }

    function t(key) {
        const dict = LANG[currentLang] || LANG[DEFAULT_LANG];
        return dict[key] !== undefined ? dict[key] : key;
    }

    function setLang(lang) {
        if (LANG[lang]) {
            currentLang = lang;
            localStorage.setItem(STORAGE_KEY, lang);
        }
    }

    function getLang() {
        return currentLang;
    }

    init();

    return { t, setLang, getLang };
})();

window.I18N = I18N;
