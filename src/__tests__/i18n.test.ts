import { describe, it, expect, beforeEach, vi } from "vitest";
import { t, setLang, getLang } from "../i18n";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("I18N Module", () => {
  beforeEach(() => {
    localStorageMock.clear();
    setLang("en");
  });

  describe("getLang()", () => {
    it("should default to English", () => {
      expect(getLang()).toBe("en");
    });

    it("should return zh-TW after switching", () => {
      setLang("zh-TW");
      expect(getLang()).toBe("zh-TW");
    });
  });

  describe("setLang()", () => {
    it("should switch language to zh-TW", () => {
      setLang("zh-TW");
      expect(getLang()).toBe("zh-TW");
    });

    it("should switch back to en", () => {
      setLang("zh-TW");
      setLang("en");
      expect(getLang()).toBe("en");
    });

    it("should persist language to localStorage", () => {
      setLang("zh-TW");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("td_lang", "zh-TW");
    });
  });

  describe("t() — Translation", () => {
    it("should return English title by default", () => {
      expect(t("title")).toBe("⚔️ Guardians of the Realm ⚔️");
    });

    it("should return Chinese title after switching", () => {
      setLang("zh-TW");
      expect(t("title")).toBe("⚔️ 守護者之境 ⚔️");
    });

    it("should return English play button text", () => {
      expect(t("play")).toBe("▶ Play");
    });

    it("should return Chinese play button text", () => {
      setLang("zh-TW");
      expect(t("play")).toBe("▶ 開始遊戲");
    });

    it("should return the key for unknown translations", () => {
      expect(t("unknown_key_xyz")).toBe("unknown_key_xyz");
    });

    it("should translate all tower names in English", () => {
      const towerKeys = [
        "tower_archer",
        "tower_cannon",
        "tower_ice",
        "tower_lightning",
        "tower_sniper",
      ];
      for (const key of towerKeys) {
        const result = t(key);
        expect(result).toBeTruthy();
        expect(result).not.toBe(key);
      }
    });

    it("should translate all tower names in Chinese", () => {
      setLang("zh-TW");
      expect(t("tower_archer")).toBe("弓箭手");
      expect(t("tower_cannon")).toBe("加農砲");
      expect(t("tower_ice")).toBe("冰霜");
      expect(t("tower_lightning")).toBe("閃電");
      expect(t("tower_sniper")).toBe("狙擊手");
    });

    it("should translate all enemy names in English", () => {
      const enemyKeys = [
        "enemy_goblin",
        "enemy_orc",
        "enemy_wolf",
        "enemy_darkKnight",
        "enemy_troll",
        "enemy_demon",
        "enemy_dragon",
        "enemy_lich",
        "enemy_titan",
        "enemy_phoenix",
      ];
      for (const key of enemyKeys) {
        const result = t(key);
        expect(result).toBeTruthy();
        expect(result).not.toBe(key);
      }
    });

    it("should translate all 50 level names in English", () => {
      for (let i = 0; i < 50; i++) {
        const result = t(`level_${i}`);
        expect(result).toBeTruthy();
        expect(result).not.toBe(`level_${i}`);
      }
    });

    it("should translate all 50 level names in Chinese", () => {
      setLang("zh-TW");
      for (let i = 0; i < 50; i++) {
        const result = t(`level_${i}`);
        expect(result).toBeTruthy();
        expect(result).not.toBe(`level_${i}`);
      }
    });

    it("should translate UI action strings", () => {
      expect(t("upgrade")).toBe("⬆ Upgrade");
      expect(t("sell")).toBe("💰 Sell");
      expect(t("close")).toBe("✕ Close");
      expect(t("victory")).toBe("🎉 Victory!");
      expect(t("defeat")).toBe("💀 Defeat");
    });

    it("should translate UI action strings in Chinese", () => {
      setLang("zh-TW");
      expect(t("upgrade")).toBe("⬆ 升級");
      expect(t("sell")).toBe("💰 出售");
      expect(t("close")).toBe("✕ 關閉");
      expect(t("victory")).toBe("🎉 勝利！");
      expect(t("defeat")).toBe("💀 失敗");
    });
  });
});
