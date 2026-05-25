// Interactive Mercado prototype — connected to Flask backend.
// Real: POST /scan, GET/POST /inventory (incl. expiry_date + location).
// Still mock: recipes (no recipe DB yet).

const { useState, useEffect, useRef } = React;

const API_BASE = '';

// days between today and an ISO date string; null if no date
const calcDaysLeft = (isoDate) => {
  if (!isoDate) return null;
  const diff = new Date(isoDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── theme ───────────────────────────────────────────────────
const M = {
  bg:    '#F6F0E4',
  paper: '#FAF6EE',
  ink:   '#1F1B16',
  ink2:  '#5B554C',
  ink3:  '#8C857B',
  terra: '#C24A2E',
  olive: '#5E6B2F',
  serif: '"DM Serif Display", "Noto Serif TC", Georgia, serif',
  sans:  '"Inter", "Noto Sans TC", system-ui, sans-serif',
  mono:  'ui-monospace, "SF Mono", Menlo, monospace',
};

// ─── primitives ──────────────────────────────────────────────
const Mock = ({ children = 'mock', tone = 'default' }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:3,
    padding:'1px 6px', marginLeft:6,
    fontFamily: M.mono, fontSize: 9, letterSpacing: 0.6,
    color: M.terra, border: `0.5px dashed ${M.terra}77`,
    borderRadius: 3, textTransform:'uppercase',
    verticalAlign: 'middle', whiteSpace:'nowrap',
    background: tone === 'inverse' ? 'rgba(250,246,238,0.12)' : 'rgba(194,74,46,0.06)',
  }}>
    <span style={{ fontWeight:700 }}>·</span>{children}
  </span>
);

const Rule = ({ label, no, right, light }) => (
  <div style={{
    display:'flex', alignItems:'baseline', gap:8, padding:'0 22px',
    fontFamily: M.mono, fontSize: 9.5, letterSpacing: 1.5, textTransform:'uppercase',
    color: light ? 'rgba(250,246,238,0.8)' : M.ink2,
  }}>
    {no && <span style={{ color: M.terra, fontWeight:600 }}>№ {no}</span>}
    <span>{label}</span>
    <div style={{ flex:1, height:1, background: light ? 'rgba(250,246,238,0.3)' : M.ink, opacity:0.22 }}/>
    {right && <span>{right}</span>}
  </div>
);

const Btn = ({ children, onClick, primary, flex=1, dark }) => (
  <button onClick={onClick} style={{
    flex, border: `1px solid ${M.ink}`,
    background: primary ? M.ink : (dark ? 'transparent' : M.paper),
    color: primary ? M.paper : (dark ? M.paper : M.ink),
    padding: '16px 0', fontFamily: M.serif, fontSize: 17,
    cursor: 'pointer', letterSpacing: 0.2,
    transition: 'transform .12s ease, background .12s ease',
  }}
  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >{children}</button>
);

// ─── 01 Home ─────────────────────────────────────────────────
function Home({ nav, inventory }) {
  const totalCount = inventory !== null ? inventory.length : FOODS.length;

  // use real inventory expiry data if available, fall back to mock FOODS
  const expiringItems = inventory !== null
    ? inventory
        .map(item => ({ ...item, daysLeft: calcDaysLeft(item.expiry_date) }))
        .filter(item => item.daysLeft !== null && item.daysLeft <= 2)
        .slice(0, 3)
    : FOODS.filter(f => f.daysLeft <= 2).slice(0, 3);

  const renderExpiringRow = (item, i) => {
    const isReal = inventory !== null;
    const f = isReal
      ? (foodById(item.item_name) || foodByName(item.item_name) || {})
      : item;
    const display = { ...f, zh: f.zh || item.item_name, en: f.en || item.item_name };
    const dl = isReal ? item.daysLeft : item.daysLeft;

    return (
      <div key={isReal ? item.item_name : item.id}
        onClick={() => nav('confirm-existing', isReal ? item.item_name : item.id)}
        style={{ display:'flex', gap:14, alignItems:'center', cursor:'pointer', padding:'6px 0', borderRadius:4, transition:'background .12s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <FoodImage food={display} w={64} h={84} radius={2} label={false} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:2 }}>
            <span style={{ fontFamily: M.mono, fontSize:10, color: M.ink3, letterSpacing:1 }}>{String(i+1).padStart(2,'0')}</span>
            <span style={{ fontFamily: M.mono, fontSize:9, color: M.ink3, letterSpacing:1, textTransform:'uppercase' }}>{display.cat || '蔬果'}</span>
          </div>
          <div style={{ fontFamily: M.serif, fontSize:22, lineHeight:1.1 }}>{display.zh}</div>
          <div style={{ fontStyle:'italic', fontSize:12, color: M.ink2 }}>{display.en}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily: M.serif, fontSize:32, lineHeight:1, letterSpacing:-0.5, color: dl<=0 ? M.terra : M.ink }}>
            {dl<=0 ? '今' : dl}
          </div>
          <div style={{ fontFamily: M.mono, fontSize:9, color: M.ink3, letterSpacing:1, marginTop:2 }}>
            {dl<=0 ? 'EXPIRES' : 'DAYS LEFT'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width:'100%', minHeight:'100%', background: M.bg, color: M.ink, fontFamily: M.sans }}>
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 18px)' }} />
      <div style={{ padding:'0 22px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontFamily: M.mono, fontSize: 10, letterSpacing: 2, color: M.ink2 }}>MERCADO · VOL 11 · WED</div>
        <div style={{ fontFamily: M.mono, fontSize: 10, letterSpacing: 2, color: M.ink2 }}>17.05.26</div>
      </div>

      <div style={{ padding:'8px 22px 18px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ fontFamily: M.serif, fontSize: 54, lineHeight: 0.95, letterSpacing: -1 }}>
          Today's<br/><span style={{ fontStyle:'italic', color: M.terra }}>harvest.</span>
        </div>
        <div style={{ marginTop:10, fontSize:13, color: M.ink2, lineHeight:1.5 }}>
          冰箱裡有 {totalCount} 樣食材
          {expiringItems.length > 0 && `；${expiringItems.length} 樣建議今明兩天消化完`}。
        </div>
      </div>

      {expiringItems.length > 0 && (
        <div style={{ padding:'18px 0 8px' }}>
          <Rule no="01" label="即將過期" right={`${expiringItems.length} ITEMS`} />
          <div style={{ padding:'14px 22px 0', display:'flex', flexDirection:'column', gap:14 }}>
            {expiringItems.map((item, i) => renderExpiringRow(item, i))}
          </div>
          <div style={{ padding:'14px 22px 0' }}>
            <div onClick={() => nav('inventory')} style={{ fontFamily: M.mono, fontSize: 10, letterSpacing: 1.8, color: M.terra, cursor:'pointer', textTransform:'uppercase' }}>
              查看完整冰箱 →
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:'24px 0 16px' }}>
        <Rule no="02" label="今日提案" right={<span>FROM YOUR KITCHEN<Mock>食譜資料庫</Mock></span>} />
        <div style={{ padding:'14px 22px 0' }}>
          {RECIPES.slice(0,2).map((r, i) => (
            <div key={r.id} onClick={() => nav('recipe', r.id)} style={{
              borderTop: i===0 ? 'none' : `0.5px solid ${M.ink}33`,
              padding: i===0 ? '0 0 14px' : '14px 0',
              display:'flex', gap:14, cursor:'pointer', transition:'opacity .12s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontFamily: M.mono, fontSize:10, color: M.terra, letterSpacing:1.5, marginBottom:4 }}>{r.min} MIN · {r.kcal} KCAL</div>
                <div style={{ fontFamily: M.serif, fontSize:22, lineHeight:1.15, marginBottom:6 }}>{r.zh}</div>
                <div style={{ fontStyle:'italic', fontSize:12, color: M.ink2 }}>消化 {r.uses.map(u => foodById(u).zh).join('、')}</div>
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                {r.uses.slice(0,2).map(u => <FoodImage key={u} food={foodById(u)} w={42} h={56} radius={2} label={false}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'8px 22px 32px' }}>
        <Btn primary onClick={() => nav('scan')}>掃描新食材 <span style={{ fontStyle:'italic', color: M.terra }}>→</span></Btn>
      </div>
    </div>
  );
}

// ─── 02 Scan ─────────────────────────────────────────────────
function Scan({ nav, back, onScanComplete }) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setScanning(true);
    setScanError(null);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/scan`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      onScanComplete(data);
    } catch (e) {
      setScanError('掃描失敗，請重試');
      setScanning(false);
    }
  };

  return (
    <div style={{ width:'100%', minHeight:'100%', background:'#1A1714', color: M.paper, fontFamily: M.sans, position:'relative' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />

      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 18px)' }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div onClick={back} style={{ cursor:'pointer', fontFamily: M.mono, fontSize:10, letterSpacing:2, color:'rgba(250,246,238,0.7)' }}>← MERCADO · CAPTURE</div>
        <div style={{ fontFamily: M.mono, fontSize:10, letterSpacing:2, color:'rgba(250,246,238,0.7)' }}>AUTO ⃝</div>
      </div>

      <div style={{ padding:'14px 22px 18px' }}>
        <div style={{ fontFamily: M.serif, fontSize: 38, lineHeight:1, letterSpacing:-0.5 }}>
          捕捉<br/><span style={{ fontStyle:'italic', color: M.terra }}>食材</span>
        </div>
      </div>

      <div style={{ position:'relative', margin:'0 22px', aspectRatio:'3/4', background:'#0F0D0B', overflow:'hidden' }}>
        <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)' }}/>
        {[{top:14,left:14,brT:1,brL:1},{top:14,right:14,brT:1,brR:1},{bottom:14,left:14,brB:1,brL:1},{bottom:14,right:14,brB:1,brR:1}].map((p,i) => (
          <div key={i} style={{ position:'absolute', width:22, height:22, ...p,
            borderTop:p.brT?`1px solid ${M.paper}`:0, borderLeft:p.brL?`1px solid ${M.paper}`:0,
            borderRight:p.brR?`1px solid ${M.paper}`:0, borderBottom:p.brB?`1px solid ${M.paper}`:0 }}/>
        ))}
        {scanning ? (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.65)', flexDirection:'column', gap:10 }}>
            <div style={{ fontFamily: M.mono, fontSize:11, letterSpacing:2, color: M.paper }}>SCANNING…</div>
            <div style={{ fontFamily: M.mono, fontSize:9, color:'rgba(250,246,238,0.5)', letterSpacing:1 }}>RUNNING MODEL</div>
          </div>
        ) : (
          <div style={{ position:'absolute', left:14, bottom:14, padding:'6px 10px', background:'rgba(250,246,238,0.92)', color: M.ink, fontFamily: M.mono, fontSize:10, letterSpacing:1, textTransform:'uppercase' }}>
            <span style={{ color: M.terra }}>● </span>READY · TAP SHUTTER
          </div>
        )}
        <div style={{ position:'absolute', right:14, top:14, fontFamily: M.mono, fontSize:9, letterSpacing:1, opacity:0.7 }}>F2.8 · ISO 200</div>
      </div>

      {scanError && (
        <div style={{ margin:'10px 22px 0', padding:'8px 12px', background:'rgba(194,74,46,0.18)', color: M.terra, fontFamily: M.mono, fontSize:10, letterSpacing:1 }}>{scanError}</div>
      )}

      <div style={{ padding:'18px 22px 0', textAlign:'center' }}>
        <div style={{ fontFamily: M.serif, fontStyle:'italic', fontSize:17 }}>"把食材置中，光線要勻。"</div>
        <div style={{ fontFamily: M.mono, fontSize:9, color:'rgba(250,246,238,0.7)', letterSpacing:2, marginTop:6 }}>PRO TIP · 01 / 03</div>
      </div>

      <div style={{ marginTop: 36, display:'flex', justifyContent:'center', alignItems:'center', gap:36, paddingBottom: 48 }}>
        <div style={{ fontFamily: M.mono, fontSize:10, color:'rgba(250,246,238,0.7)', letterSpacing:2, width:50, textAlign:'center' }}>FLASH<br/>OFF</div>
        <div onClick={() => { if (!scanning) fileRef.current?.click(); }} style={{
          width:76, height:76, borderRadius:'50%', border:`2px solid ${scanning ? M.terra : M.paper}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor: scanning ? 'not-allowed' : 'pointer', transition:'transform .12s ease', opacity: scanning ? 0.7 : 1,
        }}
          onMouseDown={e => { if (!scanning) e.currentTarget.style.transform = 'scale(0.92)'; }}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ width:62, height:62, borderRadius:'50%', background: scanning ? M.terra : M.paper }} />
        </div>
        <div style={{ fontFamily: M.mono, fontSize:10, color: M.terra, letterSpacing:2, width:50, textAlign:'center' }}>UPLOAD<br/>•</div>
      </div>
    </div>
  );
}

// ─── 03 Confirm ──────────────────────────────────────────────
const Row = ({ k, v, sub, terra, mock }) => (
  <div style={{ padding:'12px 0', borderBottom:`0.5px solid ${M.ink}22`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
    <div style={{ fontFamily: M.mono, fontSize:10, color: M.ink2, letterSpacing:1.5, textTransform:'uppercase' }}>
      {k}{mock && <Mock>{mock}</Mock>}
    </div>
    <div style={{ textAlign:'right' }}>
      <div style={{ fontFamily: M.serif, fontSize:18, color: terra ? M.terra : M.ink }}>{v}</div>
      {sub && <div style={{ fontFamily: M.mono, fontSize:9, color: M.ink3, letterSpacing:1, marginTop:2 }}>{sub}</div>}
    </div>
  </div>
);

function Confirm({ nav, back, onCommit, scanResult, foodId='tomato', presetConf, existingItem }) {
  const isRealScan = !!scanResult;
  const className = scanResult?.class_name || foodId;
  const f = foodById(className) || (() => {
    const d = foodByName(className);
    return { id: className, conf: scanResult?.confidence ?? 0.5, daysLeft: null, ...d };
  })();

  const conf = isRealScan ? scanResult.confidence : (presetConf !== undefined ? presetConf : f.conf);
  const modelLabel = scanResult?.source === 'meat_clip_model' ? 'CLIP zero-shot'
                   : isRealScan ? 'ResNet-50'
                   : (f.cat === '肉類' ? 'CLIP zero-shot' : 'ResNet-50');

  // editable fields — pre-fill from existing inventory item if available
  const [expiryDate, setExpiryDate]       = useState(existingItem?.expiry_date || '');
  const [location, setLocation]           = useState(existingItem?.location    || '冷藏');
  const [scanningExpiry, setScanningExpiry] = useState(false);
  const [expiryError, setExpiryError]     = useState(null);
  const expiryFileRef = useRef(null);

  const handleExpiryFile = async (file) => {
    if (!file) return;
    setScanningExpiry(true);
    setExpiryError(null);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/scan-expiry`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.expiry_date) {
        setExpiryDate(data.expiry_date);
      } else {
        setExpiryError('找不到日期，請手動輸入');
      }
    } catch (e) {
      setExpiryError('掃描失敗，請手動輸入');
    } finally {
      setScanningExpiry(false);
    }
  };

  const handleCommit = () => {
    if (onCommit) onCommit(className, conf, expiryDate || null, location);
    nav('inventory');
  };

  const dl = expiryDate ? calcDaysLeft(expiryDate) : null;

  return (
    <div style={{ width:'100%', minHeight:'100%', background: M.bg, color: M.ink, fontFamily: M.sans }}>
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 18px)' }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div onClick={back} style={{ cursor:'pointer', fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>← CAPTURE · RESULT</div>
        <div style={{ fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>{isRealScan ? 'LIVE' : '16:42'}</div>
      </div>

      <div style={{ padding:'14px 22px 16px' }}>
        <div style={{ aspectRatio:'4/5', position:'relative' }}>
          <FoodImage food={f} w="100%" h="100%" label={false}/>
          <div style={{ position:'absolute', top:10, left:10, background: M.paper, color: M.ink, padding:'4px 8px', fontFamily: M.mono, fontSize:9, letterSpacing:1.5 }}>
            {isRealScan ? `SCAN · ${modelLabel}` : `№ ${String(FOODS.indexOf(f)+1).padStart(3,'0')} · ${modelLabel}`}
          </div>
        </div>
      </div>

      <div style={{ padding:'0 22px 16px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={{ fontFamily: M.mono, fontSize:10, color: M.ink2, letterSpacing:1.5 }}>{f.cat || '蔬果'} · FOOD</div>
          <div style={{ fontFamily: M.mono, fontSize:10, color: M.terra, letterSpacing:1.5 }}>CONF · {Math.round(conf*100)}%</div>
        </div>
        <div style={{ fontFamily: M.serif, fontSize: 50, lineHeight:1, marginTop:6, letterSpacing:-1 }}>{f.zh || className}</div>
        <div style={{ fontFamily: M.serif, fontStyle:'italic', fontSize:24, color: M.ink2, marginTop:2 }}>{f.en || className}</div>
      </div>

      <div style={{ padding:'14px 22px 0' }}>
        {/* 到期日 — date input + scan button */}
        <input ref={expiryFileRef} type="file" accept="image/*" capture="environment"
          style={{ display:'none' }} onChange={e => handleExpiryFile(e.target.files?.[0])} />
        <div style={{ padding:'12px 0', borderBottom:`0.5px solid ${M.ink}22`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ fontFamily: M.mono, fontSize:10, color: M.ink2, letterSpacing:1.5, textTransform:'uppercase' }}>到期日</div>
            <div
              onClick={() => { if (!scanningExpiry) expiryFileRef.current?.click(); }}
              style={{
                padding:'2px 8px', border:`0.5px solid ${M.terra}`, color: M.terra,
                fontFamily: M.mono, fontSize:9, letterSpacing:1, cursor: scanningExpiry ? 'not-allowed' : 'pointer',
                opacity: scanningExpiry ? 0.5 : 1, whiteSpace:'nowrap',
              }}
            >
              {scanningExpiry ? 'SCANNING…' : '⌖ 掃描'}
            </div>
          </div>
          <input
            type="date"
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            style={{
              border:'none', background:'transparent', outline:'none',
              fontFamily: M.serif, fontSize:18, color: expiryDate ? (dl<=2 ? M.terra : M.ink) : M.ink3,
              textAlign:'right', cursor:'pointer', minWidth:0,
            }}
          />
        </div>
        {expiryError && (
          <div style={{ padding:'4px 0', fontFamily: M.mono, fontSize:9, color: M.terra, letterSpacing:1 }}>{expiryError}</div>
        )}

        {expiryDate && (
          <div style={{ padding:'4px 0 8px', textAlign:'right', fontFamily: M.mono, fontSize:9, color: dl<=0 ? M.terra : M.ink3, letterSpacing:1 }}>
            {dl<=0 ? '今天到期' : dl===1 ? '明天到期' : `${dl} 天後到期`}
          </div>
        )}

        <Row k="加入數量" v="× 1" />

        {/* 存放位置 — 3-way toggle */}
        <div style={{ padding:'12px 0', borderBottom:`0.5px solid ${M.ink}22`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily: M.mono, fontSize:10, color: M.ink2, letterSpacing:1.5, textTransform:'uppercase' }}>存放位置</div>
          <div style={{ display:'flex', gap:6 }}>
            {['冷藏', '冷凍', '常溫'].map(loc => (
              <div key={loc} onClick={() => setLocation(loc)} style={{
                padding:'4px 10px',
                background: location === loc ? M.ink : 'transparent',
                color: location === loc ? M.paper : M.ink,
                border: `0.5px solid ${M.ink}`,
                fontFamily: M.mono, fontSize:9, letterSpacing:1,
                cursor:'pointer', transition:'all .12s',
              }}>{loc}</div>
            ))}
          </div>
        </div>

        <Row k="信心分數" v={`${conf.toFixed(2)} · ${conf>0.8?'高':conf>0.5?'中':'低'}`} />
        <Row k="使用模型" v={modelLabel} />
      </div>

      <div style={{ padding:'22px 22px 32px', display:'flex', gap:10 }}>
        <Btn onClick={() => nav('scan')}>重拍</Btn>
        <Btn primary flex={2} onClick={handleCommit}>
          加入庫存 <span style={{ color: M.terra, fontStyle:'italic' }}>→</span>
        </Btn>
      </div>
    </div>
  );
}

// ─── 04 Inventory ────────────────────────────────────────────
const Stat = ({ n, l, terra }) => (
  <div>
    <div style={{ fontFamily: M.serif, fontSize:28, lineHeight:1, color: terra ? M.terra : M.ink }}>{n}</div>
    <div style={{ fontFamily: M.mono, fontSize:9, color: M.ink3, letterSpacing:1.5, marginTop:4 }}>{l}</div>
  </div>
);

function Inventory({ nav, back, justAdded, inventory }) {
  const isLoading = inventory === null;

  const displayItems = (inventory || []).map(item => {
    const base = foodById(item.item_name) || foodByName(item.item_name) || {};
    const daysLeft = calcDaysLeft(item.expiry_date);
    return {
      id:        item.item_name,
      zh:        base.zh    || item.item_name.replace(/_/g, ' '),
      en:        base.en    || item.item_name.replace(/_/g, ' '),
      cat:       base.cat   || '其他',
      c1:        base.c1    || '#AAA89C',
      c2:        base.c2    || '#5C5A54',
      shape:     base.shape || 'circle',
      daysLeft,
      quantity:    item.quantity,
      expiry_date: item.expiry_date,
      location:    item.location,
    };
  });

  const sorted = [...displayItems].sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));
  const expiringCount = displayItems.filter(f => f.daysLeft !== null && f.daysLeft <= 2 && f.daysLeft > 0).length;
  const overdueCount  = displayItems.filter(f => f.daysLeft !== null && f.daysLeft <= 0).length;

  const toastName = justAdded
    ? (foodById(justAdded)?.zh || foodByName(justAdded)?.zh || justAdded)
    : null;

  return (
    <div style={{ width:'100%', minHeight:'100%', background: M.bg, color: M.ink, fontFamily: M.sans, position:'relative' }}>
      {justAdded && <Toast>已加入庫存 · {toastName}</Toast>}
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 18px)' }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div onClick={back} style={{ cursor:'pointer', fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>← TODAY · PANTRY</div>
        <div style={{ fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>FILTER ▾</div>
      </div>

      <div style={{ padding:'14px 22px 18px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ fontFamily: M.serif, fontSize:44, lineHeight:0.95, letterSpacing:-0.5 }}>
          The <span style={{ fontStyle:'italic', color: M.olive }}>pantry.</span>
        </div>
        <div style={{ display:'flex', gap:24, marginTop:12 }}>
          <Stat n={isLoading ? '…' : displayItems.length} l="ITEMS" />
          <Stat n={isLoading ? '…' : (expiringCount || '—')} l="EXPIRING" terra={expiringCount > 0} />
          <Stat n={isLoading ? '…' : (overdueCount  || '—')} l="OVERDUE"  terra={overdueCount  > 0} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding:'24px 22px', fontFamily: M.mono, fontSize:11, color: M.ink3, letterSpacing:1 }}>載入庫存中…</div>
      ) : sorted.length === 0 ? (
        <div style={{ padding:'48px 22px', textAlign:'center' }}>
          <div style={{ fontFamily: M.serif, fontSize:28, color: M.ink2 }}>庫存是空的。</div>
          <div style={{ fontFamily: M.mono, fontSize:11, color: M.ink3, marginTop:8, letterSpacing:1 }}>掃描食材開始記錄</div>
        </div>
      ) : sorted.map((f, i) => (
        <div key={`${f.id}-${i}`}
          onClick={() => nav('confirm-existing', f.id)}
          style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom:`0.5px solid ${M.ink}22`, cursor:'pointer', transition:'background .12s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ fontFamily: M.mono, fontSize:11, color: M.ink3, width:24, letterSpacing:1 }}>{String(i+1).padStart(2,'0')}</div>
          <FoodImage food={f} w={42} h={56} radius={2} label={false}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily: M.serif, fontSize:20, lineHeight:1.05 }}>{f.zh}</div>
            <div style={{ fontFamily: M.mono, fontSize:9, color: M.ink3, letterSpacing:1.2, marginTop:2 }}>
              {f.cat.toUpperCase()} · {f.en.toUpperCase()}
              {f.location ? ` · ${f.location}` : ''}
              {f.quantity > 1 ? ` · ×${f.quantity}` : ''}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            {f.daysLeft !== null ? (
              <>
                <div style={{ fontFamily: M.serif, fontSize:22, lineHeight:1, color: f.daysLeft<=2 ? M.terra : M.ink }}>
                  {f.daysLeft<=0 ? '今' : f.daysLeft}
                </div>
                <div style={{ fontFamily: M.mono, fontSize:8.5, color: M.ink3, letterSpacing:1, marginTop:2 }}>
                  {f.daysLeft<=0 ? 'DUE' : 'D LEFT'}
                </div>
              </>
            ) : (
              <div style={{ fontFamily: M.mono, fontSize:9, color: M.ink3 }}>—</div>
            )}
          </div>
        </div>
      ))}
      <div style={{ height:60 }} />
      <div style={{ position:'sticky', bottom:0, padding:'14px 22px 32px', background:`linear-gradient(transparent, ${M.bg} 30%)` }}>
        <Btn primary onClick={() => nav('scan')}>掃描新食材 <span style={{ color: M.terra, fontStyle:'italic' }}>→</span></Btn>
      </div>
    </div>
  );
}

const Toast = ({ children }) => (
  <div style={{
    position:'absolute', top: 60, left: 22, right: 22, zIndex: 100,
    padding:'12px 14px', background: M.ink, color: M.paper,
    fontFamily: M.mono, fontSize:11, letterSpacing:1, textTransform:'uppercase',
    animation: 'toast-in .3s ease',
  }}>
    <span style={{ color: M.terra }}>✓ </span>{children}
  </div>
);

// ─── 05 Recipe Detail ────────────────────────────────────────
function Recipe({ nav, back, recipeId='r1' }) {
  const r = RECIPES.find(x => x.id === recipeId) || RECIPES[0];
  const stepsByRecipe = {
    r1: ['番茄切丁，菠菜去梗洗淨，用廚房紙拍乾。','中火熱鍋，橄欖油下鍋後先煎番茄丁約 90 秒，逼出甜味。','把菠菜整把丟進去快炒 30 秒，直到剛剛變色為止。','蛋液與少許帕馬森混合後倒入，小火加蓋燜 4 分鐘。','出鍋前撒上海鹽片與現磨黑胡椒，趁熱享用。'],
    r2: ['雞胸肉拍鬆，用鹽、黑胡椒、橄欖油醃 10 分鐘。','番茄與洋蔥切小丁，拌香菜、檸檬汁與少許橄欖油成莎莎醬。','中大火乾鍋下肉，單面煎 4 分鐘不要翻動。','翻面後關小火再煎 3 分鐘，起鍋靜置 5 分鐘。','斜切後淋上莎莎醬，搭配麵包或沙拉。'],
    r3: ['酪梨對切去核，蘋果去核切薄片。','檸檬汁、橄欖油、海鹽、少許楓糖打成淋醬。','薄荷葉撕碎與酪梨蘋果輕拌，淋醬上桌。'],
    r4: ['菠菜燙熟過冰水，擰乾切碎。','洋蔥末用奶油炒香後加入麵粉拌成奶油糊。','緩慢加入牛奶後一邊攪拌，煮到濃稠。','加入菠菜，熄火後拌入優格，撒胡椒鹽即可。'],
    r5: ['蘑菇切片，用奶油與一點百里香煎至上色。','酪梨用叉子壓成粗泥，拌入檸檬汁與鹽。','吐司烤至金黃，先塗酪梨泥再鋪蘑菇。'],
  };
  const steps = stepsByRecipe[r.id] || stepsByRecipe.r1;
  const heroFood = foodById(r.uses[0]);

  return (
    <div style={{ width:'100%', minHeight:'100%', background: M.bg, color: M.ink, fontFamily: M.sans }}>
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 18px)' }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div onClick={back} style={{ cursor:'pointer', fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>← TODAY · RECIPE</div>
        <div style={{ fontFamily: M.mono, fontSize:10, letterSpacing:2, color: M.ink2 }}>SAVE ◇</div>
      </div>

      <div style={{ padding:'14px 22px 0' }}>
        <div style={{ fontFamily: M.mono, fontSize:10, color: M.terra, letterSpacing:1.8 }}>
          RECIPE №.{r.id.toUpperCase()} · WEEKNIGHT<Mock>食譜資料庫</Mock>
        </div>
        <div style={{ fontFamily: M.serif, fontSize:42, lineHeight:1, marginTop:6, letterSpacing:-0.5 }}>{r.zh}</div>
        <div style={{ fontFamily: M.serif, fontStyle:'italic', fontSize:18, color: M.ink2, marginTop:4 }}>{r.en}</div>
      </div>

      <div style={{ padding:'16px 22px 0' }}>
        <div style={{ aspectRatio:'5/4', position:'relative' }}>
          <FoodImage food={heroFood} w="100%" h="100%" label={false}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 12px',
            background:'linear-gradient(transparent, rgba(0,0,0,0.6))',
            display:'flex', gap:16, color: M.paper, fontFamily: M.mono, fontSize:10, letterSpacing:1 }}>
            <span>{r.min} MIN</span><span>·</span><span>{r.kcal} KCAL</span><span>·</span><span>{r.saves} 人份</span>
          </div>
        </div>
      </div>

      <div style={{ padding:'18px 0 0' }}>
        <Rule no="i" label="使用你的食材" right={`SAVES ${r.uses.length} ITEMS`}/>
        <div style={{ padding:'12px 22px 0', display:'flex', gap:10 }}>
          {r.uses.map(id => {
            const f = foodById(id);
            return (
              <div key={id} style={{ flex:1, border:`0.5px solid ${M.ink}`, background: M.paper }}>
                <FoodImage food={f} w="100%" h={64} label={false}/>
                <div style={{ padding:'8px 10px' }}>
                  <div style={{ fontFamily: M.serif, fontSize:15, lineHeight:1.1 }}>{f.zh}</div>
                  <div style={{ fontFamily: M.mono, fontSize:9, color: M.terra, letterSpacing:1, marginTop:2 }}>
                    {f.daysLeft<=0 ? '今天到期' : `剩 ${f.daysLeft} 天`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding:'22px 0 0' }}>
        <Rule no="ii" label="作法" right={`${steps.length} STEPS`}/>
        <div style={{ padding:'14px 22px 0' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom: i===steps.length-1 ? 'none' : `0.5px solid ${M.ink}22` }}>
              <div style={{ fontFamily: M.serif, fontSize:24, color: M.terra, lineHeight:1, width:28, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
              <div style={{ fontFamily: M.serif, fontSize:16, lineHeight:1.4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'24px 22px 32px' }}>
        <Btn primary onClick={() => nav('home')}>開始烹煮 <span style={{ color: M.terra, fontStyle:'italic' }}>→</span></Btn>
      </div>
    </div>
  );
}

// ─── App shell ───────────────────────────────────────────────
function MercadoApp() {
  const [screen, setScreen]       = useState('home');
  const [stack, setStack]         = useState(['home']);
  const [params, setParams]       = useState({});
  const [animKey, setAnimKey]     = useState(0);
  const [justAdded, setJustAdded] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [inventory, setInventory]   = useState(null);

  const fetchInventory = () => {
    fetch(`${API_BASE}/inventory`)
      .then(r => r.json())
      .then(data => setInventory(data))
      .catch(() => setInventory([]));
  };

  useEffect(() => { fetchInventory(); }, []);

  const nav = (to, param) => {
    setScreen(to);
    setStack(s => [...s, to]);
    setAnimKey(k => k + 1);
    if (param) setParams(p => ({ ...p, [to]: param }));
    requestAnimationFrame(() => {
      const el = document.querySelector('.m-screen');
      if (el) el.scrollTop = 0;
    });
  };

  const back = () => {
    if (stack.length <= 1) return;
    const ns = stack.slice(0, -1);
    setStack(ns);
    setScreen(ns[ns.length - 1]);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    if (justAdded) {
      const t = setTimeout(() => setJustAdded(null), 2200);
      return () => clearTimeout(t);
    }
  }, [justAdded]);

  const onScanComplete = (result) => {
    setScanResult(result);
    nav('confirm');
  };

  const onCommit = async (itemName, confidence, expiryDate, location) => {
    try {
      await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name:   itemName,
          confidence,
          expiry_date: expiryDate || null,
          location:    location   || null,
        }),
      });
    } catch (e) { /* toast still shows */ }
    setJustAdded(itemName);
    fetchInventory();
  };

  // find the full inventory item for confirm-existing (to pre-fill date/location)
  const existingItem = params['confirm-existing']
    ? (inventory || []).find(i => i.item_name === params['confirm-existing'])
    : null;

  let view;
  switch (screen) {
    case 'home':
      view = <Home nav={nav} inventory={inventory} />;
      break;
    case 'scan':
      view = <Scan nav={nav} back={back} onScanComplete={onScanComplete} />;
      break;
    case 'confirm':
      view = <Confirm nav={nav} back={back} onCommit={onCommit} scanResult={scanResult} />;
      break;
    case 'confirm-existing':
      view = <Confirm nav={nav} back={back} onCommit={onCommit}
               foodId={params['confirm-existing']} existingItem={existingItem} />;
      break;
    case 'inventory':
      view = <Inventory nav={nav} back={back} justAdded={justAdded} inventory={inventory} />;
      break;
    case 'recipe':
      view = <Recipe nav={nav} back={back} recipeId={params.recipe} />;
      break;
    default:
      view = <Home nav={nav} inventory={inventory} />;
  }

  return (
    <div className="m-screen" key={animKey} style={{
      animation: 'screen-in .28s cubic-bezier(.2,.7,.3,1)',
      width: '100%', minHeight: '100%',
    }}>
      {view}
    </div>
  );
}

Object.assign(window, { MercadoApp });
