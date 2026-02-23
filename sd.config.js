import StyleDictionary from 'style-dictionary';

/* ---------------------------------------------------------------------------
 * Utility
 * ------------------------------------------------------------------------ */
const kebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/* ---------------------------------------------------------------------------
 * WE3 3-Tier Naming Convention
 *   reference.x  ->  --ref-x
 *   system.x     ->  --sys-x
 *   component.x  ->  --comp-x
 * ------------------------------------------------------------------------ */
const TIER = { reference: 'ref', system: 'sys', component: 'comp' };

// -- Reference tier: drop/rename path segments --------------------------------
const REF_DROP = new Set(['palette', 'typography']);
const REF_RENAME = { spacing: 'space', family: 'font', scale: 'text' };

// -- System tier: flatten compound sub-groups ---------------------------------
const SYS_TYPO = {
  fontFamily: 'font-family',
  displayFamily: 'font-display',
  monoFamily: 'font-mono',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  h1Size: 'text-h1',
  h2Size: 'text-h2',
  h3Size: 'text-h3',
  h4Size: 'text-h4',
};

const SYS_SPACING = {
  spacingUnit: 'spacing-unit',
  gutterSize: 'gutter',
  pagePadding: 'page-padding',
  cardPadding: 'card-padding',
  sectionPadding: 'section-padding',
  radiusUnit: 'radius-unit',
};

const SYS_SURFACE = {
  pageBackground: 'page',
  cardFill: 'card',
  altFill: 'alt',
  hoverFill: 'hover',
};

// -- Component tier: shorten property names -----------------------------------
const COMP = {
  background: 'bg',
  fontSize: 'font-size',
  primaryBg: 'primary-bg',
  secondaryBg: 'secondary-bg',
  secondaryBorder: 'secondary-border',
  ghostBg: 'ghost-bg',
  borderColor: 'border',
  focusRing: 'focus',
  strokeWidth: 'stroke',
  accentSurf: 'accent-surf',
  accentBrand: 'accent-brand',
  onAction: 'on-action',
  onDark: 'on-dark',
  hoverBorder: 'hover-border',
  defaultBg: 'default-bg',
  defaultBorder: 'default-border',
  defaultColor: 'default-color',
  accentBg: 'accent-bg',
  accentBorder: 'accent-border',
  accentColor: 'accent-color',
  highlightBg: 'highlight-bg',
  highlightBorder: 'highlight-border',
  highlightColor: 'highlight-color',
};

/* ---------------------------------------------------------------------------
 * Custom name transform  (CSS: --ref-neutral-ink, --sys-color-primary, etc.)
 * ------------------------------------------------------------------------ */
StyleDictionary.registerTransform({
  name: 'name/we3',
  type: 'name',
  transform: (token) => {
    const [tier, ...rest] = token.path;
    const prefix = TIER[tier] || tier;
    let segs = [...rest];

    if (tier === 'reference') {
      segs = segs.filter((s) => !REF_DROP.has(s));
      segs = segs.map((s) => REF_RENAME[s] || s);
    }

    if (tier === 'system') {
      if (segs[0] === 'typography' && SYS_TYPO[segs[1]]) {
        segs = [...SYS_TYPO[segs[1]].split('-'), ...segs.slice(2)];
      } else if (segs[0] === 'typography') {
        segs.shift();
      }
      if (segs[0] === 'spacing' && SYS_SPACING[segs[1]]) {
        segs = [...SYS_SPACING[segs[1]].split('-'), ...segs.slice(2)];
      } else if (segs[0] === 'spacing') {
        segs.shift();
      }
      if (segs[0] === 'surface' && SYS_SURFACE[segs[1]]) {
        segs = ['surface', SYS_SURFACE[segs[1]], ...segs.slice(2)];
      }
    }

    if (tier === 'component') {
      segs = segs.map((s) => COMP[s] || s);
    }

    return `${prefix}-${segs.map(kebab).join('-')}`;
  },
});

/* ---------------------------------------------------------------------------
 * Custom name transform for JS/TS  (PascalCase: RefNeutralInk, SysColorPrimary)
 * ------------------------------------------------------------------------ */
StyleDictionary.registerTransform({
  name: 'name/we3-js',
  type: 'name',
  transform: (token) => {
    return token.path
      .flatMap((s) => s.split('-'))
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  },
});

/* ---------------------------------------------------------------------------
 * Config
 * ------------------------------------------------------------------------ */
export default {
  source: ['./project.tokens.json'],
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ['name/we3'],
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.generated.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
          filter: (token) => !token.path.includes('compositions'),
        },
      ],
    },
    typescript: {
      transforms: ['name/we3-js'],
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.generated.ts',
          format: 'javascript/es6',
          filter: (token) => !token.path.includes('compositions'),
        },
      ],
    },
  },
};
