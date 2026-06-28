/* ============================================
   MAIN ENTRY POINT
   ============================================ */

import "./i18n";
import "./data/towers";
import "./data/enemies";
import "./data/levels";
import * as Game from "./game";
import { initUI } from "./ui";

// Initialize UI event bindings
initUI();

// Expose a test bridge so E2E tests can drive the engine headlessly.
(window as unknown as { __TD?: typeof Game }).__TD = Game;
