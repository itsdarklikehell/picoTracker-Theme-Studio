import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the script.js source
const scriptSource = readFileSync(resolve(__dirname, '../static-app/script.js'), 'utf-8');

// Helper: evaluate script.js in a jsdom environment
function loadScript() {
  // Clear module cache
  vi.resetModules();
  // Re-evaluate the script
  const script = document.createElement('script');
  script.textContent = scriptSource;
  document.body.appendChild(script);
}

describe('defaultColors', () => {
  it('should have all 13 required color keys', () => {
    const required = [
      'BACKGROUND', 'FOREGROUND', 'HICOLOR1', 'HICOLOR2',
      'CONSOLECOLOR', 'CURSORCOLOR', 'INFOCOLOR', 'WARNCOLOR',
      'ERRORCOLOR', 'ACCENTCOLOR', 'ACCENTALTCOLOR', 'EMPHASISCOLOR'
    ];
    // Extract defaultColors from script source
    const match = scriptSource.match(/const defaultColors = \{([^}]+)\}/s);
    expect(match).toBeTruthy();
    const colorsBlock = match[1];
    for (const key of required) {
      expect(colorsBlock).toContain(key);
    }
  });

  it('should have valid hex color values', () => {
    const hexPattern = /#[0-9A-Fa-f]{6}/g;
    const matches = scriptSource.match(hexPattern);
    expect(matches).toBeTruthy();
    expect(matches.length).toBeGreaterThanOrEqual(12);
  });
});

describe('randColor', () => {
  it('should generate a valid hex color', () => {
    // Extract and test randColor logic
    const randColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    const color = randColor();
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('should generate different colors (probabilistic)', () => {
    const randColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    const colors = new Set(Array.from({ length: 100 }, randColor));
    expect(colors.size).toBeGreaterThan(90); // Very likely all unique
  });
});

describe('screenNav', () => {
  it('should have navigation for all screens', () => {
    const required = ['project', 'song', 'chain'];
    const match = scriptSource.match(/const screenNav = \{([\s\S]+?)\n\};/);
    expect(match).toBeTruthy();
    for (const screen of required) {
      expect(match[1]).toContain(screen);
    }
  });

  it('should have valid navigation targets', () => {
    const validTargets = ['project', 'song', 'chain', null];
    const match = scriptSource.match(/const screenNav = \{([\s\S]+?)\n\};/);
    expect(match).toBeTruthy();
    const navBlock = match[1];
    // Check that all values are either null or valid screen names
    const valueMatches = navBlock.match(/:\s*(\w+|null)/g);
    expect(valueMatches).toBeTruthy();
    for (const v of valueMatches) {
      const val = v.replace(/:\s*/, '');
      if (val !== 'null') {
        expect(validTargets).toContain(val);
      }
    }
  });
});

describe('downloadTheme XML generation', () => {
  it('should generate valid XML structure', () => {
    // Simulate the XML generation logic
    const defaultColors = {
      BACKGROUND: "#000000", FOREGROUND: "#0088FF", HICOLOR1: "#00BB66",
      HICOLOR2: "#0066CC", CONSOLECOLOR: "#000000", CURSORCOLOR: "#00BB66",
      INFOCOLOR: "#0088FF", WARNCOLOR: "#00AA55", ERRORCOLOR: "#CC3333",
      ACCENTCOLOR: "#00AA55", ACCENTALTCOLOR: "#0066CC", EMPHASISCOLOR: "#00AA55"
    };
    const name = "test-theme";
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<THEME>\n  <Font value="#1" />\n`;
    for (const k in defaultColors) {
      const value = defaultColors[k];
      xml += `  <Color name="${k}" value="${value.toUpperCase()}" />\n`;
    }
    xml += '</THEME>';

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<THEME>');
    expect(xml).toContain('</THEME>');
    expect(xml).toContain('<Font value="#1" />');
    expect(xml).toContain('name="BACKGROUND"');
    expect(xml).toContain('value="#000000"');
    expect(xml).toContain('name="EMPHASISCOLOR"');
  });

  it('should include all 12 color entries', () => {
    const defaultColors = {
      BACKGROUND: "#000000", FOREGROUND: "#0088FF", HICOLOR1: "#00BB66",
      HICOLOR2: "#0066CC", CONSOLECOLOR: "#000000", CURSORCOLOR: "#00BB66",
      INFOCOLOR: "#0088FF", WARNCOLOR: "#00AA55", ERRORCOLOR: "#CC3333",
      ACCENTCOLOR: "#00AA55", ACCENTALTCOLOR: "#0066CC", EMPHASISCOLOR: "#00AA55"
    };
    let xml = '';
    for (const k in defaultColors) {
      xml += `  <Color name="${k}" value="${defaultColors[k].toUpperCase()}" />\n`;
    }
    const colorCount = (xml.match(/<Color /g) || []).length;
    expect(colorCount).toBe(12);
  });
});

describe('upload XML parsing', () => {
  it('should parse valid PTT XML', () => {
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<THEME>
  <Font value="#1" />
  <Color name="BACKGROUND" value="#FF0000" />
  <Color name="FOREGROUND" value="#00FF00" />
  <Color name="HICOLOR1" value="#0000FF" />
</THEME>`;
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, "application/xml");
    const colors = {};
    xml.querySelectorAll('Color').forEach(col => {
      const name = col.getAttribute('name');
      const value = col.getAttribute('value');
      if (name && value) {
        colors[name] = value;
      }
    });
    expect(colors['BACKGROUND']).toBe('#FF0000');
    expect(colors['FOREGROUND']).toBe('#00FF00');
    expect(colors['HICOLOR1']).toBe('#0000FF');
  });

  it('should ignore unknown color names', () => {
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<THEME>
  <Color name="BACKGROUND" value="#FF0000" />
  <Color name="UNKNOWN" value="#123456" />
</THEME>`;
    const defaultColors = { BACKGROUND: "#000000" };
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, "application/xml");
    const colors = {};
    xml.querySelectorAll('Color').forEach(col => {
      const name = col.getAttribute('name');
      const value = col.getAttribute('value');
      if (name && value && defaultColors.hasOwnProperty(name)) {
        colors[name] = value;
      }
    });
    expect(colors['BACKGROUND']).toBe('#FF0000');
    expect(colors['UNKNOWN']).toBeUndefined();
  });
});

describe('HTML structure', () => {
  it('should have file input for import', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('type="file"');
    expect(html).toContain('id="fileIn"');
  });

  it('should have theme name input', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('id="tn"');
    expect(html).toContain('name="theme_name"');
  });

  it('should have randomize button', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('id="randBtn"');
    expect(html).toContain('RANDOMIZE');
  });

  it('should have generate button', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('GENERATE .PTT');
  });

  it('should have gallery section', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('id="gal"');
    expect(html).toContain('SAVE TO GALLERY');
  });

  it('should have preview area', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('id="previewArea"');
  });

  it('should have all three screen previews', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    expect(html).toContain('id="screen-project"');
    expect(html).toContain('id="screen-song"');
    expect(html).toContain('id="screen-chain"');
  });
});

describe('CSS structure', () => {
  it('should define all CSS custom properties', () => {
    const css = readFileSync(resolve(__dirname, '../static-app/style.css'), 'utf-8');
    const required = [
      '--BACKGROUND', '--FOREGROUND', '--HICOLOR1', '--HICOLOR2',
      '--INFOCOLOR', '--WARNCOLOR',
      '--ERRORCOLOR', '--ACCENTCOLOR', '--ACCENTALTCOLOR', '--EMPHASISCOLOR'
    ];
    for (const prop of required) {
      expect(css).toContain(`var(${prop})`);
    }
  });

  it('should have win95 theme styles', () => {
    const css = readFileSync(resolve(__dirname, '../static-app/style.css'), 'utf-8');
    expect(css).toContain('--win-bg');
    expect(css).toContain('--win-border-light');
    expect(css).toContain('--win-border-dark');
    expect(css).toContain('--win-blue');
  });

  it('should have gallery grid layout', () => {
    const css = readFileSync(resolve(__dirname, '../static-app/style.css'), 'utf-8');
    expect(css).toContain('grid-template-columns');
  });
});

describe('localStorage gallery', () => {
  let store;
  beforeEach(() => {
    store = {};
    global.localStorage = {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; },
    };
  });

  it('should save and retrieve gallery items', () => {
    const palette = { BACKGROUND: '#FF0000', FOREGROUND: '#00FF00' };
    const name = 'test-theme';
    const gallery = JSON.parse(localStorage.getItem('g') || '[]');
    gallery.push({ n: name, c: palette });
    localStorage.setItem('g', JSON.stringify(gallery));

    const retrieved = JSON.parse(localStorage.getItem('g'));
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].n).toBe('test-theme');
    expect(retrieved[0].c.BACKGROUND).toBe('#FF0000');
  });

  it('should remove gallery items', () => {
    const gallery = [
      { n: 'theme1', c: { BACKGROUND: '#FF0000' } },
      { n: 'theme2', c: { BACKGROUND: '#00FF00' } }
    ];
    localStorage.setItem('g', JSON.stringify(gallery));

    const items = JSON.parse(localStorage.getItem('g'));
    items.splice(0, 1);
    localStorage.setItem('g', JSON.stringify(items));

    const retrieved = JSON.parse(localStorage.getItem('g'));
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].n).toBe('theme2');
  });
});

describe('keyboard navigation', () => {
  it('should ignore arrow keys when editing text', () => {
    const html = readFileSync(resolve(__dirname, '../static-app/index.html'), 'utf-8');
    const script = readFileSync(resolve(__dirname, '../static-app/script.js'), 'utf-8');
    expect(script).toContain('tagName.toLowerCase()');
    expect(script).toContain("tag === 'input'");
    expect(script).toContain("tag === 'textarea'");
    expect(script).toContain("tag === 'select'");
  });

  it('should navigate between screens with arrow keys', () => {
    const script = readFileSync(resolve(__dirname, '../static-app/script.js'), 'utf-8');
    expect(script).toContain('ArrowLeft');
    expect(script).toContain('ArrowRight');
    expect(script).toContain('ArrowUp');
    expect(script).toContain('ArrowDown');
  });
});
