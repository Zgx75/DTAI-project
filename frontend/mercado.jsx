// ─────────────────────────────────────────────────────────────
// Variation 01 · MERCADO
// Editorial food magazine. Cream paper, charcoal type, terra cotta
// accent. DM Serif Display for headlines, Inter for body, mono labels.
// ─────────────────────────────────────────────────────────────

const M = {
  bg:      '#F6F0E4',
  paper:   '#FAF6EE',
  ink:     '#1F1B16',
  ink2:    '#5B554C',
  ink3:    '#8C857B',
  rule:    '#1F1B16',
  terra:   '#C24A2E',
  olive:   '#5E6B2F',
  serif:   '"DM Serif Display", "Noto Serif TC", Georgia, serif',
  sans:    '"Inter", "Noto Sans TC", system-ui, sans-serif',
  mono:    'ui-monospace, "SF Mono", Menlo, monospace',
};

const MercadoShell = ({ children, dark=false }) => (
  <div style={{
    width:'100%', height:'100%', background:M.bg, color:M.ink,
    fontFamily: M.sans, position:'relative', overflow:'hidden',
  }}>{children}</div>
);

const MercadoRule = ({ label, no, right }) => (
  <div style={{
    display:'flex', alignItems:'baseline', gap:8,
    fontFamily:M.mono, fontSize:9.5, letterSpacing:1.5, textTransform:'uppercase',
    color:M.ink2, padding:'0 22px',
  }}>
    {no && <span style={{ color:M.terra, fontWeight:600 }}>№ {no}</span>}
    <span>{label}</span>
    <div style={{ flex:1, height:1, background:M.ink, opacity:0.18 }} />
    {right && <span>{right}</span>}
  </div>
);

// ── 01.1 Home ────────────────────────────────────────────────
function MercadoHome() {
  const expiring = FOODS.filter(f => f.daysLeft <= 2).slice(0, 3);
  return (
    <MercadoShell>
      {/* status bar space */}
      <div style={{ height: 56 }} />

      {/* masthead */}
      <div style={{ padding:'0 22px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          MERCADO · VOL 11 · WED
        </div>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          17.05.26
        </div>
      </div>

      <div style={{ padding:'8px 22px 18px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ fontFamily:M.serif, fontSize:54, lineHeight:0.95, color:M.ink, letterSpacing:-1 }}>
          Today’s<br/><span style={{ fontStyle:'italic', color:M.terra }}>harvest.</span>
        </div>
        <div style={{ marginTop:10, fontFamily:M.sans, fontSize:13, color:M.ink2, lineHeight:1.5 }}>
          冰箱裡有 8 樣食材;3 樣建議今明兩天消化完。
        </div>
      </div>

      {/* expiring section */}
      <div style={{ padding:'18px 0 8px' }}>
        <MercadoRule no="01" label="即將過期" right="3 ITEMS" />
        <div style={{ padding:'14px 22px 0', display:'flex', flexDirection:'column', gap:14 }}>
          {expiring.map((f, i) => (
            <div key={f.id} style={{ display:'flex', gap:14, alignItems:'center' }}>
              <FoodImage food={f} w={64} h={84} radius={2} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:2 }}>
                  <span style={{ fontFamily:M.mono, fontSize:10, color:M.ink3, letterSpacing:1 }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span style={{ fontFamily:M.mono, fontSize:9, color:M.ink3, letterSpacing:1, textTransform:'uppercase' }}>
                    {f.cat}
                  </span>
                </div>
                <div style={{ fontFamily:M.serif, fontSize:22, lineHeight:1.1, color:M.ink }}>
                  {f.zh}
                </div>
                <div style={{ fontFamily:M.sans, fontStyle:'italic', fontSize:12, color:M.ink2 }}>
                  {f.en}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{
                  fontFamily:M.serif, fontSize:32, color: f.daysLeft<=0 ? M.terra : M.ink,
                  lineHeight:1, letterSpacing:-0.5,
                }}>
                  {f.daysLeft<=0 ? '今' : f.daysLeft}
                </div>
                <div style={{ fontFamily:M.mono, fontSize:9, color:M.ink3, letterSpacing:1, marginTop:2 }}>
                  {f.daysLeft<=0 ? 'EXPIRES' : 'DAYS LEFT'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recipes section */}
      <div style={{ padding:'24px 0 16px' }}>
        <MercadoRule no="02" label="今日提案" right="FROM YOUR KITCHEN" />
        <div style={{ padding:'14px 22px 0' }}>
          {RECIPES.slice(0,2).map((r, i) => (
            <div key={r.id} style={{
              borderTop: i===0 ? 'none' : `0.5px solid ${M.ink}33`,
              padding: i===0 ? '0 0 14px' : '14px 0',
              display:'flex', gap:14,
            }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:M.mono, fontSize:10, color:M.terra, letterSpacing:1.5, marginBottom:4 }}>
                  {r.min} MIN · {r.kcal} KCAL
                </div>
                <div style={{ fontFamily:M.serif, fontSize:22, lineHeight:1.15, color:M.ink, marginBottom:6 }}>
                  {r.zh}
                </div>
                <div style={{ fontFamily:M.sans, fontStyle:'italic', fontSize:12, color:M.ink2 }}>
                  消化 {r.uses.map(u => foodById(u).zh).join('、')}
                </div>
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                {r.uses.slice(0,2).map(u => (
                  <FoodImage key={u} food={foodById(u)} w={42} h={56} radius={2} label={false} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* scan CTA */}
      <div style={{ padding:'8px 22px 32px' }}>
        <button style={{
          width:'100%', border:`1px solid ${M.ink}`, background:M.ink, color:M.paper,
          padding:'18px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:M.serif, fontSize:20, letterSpacing:0.2, cursor:'pointer',
        }}>
          <span>掃描新食材</span>
          <span style={{ fontStyle:'italic', color:M.terra }}>→</span>
        </button>
      </div>
    </MercadoShell>
  );
}

// ── 01.2 Scan ────────────────────────────────────────────────
function MercadoScan() {
  return (
    <div style={{ width:'100%', height:'100%', background:'#1A1714', color:'#FAF6EE',
      position:'relative', overflow:'hidden', fontFamily:M.sans }}>
      {/* top bar */}
      <div style={{ height:56 }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:'#FAF6EE99' }}>
          MERCADO · CAPTURE
        </div>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:'#FAF6EE99' }}>
          AUTO ⃝
        </div>
      </div>

      {/* title */}
      <div style={{ padding:'14px 22px 18px' }}>
        <div style={{ fontFamily:M.serif, fontSize:38, lineHeight:1, letterSpacing:-0.5 }}>
          捕捉<br/>
          <span style={{ fontStyle:'italic', color:M.terra }}>食材</span>
        </div>
      </div>

      {/* viewfinder area */}
      <div style={{ position:'relative', margin:'0 22px', aspectRatio:'3/4', background:'#0F0D0B',
        overflow:'hidden' }}>
        {/* simulated scene — a tomato hero */}
        <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
        {/* dark overlay for vignette */}
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)'}}/>

        {/* corner brackets */}
        {[
          {top:14, left:14, brT:1, brL:1},
          {top:14, right:14, brT:1, brR:1},
          {bottom:14, left:14, brB:1, brL:1},
          {bottom:14, right:14, brB:1, brR:1},
        ].map((p, i) => (
          <div key={i} style={{
            position:'absolute', width:22, height:22,
            ...p,
            borderTop: p.brT?`1px solid ${M.paper}`:0,
            borderLeft: p.brL?`1px solid ${M.paper}`:0,
            borderRight: p.brR?`1px solid ${M.paper}`:0,
            borderBottom: p.brB?`1px solid ${M.paper}`:0,
          }}/>
        ))}

        {/* live detection chip */}
        <div style={{ position:'absolute', left:14, bottom:14,
          padding:'6px 10px', background:'rgba(250,246,238,0.92)', color:M.ink,
          fontFamily:M.mono, fontSize:10, letterSpacing:1, textTransform:'uppercase' }}>
          <span style={{ color:M.terra }}>● </span>
          detecting · tomato · 0.94
        </div>
        {/* aperture corner */}
        <div style={{ position:'absolute', right:14, top:14,
          fontFamily:M.mono, fontSize:9, color:M.paper, letterSpacing:1, opacity:0.7 }}>
          F2.8 · ISO 200
        </div>
      </div>

      {/* hint */}
      <div style={{ padding:'18px 22px 0', textAlign:'center' }}>
        <div style={{ fontFamily:M.serif, fontStyle:'italic', fontSize:17, color:M.paper }}>
          “把食材置中,光線要勻。”
        </div>
        <div style={{ fontFamily:M.mono, fontSize:9, color:'#FAF6EE99', letterSpacing:2, marginTop:6 }}>
          PRO TIP · 01 / 03
        </div>
      </div>

      {/* shutter */}
      <div style={{ position:'absolute', bottom:48, left:0, right:0,
        display:'flex', justifyContent:'center', alignItems:'center', gap:36 }}>
        <div style={{
          fontFamily:M.mono, fontSize:10, color:'#FAF6EE99', letterSpacing:2, width:50, textAlign:'center',
        }}>FLASH<br/>OFF</div>
        <div style={{
          width:76, height:76, borderRadius:'50%', border:`2px solid ${M.paper}`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{ width:62, height:62, borderRadius:'50%', background:M.paper }} />
        </div>
        <div style={{
          fontFamily:M.mono, fontSize:10, color:M.terra, letterSpacing:2, width:50, textAlign:'center',
        }}>UPLOAD<br/>•</div>
      </div>
    </div>
  );
}

// ── 01.3 Result / Confirm ────────────────────────────────────
function MercadoConfirm() {
  const f = foodById('tomato');
  return (
    <MercadoShell>
      <div style={{ height: 56 }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          ← CAPTURE  ·  RESULT
        </div>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          16:42
        </div>
      </div>

      {/* hero photo */}
      <div style={{ padding:'14px 22px 16px' }}>
        <div style={{ aspectRatio:'4/5', position:'relative' }}>
          <FoodImage food={f} w="100%" h="100%" label={false} />
          {/* index tag */}
          <div style={{ position:'absolute', top:10, left:10,
            background:M.paper, color:M.ink, padding:'4px 8px',
            fontFamily:M.mono, fontSize:9, letterSpacing:1.5 }}>
            № 087 / 90 · RESNET-50
          </div>
        </div>
      </div>

      {/* identity */}
      <div style={{ padding:'0 22px 16px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={{ fontFamily:M.mono, fontSize:10, color:M.ink2, letterSpacing:1.5 }}>
            蔬果 · VEGETABLES
          </div>
          <div style={{ fontFamily:M.mono, fontSize:10, color:M.terra, letterSpacing:1.5 }}>
            CONF · 94%
          </div>
        </div>
        <div style={{ fontFamily:M.serif, fontSize:50, lineHeight:1, color:M.ink, marginTop:6, letterSpacing:-1 }}>
          {f.zh}
        </div>
        <div style={{ fontFamily:M.serif, fontStyle:'italic', fontSize:24, color:M.ink2, marginTop:2 }}>
          {f.en}
        </div>
      </div>

      {/* details */}
      <div style={{ padding:'14px 22px 0' }}>
        <Row k="到期日" v="11月 20日 · 週六" sub="3 days from now" terra />
        <Row k="加入數量" v="× 1" />
        <Row k="存放位置" v="冷藏 · 上層" />
        <Row k="信心分數" v="0.94 · 高" />
      </div>

      {/* CTAs */}
      <div style={{ padding:'22px 22px 32px', display:'flex', gap:10 }}>
        <button style={{
          flex:1, border:`1px solid ${M.ink}`, background:M.paper, color:M.ink,
          padding:'16px 0', fontFamily:M.serif, fontSize:17, cursor:'pointer',
        }}>重拍</button>
        <button style={{
          flex:2, border:`1px solid ${M.ink}`, background:M.ink, color:M.paper,
          padding:'16px 0', fontFamily:M.serif, fontSize:17, cursor:'pointer',
        }}>加入庫存 <span style={{ color:M.terra, fontStyle:'italic' }}>→</span></button>
      </div>
    </MercadoShell>
  );
}

const Row = ({ k, v, sub, terra }) => (
  <div style={{ padding:'12px 0', borderBottom:`0.5px solid ${M.ink}22`,
    display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
    <div style={{ fontFamily:M.mono, fontSize:10, color:M.ink2, letterSpacing:1.5, textTransform:'uppercase' }}>
      {k}
    </div>
    <div style={{ textAlign:'right' }}>
      <div style={{ fontFamily:M.serif, fontSize:18, color: terra ? M.terra : M.ink }}>{v}</div>
      {sub && <div style={{ fontFamily:M.mono, fontSize:9, color:M.ink3, letterSpacing:1, marginTop:2 }}>{sub}</div>}
    </div>
  </div>
);

// ── 01.4 Inventory ───────────────────────────────────────────
function MercadoInventory() {
  const sorted = [...FOODS].sort((a,b)=>a.daysLeft-b.daysLeft);
  return (
    <MercadoShell>
      <div style={{ height:56 }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          ← TODAY  ·  PANTRY
        </div>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          FILTER ▾
        </div>
      </div>

      <div style={{ padding:'14px 22px 18px', borderBottom:`1px solid ${M.ink}` }}>
        <div style={{ fontFamily:M.serif, fontSize:44, lineHeight:0.95, letterSpacing:-0.5 }}>
          The <span style={{ fontStyle:'italic', color:M.olive }}>pantry.</span>
        </div>
        <div style={{ display:'flex', gap:24, marginTop:12 }}>
          <Stat n="8" l="ITEMS" />
          <Stat n="3" l="EXPIRING" terra />
          <Stat n="2" l="OVERDUE" terra />
        </div>
      </div>

      <div>
        {sorted.map((f, i) => (
          <div key={f.id} style={{
            display:'flex', alignItems:'center', gap:14, padding:'14px 22px',
            borderBottom:`0.5px solid ${M.ink}22`,
          }}>
            <div style={{ fontFamily:M.mono, fontSize:11, color:M.ink3, width:24, letterSpacing:1 }}>
              {String(i+1).padStart(2,'0')}
            </div>
            <FoodImage food={f} w={42} h={56} radius={2} label={false}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:M.serif, fontSize:20, color:M.ink, lineHeight:1.05 }}>
                {f.zh}
              </div>
              <div style={{ fontFamily:M.mono, fontSize:9, color:M.ink3, letterSpacing:1.2, marginTop:2 }}>
                {f.cat.toUpperCase()} · {f.en.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:M.serif, fontSize:22, color: f.daysLeft<=2?M.terra:M.ink, lineHeight:1 }}>
                {f.daysLeft<=0 ? '今' : f.daysLeft}
              </div>
              <div style={{ fontFamily:M.mono, fontSize:8.5, color:M.ink3, letterSpacing:1, marginTop:2 }}>
                {f.daysLeft<=0 ? 'DUE' : 'D LEFT'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:32 }} />
    </MercadoShell>
  );
}

const Stat = ({ n, l, terra }) => (
  <div>
    <div style={{ fontFamily:M.serif, fontSize:28, color: terra?M.terra:M.ink, lineHeight:1 }}>{n}</div>
    <div style={{ fontFamily:M.mono, fontSize:9, color:M.ink3, letterSpacing:1.5, marginTop:4 }}>{l}</div>
  </div>
);

// ── 01.5 Recipe Detail ───────────────────────────────────────
function MercadoRecipe() {
  const r = RECIPES[0];
  const steps = [
    '番茄切丁,菠菜去梗洗淨,用廚房紙拍乾。',
    '中火熱鍋,橄欖油下鍋後先煎番茄丁約 90 秒,逼出甜味。',
    '把菠菜整把丟進去快炒 30 秒,直到剛剛變色為止。',
    '蛋液與少許帕馬森混合後倒入,小火加蓋燜 4 分鐘。',
    '出鍋前撒上海鹽片與現磨黑胡椒,趁熱享用。',
  ];

  return (
    <MercadoShell>
      <div style={{ height: 56 }} />
      <div style={{ padding:'10px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          ← TODAY  ·  RECIPE
        </div>
        <div style={{ fontFamily:M.mono, fontSize:10, letterSpacing:2, color:M.ink2 }}>
          SAVE ◇
        </div>
      </div>

      {/* hero */}
      <div style={{ padding:'14px 22px 0' }}>
        <div style={{ fontFamily:M.mono, fontSize:10, color:M.terra, letterSpacing:1.8 }}>
          RECIPE №.{r.id.toUpperCase()} · WEEKNIGHT
        </div>
        <div style={{ fontFamily:M.serif, fontSize:42, lineHeight:1, color:M.ink, marginTop:6, letterSpacing:-0.5 }}>
          {r.zh}
        </div>
        <div style={{ fontFamily:M.serif, fontStyle:'italic', fontSize:18, color:M.ink2, marginTop:4 }}>
          {r.en}
        </div>
      </div>

      <div style={{ padding:'16px 22px 0' }}>
        <div style={{ aspectRatio:'5/4', position:'relative', display:'flex' }}>
          <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0,
            padding:'10px 12px',
            background:'linear-gradient(transparent, rgba(0,0,0,0.6))',
            display:'flex', gap:16, color:M.paper, fontFamily:M.mono, fontSize:10, letterSpacing:1 }}>
            <span>{r.min} MIN</span><span>·</span><span>{r.kcal} KCAL</span><span>·</span><span>{r.saves} 人份</span>
          </div>
        </div>
      </div>

      {/* uses from your pantry */}
      <div style={{ padding:'18px 0 0' }}>
        <MercadoRule no="i" label="使用你的食材" right={`SAVES ${r.uses.length} ITEMS`} />
        <div style={{ padding:'12px 22px 0', display:'flex', gap:10 }}>
          {r.uses.map(id => {
            const f = foodById(id);
            return (
              <div key={id} style={{ flex:1, border:`0.5px solid ${M.ink}`, background:M.paper }}>
                <FoodImage food={f} w="100%" h={64} label={false} />
                <div style={{ padding:'8px 10px' }}>
                  <div style={{ fontFamily:M.serif, fontSize:15, lineHeight:1.1 }}>{f.zh}</div>
                  <div style={{ fontFamily:M.mono, fontSize:9, color:M.terra, letterSpacing:1, marginTop:2 }}>
                    {f.daysLeft<=0?'今天到期':`剩 ${f.daysLeft} 天`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* steps */}
      <div style={{ padding:'22px 0 0' }}>
        <MercadoRule no="ii" label="作法" right={`${steps.length} STEPS`} />
        <div style={{ padding:'14px 22px 0' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'12px 0',
              borderBottom: i===steps.length-1 ? 'none' : `0.5px solid ${M.ink}22` }}>
              <div style={{ fontFamily:M.serif, fontSize:24, color:M.terra, lineHeight:1, width:28, flexShrink:0 }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <div style={{ fontFamily:M.serif, fontSize:16, lineHeight:1.4, color:M.ink }}>
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'24px 22px 32px' }}>
        <button style={{
          width:'100%', border:`1px solid ${M.ink}`, background:M.ink, color:M.paper,
          padding:'18px 0', fontFamily:M.serif, fontSize:19, cursor:'pointer',
        }}>
          開始烹煮 <span style={{ color:M.terra, fontStyle:'italic' }}>→</span>
        </button>
      </div>
    </MercadoShell>
  );
}

Object.assign(window, { MercadoHome, MercadoScan, MercadoConfirm, MercadoInventory, MercadoRecipe });
