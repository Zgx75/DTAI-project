// shared data + helpers used by all 3 variations

const FOODS = [
  { id:'tomato',   zh:'牛番茄',     en:'Beef Tomato',     conf:0.94, daysLeft:3,  cat:'蔬果', c1:'#FF6B47', c2:'#C0331B', shape:'circle' },
  { id:'spinach',  zh:'菠菜',       en:'Spinach',         conf:0.88, daysLeft:1,  cat:'蔬果', c1:'#5DA046', c2:'#264D1A', shape:'leaf'   },
  { id:'chicken',  zh:'雞胸肉',     en:'Chicken Breast',  conf:0.91, daysLeft:0,  cat:'肉類', c1:'#F4D2B0', c2:'#B27A48', shape:'slab'   },
  { id:'milk',     zh:'全脂牛奶',   en:'Whole Milk',      conf:0.97, daysLeft:5,  cat:'乳品', c1:'#FAF3E6', c2:'#D7C7A2', shape:'bottle' },
  { id:'apple',    zh:'富士蘋果',   en:'Fuji Apple',      conf:0.96, daysLeft:9,  cat:'蔬果', c1:'#E84A3D', c2:'#7C1A14', shape:'circle' },
  { id:'avocado',  zh:'酪梨',       en:'Avocado',         conf:0.83, daysLeft:2,  cat:'蔬果', c1:'#7BA94F', c2:'#2F4019', shape:'pear'   },
  { id:'yogurt',   zh:'原味優格',   en:'Natural Yogurt',  conf:0.92, daysLeft:6,  cat:'乳品', c1:'#F2EAD2', c2:'#BFA877', shape:'cup'    },
  { id:'mushroom', zh:'白蘑菇',     en:'White Mushroom',  conf:0.79, daysLeft:4,  cat:'蔬果', c1:'#E8DCC0', c2:'#8C6A4A', shape:'circle' },
];

const RECIPES = [
  { id:'r1', zh:'番茄菠菜烘蛋',         en:'Tomato Spinach Frittata',     min:15, kcal:340, uses:['tomato','spinach'],          saves:2, level:'簡單', method:'平底鍋' },
  { id:'r2', zh:'香煎雞胸佐莎莎醬',     en:'Pan-Seared Chicken Salsa',    min:25, kcal:520, uses:['chicken','tomato'],          saves:2, level:'簡單', method:'平底鍋' },
  { id:'r3', zh:'酪梨蘋果薄荷沙拉',     en:'Avocado Apple Mint Salad',    min:10, kcal:280, uses:['apple','avocado'],           saves:2, level:'快手', method:'生食' },
  { id:'r4', zh:'菠菜優格濃湯',         en:'Spinach Yogurt Bisque',       min:30, kcal:310, uses:['spinach','yogurt','milk'],   saves:3, level:'中等', method:'燉煮' },
  { id:'r5', zh:'蘑菇酪梨吐司',         en:'Mushroom Avocado Toast',      min:12, kcal:420, uses:['mushroom','avocado'],        saves:2, level:'快手', method:'烤製' },
];

const foodById = (id) => FOODS.find(f => f.id === id);

// English to Chinese mapping for food names
const EN_TO_ZH = {
  'tomato': '牛番茄', 'beef tomato': '牛番茄',
  'spinach': '菠菜',
  'chicken': '雞胸肉', 'chicken breast': '雞胸肉',
  'milk': '全脂牛奶', 'whole milk': '全脂牛奶',
  'apple': '富士蘋果', 'fuji apple': '富士蘋果',
  'avocado': '酪梨',
  'yogurt': '原味優格', 'natural yogurt': '原味優格',
  'mushroom': '白蘑菇', 'white mushroom': '白蘑菇',
};

// ─────────────────────────────────────────────────────────────
// FoodImage — beautiful CSS-only "food blob" placeholder.
// Uses radial gradients to suggest a 3D, lit, appetizing object;
// adds a monospace label so the user knows this is where real
// product photography will drop in.
// ─────────────────────────────────────────────────────────────
function FoodImage({ food, w='100%', h='100%', label=true, labelColor, radius=0, style={} }) {
  if (!food) return null;
  const { c1, c2, shape, en } = food;

  // shape-specific highlight position
  const highlights = {
    circle: '28% 28%',
    leaf:   '35% 30%',
    slab:   '50% 30%',
    bottle: '40% 20%',
    pear:   '40% 25%',
    cup:    '50% 25%',
  };
  const hl = highlights[shape] || '30% 30%';

  return (
    <div style={{
      width:w, height:h, borderRadius:radius, position:'relative', overflow:'hidden',
      background: `
        radial-gradient(circle at ${hl}, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 30%),
        radial-gradient(circle at 75% 78%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 45%),
        radial-gradient(ellipse at 50% 50%, ${c1} 0%, ${c2} 110%)
      `,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
      ...style,
    }}>
      {label && (
        <div style={{
          position:'absolute', bottom:6, left:8, right:8,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 9, letterSpacing:0.5, textTransform:'uppercase',
          color: labelColor || 'rgba(255,255,255,0.78)',
          mixBlendMode:'difference',
          opacity:0.7, pointerEvents:'none',
        }}>
          {`photo · ${en}`}
        </div>
      )}
    </div>
  );
}

// Status helper — color band by daysLeft
function expiryStatus(daysLeft) {
  if (daysLeft <= 0) return { label:'今天到期', tone:'urgent' };
  if (daysLeft <= 2) return { label:`${daysLeft} 天`, tone:'warn' };
  if (daysLeft <= 5) return { label:`${daysLeft} 天`, tone:'ok' };
  return { label:`${daysLeft} 天`, tone:'fresh' };
}

// Map backend class_name → display properties (covers common label_map entries)
const FOOD_MAP = {
  tomato:       { zh:'番茄',   en:'Tomato',         cat:'蔬果', c1:'#FF6B47', c2:'#C0331B', shape:'circle' },
  beef_tomato:  { zh:'牛番茄', en:'Beef Tomato',     cat:'蔬果', c1:'#FF6B47', c2:'#C0331B', shape:'circle' },
  spinach:      { zh:'菠菜',   en:'Spinach',         cat:'蔬果', c1:'#5DA046', c2:'#264D1A', shape:'leaf'   },
  apple:        { zh:'蘋果',   en:'Apple',           cat:'蔬果', c1:'#E84A3D', c2:'#7C1A14', shape:'circle' },
  avocado:      { zh:'酪梨',   en:'Avocado',         cat:'蔬果', c1:'#7BA94F', c2:'#2F4019', shape:'pear'   },
  mushroom:     { zh:'蘑菇',   en:'Mushroom',        cat:'蔬果', c1:'#E8DCC0', c2:'#8C6A4A', shape:'circle' },
  carrot:       { zh:'紅蘿蔔', en:'Carrot',          cat:'蔬果', c1:'#FF8C42', c2:'#C25A1A', shape:'circle' },
  broccoli:     { zh:'花椰菜', en:'Broccoli',        cat:'蔬果', c1:'#4A8B3F', c2:'#1F4019', shape:'circle' },
  banana:       { zh:'香蕉',   en:'Banana',          cat:'蔬果', c1:'#FFD54F', c2:'#C8A015', shape:'pear'   },
  orange:       { zh:'柳橙',   en:'Orange',          cat:'蔬果', c1:'#FF9500', c2:'#C26000', shape:'circle' },
  lemon:        { zh:'檸檬',   en:'Lemon',           cat:'蔬果', c1:'#FFE135', c2:'#C8A800', shape:'circle' },
  cucumber:     { zh:'黃瓜',   en:'Cucumber',        cat:'蔬果', c1:'#5DA046', c2:'#264D1A', shape:'pear'   },
  bell_pepper:  { zh:'甜椒',   en:'Bell Pepper',     cat:'蔬果', c1:'#FF6B47', c2:'#C0331B', shape:'circle' },
  garlic:       { zh:'大蒜',   en:'Garlic',          cat:'蔬果', c1:'#FAF3E6', c2:'#D7C7A2', shape:'circle' },
  onion:        { zh:'洋蔥',   en:'Onion',           cat:'蔬果', c1:'#C4956A', c2:'#7A5230', shape:'circle' },
  potato:       { zh:'馬鈴薯', en:'Potato',          cat:'蔬果', c1:'#D4B896', c2:'#8C6A48', shape:'circle' },
  corn:         { zh:'玉米',   en:'Corn',            cat:'蔬果', c1:'#FFD54F', c2:'#C8A015', shape:'pear'   },
  asparagus:    { zh:'蘆筍',   en:'Asparagus',       cat:'蔬果', c1:'#5DA046', c2:'#264D1A', shape:'pear'   },
  cabbage:      { zh:'高麗菜', en:'Cabbage',         cat:'蔬果', c1:'#5DA046', c2:'#264D1A', shape:'circle' },
  eggplant:     { zh:'茄子',   en:'Eggplant',        cat:'蔬果', c1:'#6A2480', c2:'#3A0A4A', shape:'pear'   },
  ginger:       { zh:'薑',     en:'Ginger',          cat:'蔬果', c1:'#D4B896', c2:'#8C6A48', shape:'pear'   },
  milk:         { zh:'牛奶',   en:'Milk',            cat:'乳品', c1:'#FAF3E6', c2:'#D7C7A2', shape:'bottle' },
  yogurt:       { zh:'優格',   en:'Yogurt',          cat:'乳品', c1:'#F2EAD2', c2:'#BFA877', shape:'cup'    },
  cheese:       { zh:'乳酪',   en:'Cheese',          cat:'乳品', c1:'#FFD54F', c2:'#C8A015', shape:'slab'   },
  egg:          { zh:'雞蛋',   en:'Egg',             cat:'乳品', c1:'#F4D2B0', c2:'#C8A070', shape:'circle' },
  chicken:      { zh:'雞肉',   en:'Chicken',         cat:'肉類', c1:'#F4D2B0', c2:'#B27A48', shape:'slab'   },
  beef:         { zh:'牛肉',   en:'Beef',            cat:'肉類', c1:'#8B2020', c2:'#4A0A0A', shape:'slab'   },
  pork:         { zh:'豬肉',   en:'Pork',            cat:'肉類', c1:'#E8A0A0', c2:'#C05050', shape:'slab'   },
  fish:         { zh:'魚',     en:'Fish',            cat:'肉類', c1:'#A0C8E8', c2:'#5090B8', shape:'slab'   },
};

// Look up display props by backend class_name; falls back to generic grey tile
function foodByName(className) {
  if (!className) return null;
  const key = className.toLowerCase().replace(/[^a-z]/g, '_').replace(/^_+|_+$/g, '');
  const found = FOOD_MAP[key];
  if (found) return found;

  // Try to find Chinese name from EN_TO_ZH mapping
  const zhName = EN_TO_ZH[className.toLowerCase()];
  if (zhName) {
    return { zh: zhName, en: className, cat: '其他', c1: '#AAA89C', c2: '#5C5A54', shape: 'circle' };
  }

  return {
    zh: className.replace(/_/g, ' '), en: className.replace(/_/g, ' '),
    cat: '其他', c1: '#AAA89C', c2: '#5C5A54', shape: 'circle',
  };
}

Object.assign(window, { FOODS, RECIPES, foodById, FoodImage, expiryStatus, FOOD_MAP, foodByName });
