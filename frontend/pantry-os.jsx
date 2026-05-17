// ─────────────────────────────────────────────────────────────
// Variation 03 · PANTRY OS
// Dark AI dashboard. Deep forest bg, neon lime accents, monospace
// HUD overlays. Treat the fridge like a system; treat the model
// like a live agent.
// ─────────────────────────────────────────────────────────────

const P = {
  bg:    '#0B1310',
  panel: '#11201A',
  panel2:'#0F1B17',
  line:  '#1F3A30',
  ink:   '#E6F2EA',
  ink2:  '#7E9990',
  ink3:  '#4F6B62',
  lime:  '#C8FF3D',
  limeDim:'#7BA227',
  amber: '#FF9847',
  red:   '#FF5C5C',
  sans:  '"Geist", "Inter", "Noto Sans TC", system-ui, sans-serif',
  mono:  '"Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

const PShell = ({ children }) => (
  <div style={{
    width:'100%', height:'100%', background:P.bg, color:P.ink,
    fontFamily:P.sans, position:'relative', overflow:'hidden',
  }}>
    {/* subtle grid */}
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.4,
      backgroundImage:`linear-gradient(${P.line} 1px, transparent 1px), linear-gradient(90deg, ${P.line} 1px, transparent 1px)`,
      backgroundSize:'32px 32px',
      maskImage:'radial-gradient(ellipse at 50% 30%, #000 30%, transparent 80%)',
      WebkitMaskImage:'radial-gradient(ellipse at 50% 30%, #000 30%, transparent 80%)',
    }}/>
    {children}
  </div>
);

const PChip = ({ children, color=P.lime, bg, border=true }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:5,
    padding:'3px 8px', fontFamily:P.mono, fontSize:10, letterSpacing:1,
    textTransform:'uppercase', color,
    background: bg || 'transparent',
    border: border ? `1px solid ${color}55` : 'none',
    borderRadius:4,
  }}>{children}</span>
);

const PPanel = ({ children, p=14, style={} }) => (
  <div style={{
    background:P.panel, border:`1px solid ${P.line}`, borderRadius:14,
    padding:p, position:'relative', ...style,
  }}>{children}</div>
);

const PCorners = ({ color=P.lime }) => (
  <>
    {[
      {top:-1,left:-1,brT:1,brL:1},{top:-1,right:-1,brT:1,brR:1},
      {bottom:-1,left:-1,brB:1,brL:1},{bottom:-1,right:-1,brB:1,brR:1},
    ].map((s,i)=>(
      <div key={i} style={{ position:'absolute', width:10, height:10, ...s,
        borderTop: s.brT?`2px solid ${color}`:'none',
        borderLeft: s.brL?`2px solid ${color}`:'none',
        borderRight: s.brR?`2px solid ${color}`:'none',
        borderBottom: s.brB?`2px solid ${color}`:'none',
      }}/>
    ))}
  </>
);

// status bar replacement
const PTopBar = ({ label, sub }) => (
  <>
    <div style={{ height: 56 }} />
    <div style={{ padding:'8px 18px 12px',
      borderBottom:`1px solid ${P.line}`,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      fontFamily:P.mono, fontSize:10, letterSpacing:1, color:P.ink2, textTransform:'uppercase' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:P.lime, boxShadow:`0 0 6px ${P.lime}` }}/>
        <span>{label}</span>
      </div>
      <div>{sub}</div>
    </div>
  </>
);

// ── 03.1 Home / Dashboard ────────────────────────────────────
function PantryHome() {
  const expiring = FOODS.filter(f => f.daysLeft <= 2);
  return (
    <PShell>
      <PTopBar label="pantry-os · v0.4" sub="16:42 · resnet50 ready" />

      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:11, color:P.lime, letterSpacing:2 }}>
          // STATUS REPORT
        </div>
        <div style={{ fontSize:34, fontWeight:600, lineHeight:1.05, marginTop:6, letterSpacing:-0.8 }}>
          冰箱有 <span style={{ color:P.lime }}>8</span> 個項目<br/>
          <span style={{ color:P.amber }}>3</span> 個 24 hr 內過期
        </div>
      </div>

      {/* stat grid */}
      <div style={{ padding:'18px 18px 0', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        <Stat k="INVENTORY" v="8"  c={P.ink}   sub="items"   />
        <Stat k="EXPIRING"  v="3"  c={P.amber} sub="≤ 48h"   />
        <Stat k="RECIPES"   v="5"  c={P.lime}  sub="ready"   />
      </div>

      {/* expiring alert panel */}
      <div style={{ padding:'18px 18px 0' }}>
        <PPanel p={0} style={{ overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between',
            borderBottom:`1px solid ${P.line}`, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:P.amber,
                boxShadow:`0 0 8px ${P.amber}` }}/>
              <span style={{ fontFamily:P.mono, fontSize:11, color:P.ink, letterSpacing:1 }}>
                EXPIRY_QUEUE
              </span>
            </div>
            <PChip color={P.amber}>HEAD · 3</PChip>
          </div>
          <div>
            {expiring.map((f, i) => (
              <div key={f.id} style={{ display:'flex', alignItems:'center', gap:10,
                padding:'10px 14px', borderTop: i===0?'none':`1px solid ${P.line}` }}>
                <div style={{ width:36, height:46, borderRadius:6, overflow:'hidden', flexShrink:0,
                  border:`1px solid ${P.line}` }}>
                  <FoodImage food={f} w="100%" h="100%" label={false} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink3, letterSpacing:1 }}>
                    [{String(i+1).padStart(2,'0')}]
                  </div>
                  <div style={{ fontSize:15, fontWeight:600, lineHeight:1.1 }}>{f.zh}</div>
                  <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink3, letterSpacing:0.5, marginTop:2 }}>
                    id={f.id} · cat={f.cat}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:P.mono, fontSize:22, color: f.daysLeft<=0?P.red:P.amber, lineHeight:1 }}>
                    T{f.daysLeft<=0?'-0':`+${f.daysLeft}`}
                  </div>
                  <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:1, marginTop:3 }}>
                    {f.daysLeft<=0?'DUE_NOW':'DAYS'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PPanel>
      </div>

      {/* recipe queue */}
      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ fontFamily:P.mono, fontSize:11, color:P.lime, letterSpacing:2 }}>
            // RECIPE_QUEUE
          </div>
          <PChip color={P.ink2}>SORT · SAVES</PChip>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {RECIPES.slice(0,2).map(r => (
            <PPanel key={r.id} p={12}>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                  {r.uses.slice(0,2).map(u => (
                    <div key={u} style={{ width:32, height:42, borderRadius:4, overflow:'hidden',
                      border:`1px solid ${P.line}` }}>
                      <FoodImage food={foodById(u)} w="100%" h="100%" label={false} />
                    </div>
                  ))}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:600, lineHeight:1.15 }}>{r.zh}</div>
                  <div style={{ display:'flex', gap:8, marginTop:4, fontFamily:P.mono, fontSize:10, color:P.ink2, letterSpacing:0.6 }}>
                    <span>{r.min}m</span><span>·</span>
                    <span>{r.kcal} kcal</span><span>·</span>
                    <span style={{ color:P.lime }}>+{r.saves} saved</span>
                  </div>
                </div>
                <div style={{ alignSelf:'center', fontFamily:P.mono, color:P.lime, fontSize:14 }}>▸</div>
              </div>
            </PPanel>
          ))}
        </div>
      </div>

      {/* primary CTA */}
      <div style={{ padding:'18px 18px 32px' }}>
        <button style={{
          width:'100%', padding:'18px 0', background:P.lime, color:'#0B1310',
          border:'none', fontFamily:P.mono, fontSize:13, fontWeight:700,
          letterSpacing:2, textTransform:'uppercase', cursor:'pointer',
          borderRadius:8, position:'relative',
          boxShadow:`0 0 24px ${P.lime}44`,
        }}>
          ▶  RUN SCAN
        </button>
      </div>
    </PShell>
  );
}

const Stat = ({ k, v, c, sub }) => (
  <div style={{
    padding:'10px 12px', background:P.panel, border:`1px solid ${P.line}`, borderRadius:10,
    position:'relative',
  }}>
    <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:1.2 }}>{k}</div>
    <div style={{ fontFamily:P.mono, fontSize:26, color:c, lineHeight:1, marginTop:6, letterSpacing:-0.5 }}>{v}</div>
    <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:0.8, marginTop:4 }}>{sub}</div>
  </div>
);

// ── 03.2 Scan ────────────────────────────────────────────────
function PantryScan() {
  return (
    <PShell>
      <PTopBar label="capture · live" sub="CLIP+RESNET · WARM" />

      {/* viewport */}
      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ position:'relative', aspectRatio:'1/1', overflow:'hidden',
          borderRadius:10, border:`1px solid ${P.line}` }}>
          <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
          {/* vignette */}
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)'}}/>

          {/* bounding box */}
          <div style={{ position:'absolute', left:'22%', top:'18%', right:'22%', bottom:'24%',
            border:`1.5px solid ${P.lime}`, boxShadow:`0 0 16px ${P.lime}88, inset 0 0 0 1px rgba(0,0,0,0.4)` }}>
            <PCorners color={P.lime} />
            <div style={{
              position:'absolute', top:-22, left:-1,
              background:P.lime, color:'#0B1310',
              fontFamily:P.mono, fontSize:10, fontWeight:700,
              padding:'2px 6px', letterSpacing:0.8,
            }}>tomato · 0.94</div>
          </div>

          {/* secondary bounding hint */}
          <div style={{ position:'absolute', left:'62%', top:'68%', width:38, height:24,
            border:`1px dashed ${P.amber}77` }}>
            <div style={{ position:'absolute', top:-16, left:-1, fontFamily:P.mono, fontSize:8,
              color:P.amber, letterSpacing:0.5 }}>?_object · 0.31</div>
          </div>

          {/* HUD readout top-left */}
          <div style={{ position:'absolute', left:8, top:8, fontFamily:P.mono, fontSize:9, color:P.lime,
            lineHeight:1.5, textShadow:`0 0 6px ${P.lime}66` }}>
            <div>STAGE · scanning</div>
            <div>FPS   · 28</div>
            <div>BOXES · 02</div>
          </div>
          {/* HUD readout top-right */}
          <div style={{ position:'absolute', right:8, top:8, fontFamily:P.mono, fontSize:9, color:P.ink2,
            lineHeight:1.5, textAlign:'right' }}>
            <div>F2.8</div>
            <div>ISO 200</div>
            <div>EV 0.0</div>
          </div>

          {/* scan line */}
          <div style={{ position:'absolute', left:0, right:0, top:'42%', height:2,
            background:`linear-gradient(90deg, transparent, ${P.lime}, transparent)`,
            boxShadow:`0 0 10px ${P.lime}` }}/>
        </div>
      </div>

      {/* prediction stack */}
      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink2, letterSpacing:1.2, marginBottom:6 }}>
          // INFERENCE_STACK
        </div>
        <PPanel p={0} style={{ overflow:'hidden' }}>
          {[
            { id:'tomato',  v:0.94, src:'resnet50' },
            { id:'apple',   v:0.04, src:'resnet50' },
            { id:'mushroom',v:0.01, src:'resnet50' },
          ].map((p, i) => {
            const f = foodById(p.id);
            const isTop = i === 0;
            return (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10,
                padding:'8px 12px', borderTop: i===0?'none':`1px solid ${P.line}`,
                background: isTop?'#0F231C':'transparent' }}>
                <span style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, width:18 }}>
                  [{String(i).padStart(2,'0')}]
                </span>
                <span style={{ flex:1, fontFamily:P.mono, fontSize:12, color: isTop?P.lime:P.ink2 }}>
                  {f.en}
                </span>
                <div style={{ width:80, height:5, background:P.line, borderRadius:2 }}>
                  <div style={{
                    width: `${p.v*100}%`, height:'100%', borderRadius:2,
                    background: isTop ? P.lime : P.ink3,
                    boxShadow: isTop?`0 0 8px ${P.lime}`:'none',
                  }}/>
                </div>
                <span style={{ fontFamily:P.mono, fontSize:11, color: isTop?P.lime:P.ink2, width:42, textAlign:'right' }}>
                  {p.v.toFixed(2)}
                </span>
              </div>
            );
          })}
        </PPanel>
      </div>

      {/* shutter */}
      <div style={{ position:'absolute', bottom:48, left:0, right:0,
        display:'flex', justifyContent:'center', alignItems:'center', gap:34 }}>
        <div style={{ width:44, height:44, border:`1px solid ${P.line}`, borderRadius:8,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:P.mono, fontSize:11, color:P.ink2 }}>↺</div>
        <div style={{
          width:72, height:72, borderRadius:'50%',
          border:`2px solid ${P.lime}`, background:P.lime,
          boxShadow:`0 0 26px ${P.lime}66, inset 0 0 0 6px ${P.bg}`,
        }}/>
        <div style={{ width:44, height:44, border:`1px solid ${P.line}`, borderRadius:8,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:P.mono, fontSize:11, color:P.lime }}>⌗</div>
      </div>
    </PShell>
  );
}

// ── 03.3 Confirm ─────────────────────────────────────────────
function PantryConfirm() {
  const f = foodById('tomato');
  const log = [
    '[16:42:01] capture · temp_upload.jpg · 1024x768',
    '[16:42:01] route ▸ predict_combined',
    '[16:42:01] clip → not_meat · 0.92',
    '[16:42:02] resnet50 → tomato · 0.94',
    '[16:42:02] ✓ commit ready',
  ];
  return (
    <PShell>
      <PTopBar label="◂ back · match found" sub="latency 432ms" />

      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ width:130, height:160, borderRadius:8, overflow:'hidden', position:'relative',
            border:`1px solid ${P.lime}55`, boxShadow:`0 0 24px ${P.lime}33`, flexShrink:0 }}>
            <FoodImage food={f} w="100%" h="100%" label={false} />
            <PCorners color={P.lime} />
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <PChip color={P.lime}>● MATCH</PChip>
            <div style={{ fontFamily:P.mono, fontSize:11, color:P.ink2, letterSpacing:1, marginTop:8 }}>
              CLASS_ID · 081
            </div>
            <div style={{ fontSize:30, fontWeight:600, lineHeight:1, marginTop:4, letterSpacing:-0.8 }}>
              {f.zh}
            </div>
            <div style={{ fontFamily:P.mono, fontSize:13, color:P.ink2, marginTop:4 }}>
              tomato · vegetable
            </div>

            {/* big confidence */}
            <div style={{ marginTop:14 }}>
              <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:1 }}>CONFIDENCE</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:2 }}>
                <div style={{ fontFamily:P.mono, fontSize:34, color:P.lime, lineHeight:1, letterSpacing:-1 }}>
                  0.94
                </div>
                <div style={{ fontFamily:P.mono, fontSize:11, color:P.ink3 }}>/ 1.00</div>
              </div>
              <div style={{ marginTop:6, height:4, background:P.line, borderRadius:2 }}>
                <div style={{ width:'94%', height:'100%', background:P.lime, borderRadius:2,
                  boxShadow:`0 0 8px ${P.lime}` }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* fields */}
      <div style={{ padding:'18px 18px 0' }}>
        <PPanel p={0} style={{ overflow:'hidden' }}>
          <Field k="expiry"   v="2026-11-20" sub="T+3 · sat" tone="warn" />
          <Field k="location" v="cold · upper" />
          <Field k="qty"      v="1" />
          <Field k="model"    v="raw_food · resnet50" mono />
        </PPanel>
      </div>

      {/* log */}
      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink2, letterSpacing:1.2, marginBottom:6 }}>
          // RUN_LOG
        </div>
        <PPanel p={10}>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily:P.mono, fontSize:10.5, color: i===log.length-1?P.lime:P.ink2,
              lineHeight:1.6 }}>
              {l}
            </div>
          ))}
        </PPanel>
      </div>

      {/* CTA */}
      <div style={{ padding:'18px 18px 28px', display:'flex', gap:10 }}>
        <button style={{
          flex:1, padding:'16px 0', background:'transparent', color:P.ink,
          border:`1px solid ${P.line}`, fontFamily:P.mono, fontSize:12, letterSpacing:1.5,
          fontWeight:600, borderRadius:8,
        }}>RETRY</button>
        <button style={{
          flex:2, padding:'16px 0', background:P.lime, color:'#0B1310',
          border:'none', fontFamily:P.mono, fontSize:13, fontWeight:700,
          letterSpacing:1.8, borderRadius:8, boxShadow:`0 0 24px ${P.lime}55`,
        }}>▸ COMMIT TO INVENTORY</button>
      </div>
    </PShell>
  );
}

const Field = ({ k, v, sub, tone, mono }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'12px 14px', borderBottom:`1px solid ${P.line}`, gap:8 }}>
    <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink3, letterSpacing:1.2, textTransform:'uppercase' }}>
      {k}
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {sub && (
        <span style={{
          fontFamily:P.mono, fontSize:9, padding:'2px 6px',
          color: tone==='warn'?P.amber:P.lime,
          border:`1px solid ${(tone==='warn'?P.amber:P.lime)}66`,
          letterSpacing:1,
        }}>{sub}</span>
      )}
      <div style={{ fontFamily: mono?P.mono:P.sans, fontSize:14, color:P.ink, fontWeight:600 }}>{v}</div>
    </div>
  </div>
);

// ── 03.4 Inventory ───────────────────────────────────────────
function PantryInventory() {
  const sorted = [...FOODS].sort((a,b)=>a.daysLeft-b.daysLeft);
  return (
    <PShell>
      <PTopBar label="◂ back · inventory.db" sub="ORDER · DAYS_LEFT ↑" />

      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.lime, letterSpacing:1.5 }}>
          // SELECT * FROM inventory
        </div>
        <div style={{ fontSize:28, fontWeight:600, marginTop:6, letterSpacing:-0.5 }}>
          {FOODS.length} <span style={{ color:P.ink3, fontWeight:400 }}>rows</span>
        </div>
      </div>

      {/* legend */}
      <div style={{ padding:'10px 18px 0', display:'flex', gap:10, fontFamily:P.mono, fontSize:9,
        letterSpacing:1, color:P.ink2 }}>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:6, height:6, background:P.red, borderRadius:1 }}/>OVERDUE
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:6, height:6, background:P.amber, borderRadius:1 }}/>≤2 DAYS
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:6, height:6, background:P.lime, borderRadius:1 }}/>FRESH
        </span>
      </div>

      {/* table */}
      <div style={{ padding:'12px 18px 0' }}>
        {/* header */}
        <div style={{
          display:'grid', gridTemplateColumns:'24px 1fr 64px 64px',
          gap:8, padding:'6px 8px',
          fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:1.2,
          textTransform:'uppercase',
          borderTop:`1px solid ${P.line}`, borderBottom:`1px solid ${P.line}`,
        }}>
          <div>idx</div><div>item</div><div style={{textAlign:'right'}}>conf</div><div style={{textAlign:'right'}}>days</div>
        </div>
        {sorted.map((f, i) => {
          const c = f.daysLeft<=0?P.red:f.daysLeft<=2?P.amber:P.lime;
          return (
            <div key={f.id} style={{
              display:'grid', gridTemplateColumns:'24px 1fr 64px 64px',
              gap:8, padding:'10px 8px',
              borderBottom:`1px solid ${P.line}`,
              alignItems:'center',
            }}>
              <span style={{ fontFamily:P.mono, fontSize:10, color:P.ink3 }}>
                {String(i).padStart(2,'0')}
              </span>
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <span style={{ width:8, height:8, background:c, borderRadius:1, flexShrink:0 }}/>
                <div style={{ width:26, height:32, borderRadius:4, overflow:'hidden', flexShrink:0,
                  border:`1px solid ${P.line}` }}>
                  <FoodImage food={f} w="100%" h="100%" label={false}/>
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, lineHeight:1.1 }}>{f.zh}</div>
                  <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:0.4, marginTop:2 }}>
                    {f.id}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily:P.mono, fontSize:12, color:P.ink2, textAlign:'right' }}>
                {f.conf.toFixed(2)}
              </div>
              <div style={{ fontFamily:P.mono, fontSize:14, color:c, textAlign:'right', letterSpacing:-0.3 }}>
                {f.daysLeft<=0?'-0':`+${f.daysLeft}`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding:'14px 18px 28px', display:'flex', justifyContent:'space-between',
        fontFamily:P.mono, fontSize:10, color:P.ink3, letterSpacing:1 }}>
        <span>8 rows</span>
        <span>db · sqlite · 20480 B</span>
      </div>
    </PShell>
  );
}

// ── 03.5 Recipe Detail ───────────────────────────────────────
function PantryRecipe() {
  const r = RECIPES[0];
  const steps = [
    'PREP · 番茄切丁,菠菜去梗洗淨拍乾',
    'FIRE · 中火橄欖油下鍋,煎番茄 90s',
    'WILT · 菠菜全部丟入,快炒 30s',
    'BIND · 蛋液+帕馬森倒入,小火燜 4m',
    'PLATE · 撒鹽片與黑胡椒,趁熱',
  ];
  return (
    <PShell>
      <PTopBar label="◂ back · recipe.r1" sub="SAVES · 2" />

      <div style={{ padding:'14px 18px 0' }}>
        <PChip color={P.lime}>RECIPE_GENERATED</PChip>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.ink2, marginTop:8, letterSpacing:1.2 }}>
          $ recipes --uses tomato,spinach --max-time 20
        </div>
        <div style={{ fontSize:30, fontWeight:600, lineHeight:1.05, marginTop:8, letterSpacing:-0.8 }}>
          {r.zh}
        </div>
        <div style={{ fontFamily:P.mono, fontSize:12, color:P.ink2, marginTop:2 }}>
          {r.en}
        </div>
      </div>

      {/* hero */}
      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ position:'relative', aspectRatio:'2/1', borderRadius:10, overflow:'hidden',
          border:`1px solid ${P.line}` }}>
          <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)'}}/>
          {/* metric strip */}
          <div style={{ position:'absolute', left:10, bottom:10, right:10,
            display:'flex', justifyContent:'space-between',
            fontFamily:P.mono, fontSize:11, color:P.ink, letterSpacing:1 }}>
            <Mini k="TIME" v={`${r.min}m`} />
            <Mini k="KCAL" v={r.kcal} />
            <Mini k="SAVES" v={r.saves} c={P.lime}/>
            <Mini k="LV" v={r.level} />
          </div>
        </div>
      </div>

      {/* uses */}
      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.lime, letterSpacing:1.5, marginBottom:8 }}>
          // USES_FROM_INVENTORY
        </div>
        <PPanel p={0} style={{ overflow:'hidden' }}>
          {r.uses.map((id, i) => {
            const f = foodById(id);
            const urgent = f.daysLeft <= 2;
            return (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderTop: i===0?'none':`1px solid ${P.line}` }}>
                <div style={{ width:28, height:36, borderRadius:4, overflow:'hidden', flexShrink:0,
                  border:`1px solid ${P.line}` }}>
                  <FoodImage food={f} w="100%" h="100%" label={false} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{f.zh}</div>
                  <div style={{ fontFamily:P.mono, fontSize:9, color:P.ink3, letterSpacing:0.5, marginTop:2 }}>
                    id={f.id}
                  </div>
                </div>
                <PChip color={urgent?P.amber:P.lime}>
                  {f.daysLeft<=0?'T-0':`T+${f.daysLeft}`}
                </PChip>
              </div>
            );
          })}
        </PPanel>
      </div>

      {/* steps */}
      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ fontFamily:P.mono, fontSize:10, color:P.lime, letterSpacing:1.5, marginBottom:8 }}>
          // STEPS · {steps.length}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'baseline',
              padding:'10px 12px', background:P.panel2, border:`1px solid ${P.line}`, borderRadius:8 }}>
              <div style={{ fontFamily:P.mono, fontSize:11, color:P.lime, letterSpacing:1, flexShrink:0 }}>
                {String(i+1).padStart(2,'0')}.
              </div>
              <div style={{ fontFamily:P.mono, fontSize:12.5, lineHeight:1.5, color:P.ink }}>
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'18px 18px 28px' }}>
        <button style={{
          width:'100%', padding:'18px 0', background:P.lime, color:'#0B1310',
          border:'none', fontFamily:P.mono, fontSize:13, fontWeight:700,
          letterSpacing:2, borderRadius:8, boxShadow:`0 0 24px ${P.lime}55`,
        }}>▶  START COOKING</button>
      </div>
    </PShell>
  );
}

const Mini = ({ k, v, c=P.ink }) => (
  <div>
    <div style={{ fontSize:8, color:P.ink3, letterSpacing:1 }}>{k}</div>
    <div style={{ fontSize:13, color:c, fontWeight:600, letterSpacing:0.3 }}>{v}</div>
  </div>
);

Object.assign(window, { PantryHome, PantryScan, PantryConfirm, PantryInventory, PantryRecipe });
