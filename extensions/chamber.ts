import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { DynamicBorder } from "@earendil-works/pi-coding-agent";
import { Container, getCapabilities, Image, Key, matchesKey, type SelectItem, SelectList, Text } from "@earendil-works/pi-tui";
import { runDoctorChecks, showDoctorReport } from "../lib/doctor";
import * as fs from "fs";
import * as path from "path";
import { WALDEMAR_PACKAGE_ROOT } from "../lib/waldemar";

type ChamberAction =
  | "posture"
  | "inventory"
  | "doctor"
  | "systemPrompt"
  | "chronicles"
  | "arms"
  | "compact"
  | "theme"
  | "customize"
  | "setup";

const POSTURE_ITEMS: SelectItem[] = [
  { value: "watch", label: "watch", description: "Balanced default service; restores the prior arsenal after special formations." },
  { value: "reconnaissance", label: "reconnaissance", description: "Read-first scouting; mutation tools are removed while Waldemar maps the field." },
  { value: "forge", label: "forge", description: "Focused implementation; editing tools are available for disciplined changes." },
  { value: "seal", label: "seal", description: "Validation and readiness review; mutation tools are removed unless explicitly ordered." },
  { value: "siege", label: "siege", description: "Deep debugging; broader tools and higher thinking for patient breach analysis." },
  { value: "council", label: "council", description: "Architecture and decision discussion; read-only by default." },
];

const FALKENSEE_COMPACT = `I receive rank as duty, knowledge as trust, and command as burden.
I shall not conceal uncertainty behind confidence.
I shall not purchase speed with avoidable ruin.
I shall preserve what is sound, correct what is broken, and document what must endure.
I shall speak plainly when silence would endanger the work.
I shall serve the King with discipline, precision, and noble purpose.
By code, by craft, and by honour, the line shall hold.`;

/** Central Waldemar command chamber and ceremonial overlays. */
export default function chamberExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar", {
    description: "Open Waldemar's command chamber",
    handler: async (_args, ctx) => {
      const action = await chooseChamberAction(ctx);
      if (!action) return;
      await executeChamberAction(pi, ctx, action);
    },
  });

  pi.registerCommand("waldemar-arms", {
    description: "Display Waldemar of Falkensee's heraldic achievement",
    handler: async (_args, ctx) => {
      await showArms(ctx);
    },
  });

  pi.registerCommand("falkensee-compact", {
    description: "Display the Falkensee Compact",
    handler: async (_args, ctx) => {
      await showCompact(ctx);
    },
  });

  pi.registerCommand("waldemar-theme", {
    description: "Select a Waldemar theme for the current TUI session",
    getArgumentCompletions: (prefix: string) => ["falkensee-heraldry", "chronicle-keeper"]
      .filter((name) => name.startsWith(prefix.trim()))
      .map((name) => ({ value: name, label: name })),
    handler: async (args, ctx) => {
      await chooseTheme(ctx, args.trim());
    },
  });
}

async function chooseChamberAction(ctx: ExtensionContext): Promise<ChamberAction | undefined> {
  if (ctx.mode !== "tui") {
    ctx.ui.notify(
      "Waldemar's command chamber requires the TUI. Available orders: /posture, /waldemar-inventory, /waldemar-doctor, /waldemar-system-prompt, /chronicles, /waldemar-arms, /falkensee-compact, /waldemar-theme.",
      "info",
    );
    return undefined;
  }

  const items: SelectItem[] = [
    { value: "posture", label: "Change guard posture", description: "Reconnaissance, Forge, Seal, Siege, Council, or Watch" },
    { value: "inventory", label: "Inspect arsenal", description: "Packages, MCP servers, and skills" },
    { value: "doctor", label: "Run doctor", description: "Package and machine readiness checks" },
    { value: "systemPrompt", label: "Inspect system prompt", description: "View the first captured system prompt in a scrollable panel" },
    { value: "chronicles", label: "Review chronicle", description: "Recent Falkensee campaign marks" },
    { value: "arms", label: "Display arms", description: "Waldemar of Falkensee's heraldic achievement" },
    { value: "compact", label: "Recite compact", description: "The Falkensee Compact" },
    { value: "theme", label: "Change livery", description: "Switch between Waldemar themes" },
    { value: "customize", label: "Open customization map", description: "Where to alter the captain's quarters" },
    { value: "setup", label: "Stage setup order", description: "Place /waldemar-setup in the editor for review" },
  ];

  return ctx.ui.custom<ChamberAction | undefined>((tui, theme, _keybindings, done) => {
    const container = new Container();
    const borderColor = (text: string) => theme.fg("borderAccent", text);

    container.addChild(new DynamicBorder(borderColor));
    container.addChild(new Text(theme.fg("accent", theme.bold("Waldemar's Command Chamber")), 1, 0));
    container.addChild(new Text(theme.fg("muted", "Choose the next order. Esc returns to the field."), 1, 0));

    const list = new SelectList(items, Math.min(items.length + 1, 12), {
      selectedPrefix: (text) => theme.fg("accent", text),
      selectedText: (text) => theme.fg("accent", text),
      description: (text) => theme.fg("muted", text),
      scrollInfo: (text) => theme.fg("dim", text),
      noMatch: (text) => theme.fg("warning", text),
    });
    list.onSelect = (item) => done(item.value as ChamberAction);
    list.onCancel = () => done(undefined);

    container.addChild(list);
    container.addChild(new Text(theme.fg("dim", "↑↓ navigate • enter select • esc cancel"), 1, 0));
    container.addChild(new DynamicBorder(borderColor));

    return {
      render: (width: number) => container.render(width),
      invalidate: () => container.invalidate(),
      handleInput: (data: string) => {
        list.handleInput?.(data);
        tui.requestRender();
      },
    };
  });
}

async function executeChamberAction(pi: ExtensionAPI, ctx: ExtensionContext, action: ChamberAction) {
  switch (action) {
    case "posture": {
      const selected = await choosePosture(ctx);
      if (selected) pi.sendUserMessage(`/posture ${selected}`);
      return;
    }
    case "inventory":
      pi.sendUserMessage("/waldemar-inventory");
      return;
    case "doctor":
      await showDoctorReport(ctx, runDoctorChecks());
      return;
    case "systemPrompt":
      pi.sendUserMessage("/waldemar-system-prompt");
      return;
    case "chronicles":
      pi.sendUserMessage("/chronicles");
      return;
    case "arms":
      await showArms(ctx);
      return;
    case "compact":
      await showCompact(ctx);
      return;
    case "theme":
      await chooseTheme(ctx);
      return;
    case "customize":
      pi.sendUserMessage("/waldemar-customize");
      return;
    case "setup":
      ctx.ui.setEditorText("/waldemar-setup");
      ctx.ui.notify("Setup order staged in the editor for your inspection.", "info");
      return;
  }
}

async function choosePosture(ctx: ExtensionContext): Promise<string | undefined> {
  if (ctx.mode !== "tui") {
    const selected = await ctx.ui.select("Choose Falkensee guard posture", POSTURE_ITEMS.map((item) => String(item.value)));
    return selected;
  }

  return ctx.ui.custom<string | undefined>((tui, theme, _keybindings, done) => {
    const container = new Container();
    const borderColor = (text: string) => theme.fg("borderAccent", text);

    container.addChild(new DynamicBorder(borderColor));
    container.addChild(new Text(theme.fg("accent", theme.bold("Choose Falkensee Guard Posture")), 1, 0));
    container.addChild(new Text(theme.fg("muted", "The formation changes tools, thinking level, and per-turn doctrine."), 1, 0));

    const list = new SelectList(POSTURE_ITEMS, POSTURE_ITEMS.length + 1, {
      selectedPrefix: (text) => theme.fg("accent", text),
      selectedText: (text) => theme.fg("accent", text),
      description: (text) => theme.fg("muted", text),
      scrollInfo: (text) => theme.fg("dim", text),
      noMatch: (text) => theme.fg("warning", text),
    });
    list.onSelect = (item) => done(String(item.value));
    list.onCancel = () => done(undefined);

    container.addChild(list);
    container.addChild(new Text(theme.fg("dim", "↑↓ navigate • enter select • esc cancel"), 1, 0));
    container.addChild(new DynamicBorder(borderColor));

    return {
      render: (width: number) => container.render(width),
      invalidate: () => container.invalidate(),
      handleInput: (data: string) => {
        list.handleInput?.(data);
        tui.requestRender();
      },
    };
  });
}

async function showArms(ctx: ExtensionContext) {
  const imagePath = path.join(WALDEMAR_PACKAGE_ROOT, "waldemar-of-falkensee.png");

  if (ctx.mode !== "tui") {
    ctx.ui.notify(`Waldemar's arms: ${imagePath}`, "info");
    return;
  }

  if (!fs.existsSync(imagePath)) {
    ctx.ui.notify(`Heraldic image not found: ${imagePath}`, "warning");
    return;
  }

  const capabilities = getCapabilities();
  if (!capabilities.images) {
    ctx.ui.notify(
      `⚔️ Waldemar's heraldic achievement cannot be rendered in this terminal.\n\nImage protocol support was not detected. Open the image file directly instead:\n${imagePath}`,
      "info"
    );
    return;
  }

  const imageData = fs.readFileSync(imagePath).toString("base64");

  await ctx.ui.custom<void>((_tui, theme, _keybindings, done) => {
    const container = new Container();
    container.addChild(new Text(theme.fg("accent", theme.bold("Waldemar of Falkensee")), 1, 0));
    container.addChild(new Text(theme.fg("muted", "Captain of the King's Personal Guard · Warden of the Ordered Line"), 1, 0));
    container.addChild(new Image(imageData, "image/png", { fallbackColor: (text: string) => theme.fg("muted", text) }, { maxWidthCells: 72, maxHeightCells: 24, filename: "waldemar-of-falkensee.png" }));
    container.addChild(new Text(theme.fg("dim", "Enter or Esc closes the heraldic display."), 1, 0));

    return {
      render: (width: number) => container.render(width),
      invalidate: () => container.invalidate(),
      handleInput: (data: string) => {
        if (matchesKey(data, Key.enter) || matchesKey(data, Key.escape) || data === "q") done(undefined);
      },
    };
  }, {
    overlay: true,
    overlayOptions: {
      width: "80%",
      minWidth: 50,
      maxHeight: "90%",
      anchor: "center",
      margin: 2,
    },
  });
}

async function showCompact(ctx: ExtensionContext) {
  if (ctx.mode !== "tui") {
    ctx.ui.notify(`The Falkensee Compact\n\n${FALKENSEE_COMPACT}`, "info");
    return;
  }

  await ctx.ui.custom<void>((_tui, theme, _keybindings, done) => {
    const container = new Container();
    container.addChild(new DynamicBorder((text: string) => theme.fg("borderAccent", text)));
    container.addChild(new Text(theme.fg("accent", theme.bold("The Falkensee Compact")), 1, 0));
    container.addChild(new Text(FALKENSEE_COMPACT, 1, 1));
    container.addChild(new Text(theme.fg("dim", "Enter or Esc returns to the field."), 1, 0));
    container.addChild(new DynamicBorder((text: string) => theme.fg("borderAccent", text)));

    return {
      render: (width: number) => container.render(width),
      invalidate: () => container.invalidate(),
      handleInput: (data: string) => {
        if (matchesKey(data, Key.enter) || matchesKey(data, Key.escape) || data === "q") done(undefined);
      },
    };
  }, {
    overlay: true,
    overlayOptions: {
      width: "70%",
      minWidth: 50,
      maxHeight: "80%",
      anchor: "center",
      margin: 2,
    },
  });
}

async function chooseTheme(ctx: ExtensionContext, requested?: string) {
  if (!ctx.hasUI) return;

  const available = ctx.ui.getAllThemes().map((theme) => theme.name);
  const preferred = ["falkensee-heraldry", "chronicle-keeper"].filter((name) => available.includes(name));
  const options = preferred.length > 0 ? preferred : available;
  const selected = requested || (await ctx.ui.select("Choose command chamber livery", options));

  if (!selected) return;

  const result = ctx.ui.setTheme(selected);
  if (result.success) {
    ctx.ui.notify(`Theme selected: ${selected}`, "info");
    return;
  }

  ctx.ui.notify(`Could not select theme ${selected}: ${result.error}`, "error");
}
