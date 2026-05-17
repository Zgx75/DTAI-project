// ─────────────────────────────────────────────────────────────
// Variation 02 · VERDE
// Fresh market green. Cream paper, vivid green, peach accents.
// Plus Jakarta Sans rounded modern sans. Friendly, big radii.
// ─────────────────────────────────────────────────────────────

const V = {
  bg:    '#F7F5EE',
  card:  '#FFFFFF',
  ink:   '#162216',
  ink2:  '#4F5C4F',
  ink3:  '#8C998C',
  green: '#1F8A4C',
  greenDark: '#0F6234',
  greenSoft: '#E3F2DE',
  peach: '#F4A582',
  peachSoft: '#FCEAD8',
  amber: '#EAB04B',
  red:   '#D8513C',
  sans:  '"Plus Jakarta Sans", "Noto Sans TC", system-ui, sans-serif',
  display: '"Plus Jakarta Sans", "Noto Sans TC", system-ui, sans-serif',
};

const VShell = ({ children }) => (
  <div style={{
    width:'100%', height:'100%', background:V.bg, color:V.ink,
    fontFamily:V.sans, position:'relative', overflow:'hidden',
    fontFeatureSettings:'"ss01"',
  }}>{children}</div>
);

const VChip = ({ children, bg=V.greenSoft, color=V.greenDark, size=11 }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:4,
    padding:'4px 9px', borderRadius:999, background:bg, color,
    fontSize:size, fontWeight:600, letterSpacing:0.2,
  }}>{children}</span>
);

const VToneCard = ({ children, bg=V.card, p=18, radius=24, style={} }) => (
  <div style={{
    background:bg, borderRadius:radius, padding:p,
    boxShadow:'0 1px 0 rgba(0,0,0,0.02), 0 4px 14px rgba(20,40,20,0.04)',
    ...style,
  }}>{children}</div>
);

// ── 02.1 Home ────────────────────────────────────────────────
function VerdeHome() {
  const expiring = FOODS.filter(f => f.daysLeft <= 4).slice(0, 4);
  return (
    <VShell>
      <div style={{ height: 56 }} />
      <div style={{ padding:'12px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:13, color:V.ink2, fontWeight:500 }}>下午好,Maya 👋</div>
          <div style={{ fontSize:22, fontWeight:800, marginTop:2, letterSpacing:-0.5 }}>
            來看看冰箱裡有什麼。
          </div>
        </div>
        <div style={{ width:44, height:44, borderRadius:'50%',
          background:`linear-gradient(135deg, ${V.peach}, ${V.amber})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontWeight:700, fontSize:16, flexShrink:0,
        }}>M</div>
      </div>

      {/* hero stat */}
      <div style={{ padding:'18px 20px 0' }}>
        <VToneCard bg={V.green} radius={28} p={20} style={{
          color:'#fff', position:'relative', overflow:'hidden',
        }}>
          {/* decorative dots */}
          <div style={{ position:'absolute', right:-30, top:-30, width:140, height:140,
            borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
          <div style={{ position:'absolute', right:20, bottom:-40, width:80, height:80,
            borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>

          <div style={{ fontSize:12, opacity:0.85, fontWeight:500, letterSpacing:0.4 }}>
            目前庫存
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:2 }}>
            <div style={{ fontSize:54, fontWeight:800, lineHeight:1, letterSpacing:-2 }}>8</div>
            <div style={{ fontSize:14, opacity:0.9 }}>樣食材</div>
          </div>
          <div style={{ marginTop:14, display:'flex', gap:8 }}>
            <VChip bg="rgba(255,255,255,0.18)" color="#fff" size={11}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:V.peach }}/>
              3 樣即將過期
            </VChip>
            <VChip bg="rgba(255,255,255,0.18)" color="#fff" size={11}>5 道可做的料理</VChip>
          </div>
        </VToneCard>
      </div>

      {/* expiring grid */}
      <div style={{ padding:'22px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:18, fontWeight:800 }}>趕快用掉 🥬</div>
          <div style={{ fontSize:12, color:V.green, fontWeight:600 }}>查看全部 →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {expiring.map(f => {
            const urgent = f.daysLeft <= 1;
            return (
              <VToneCard key={f.id} p={0} radius={20} style={{ overflow:'hidden' }}>
                <div style={{ height:92, position:'relative' }}>
                  <FoodImage food={f} w="100%" h="100%" label={false} />
                  <div style={{
                    position:'absolute', top:8, right:8,
                    padding:'3px 8px', borderRadius:999,
                    background: urgent ? V.red : '#fff',
                    color: urgent ? '#fff' : V.ink,
                    fontSize:10, fontWeight:700, letterSpacing:0.2,
                  }}>
                    {f.daysLeft<=0?'今天到期':`剩 ${f.daysLeft} 天`}
                  </div>
                </div>
                <div style={{ padding:'10px 12px 12px' }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{f.zh}</div>
                  <div style={{ fontSize:11, color:V.ink3, marginTop:2 }}>{f.cat}</div>
                </div>
              </VToneCard>
            );
          })}
        </div>
      </div>

      {/* recipes */}
      <div style={{ padding:'22px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:18, fontWeight:800 }}>今晚做這個?🍳</div>
          <div style={{ fontSize:12, color:V.green, fontWeight:600 }}>更多 →</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {RECIPES.slice(0,2).map(r => (
            <VToneCard key={r.id} p={12} radius={20}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ display:'flex', gap:-2, flexShrink:0, position:'relative', width:64 }}>
                  {r.uses.slice(0,2).map((u, i) => (
                    <div key={u} style={{
                      width:48, height:64, borderRadius:14, overflow:'hidden',
                      position:'absolute', left: i*16,
                      boxShadow:'0 0 0 3px #fff',
                    }}>
                      <FoodImage food={foodById(u)} w="100%" h="100%" label={false} />
                    </div>
                  ))}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, letterSpacing:-0.2 }}>{r.zh}</div>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}>
                    <VChip>{r.min} 分鐘</VChip>
                    <VChip bg={V.peachSoft} color="#A2562B">省 {r.saves} 樣食材</VChip>
                  </div>
                </div>
                <div style={{ alignSelf:'center', width:32, height:32, borderRadius:'50%',
                  background:V.greenSoft, color:V.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>›</div>
              </div>
            </VToneCard>
          ))}
        </div>
      </div>

      {/* floating tab bar spacer + tab bar */}
      <div style={{ height:100 }} />
      <VTabBar active="home" />
    </VShell>
  );
}

const VTabBar = ({ active='home' }) => {
  const tabs = [
    { id:'home',  label:'首頁',   icon:'⌂' },
    { id:'scan',  label:'掃描',   icon:'◉', cta:true },
    { id:'pantry',label:'食材',  icon:'▦' },
    { id:'recipe',label:'食譜',  icon:'☆' },
  ];
  return (
    <div style={{
      position:'absolute', bottom:14, left:14, right:14,
      background:'#fff', borderRadius:28,
      padding:'10px 14px',
      boxShadow:'0 10px 30px rgba(20,40,20,0.10), 0 0 0 1px rgba(20,40,20,0.04)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      {tabs.map(t => {
        if (t.cta) return (
          <div key={t.id} style={{
            width:48, height:48, borderRadius:'50%', background:V.green, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
            boxShadow:`0 6px 14px ${V.green}66`, marginTop:-22,
          }}>+</div>
        );
        const on = t.id === active;
        return (
          <div key={t.id} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:2, width:60,
            color: on ? V.green : V.ink3,
          }}>
            <div style={{ fontSize:18, lineHeight:1 }}>{t.icon}</div>
            <div style={{ fontSize:10, fontWeight: on?700:500 }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── 02.2 Scan ────────────────────────────────────────────────
function VerdeScan() {
  return (
    <div style={{ width:'100%', height:'100%', background:'#0E1410', color:'#fff',
      fontFamily:V.sans, position:'relative', overflow:'hidden' }}>
      <div style={{ height:56 }} />

      {/* top */}
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.12)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>×</div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:13, opacity:0.7, fontWeight:500 }}>正在辨識</div>
          <div style={{ fontSize:17, fontWeight:800 }}>對準食材就好 ✨</div>
        </div>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.12)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
      </div>

      {/* viewfinder */}
      <div style={{ margin:'18px 20px 0', borderRadius:28, overflow:'hidden',
        position:'relative', aspectRatio:'3/4' }}>
        <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)'}}/>

        {/* scan frame */}
        <div style={{ position:'absolute', inset:'12% 14%', borderRadius:24,
          boxShadow:`0 0 0 3px ${V.green}, 0 0 30px ${V.green}66, inset 0 0 0 1px rgba(255,255,255,0.4)` }} />

        {/* moving scan line (static visual) */}
        <div style={{ position:'absolute', left:'14%', right:'14%', top:'40%', height:3,
          background:`linear-gradient(90deg, transparent, ${V.green}, transparent)`,
          boxShadow:`0 0 16px ${V.green}` }} />

        {/* prediction popup */}
        <div style={{ position:'absolute', left:14, bottom:14, right:14,
          background:'rgba(255,255,255,0.96)', borderRadius:20, padding:'12px 14px',
          display:'flex', alignItems:'center', gap:12, color:V.ink,
          boxShadow:'0 12px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ width:44, height:44, borderRadius:14, overflow:'hidden', flexShrink:0 }}>
            <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800 }}>偵測到:牛番茄</div>
            <div style={{ marginTop:4, height:5, borderRadius:3, background:V.greenSoft, overflow:'hidden' }}>
              <div style={{ width:'94%', height:'100%', background:V.green, borderRadius:3 }}/>
            </div>
            <div style={{ fontSize:11, color:V.ink2, marginTop:3, fontWeight:600 }}>信心 94% · 對準後拍照</div>
          </div>
        </div>
      </div>

      {/* tips */}
      <div style={{ padding:'18px 20px 0', display:'flex', gap:8, justifyContent:'center' }}>
        {['光線充足','置中對焦','一次一樣'].map((t, i) => (
          <div key={t} style={{
            padding:'6px 12px', borderRadius:999,
            background: i===0 ? `${V.green}` : 'rgba(255,255,255,0.08)',
            color: i===0 ? '#fff' : 'rgba(255,255,255,0.78)',
            fontSize:11, fontWeight:600,
          }}>{t}</div>
        ))}
      </div>

      {/* shutter */}
      <div style={{ position:'absolute', bottom:54, left:0, right:0,
        display:'flex', justifyContent:'center', alignItems:'center', gap:48 }}>
        <div style={{ width:50, height:50, borderRadius:16, background:'rgba(255,255,255,0.12)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontSize:18 }}>
          <span>🖼</span>
        </div>
        <div style={{
          width:80, height:80, borderRadius:'50%',
          background:`linear-gradient(135deg, ${V.green}, ${V.greenDark})`,
          boxShadow:`0 8px 24px ${V.green}66, inset 0 0 0 5px rgba(255,255,255,0.95)`,
        }}/>
        <div style={{ width:50, height:50, borderRadius:16, background:'rgba(255,255,255,0.12)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
          ⟳
        </div>
      </div>
    </div>
  );
}

// ── 02.3 Confirm ─────────────────────────────────────────────
function VerdeConfirm() {
  const f = foodById('tomato');
  return (
    <VShell>
      <div style={{ height:56 }} />
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width:36, height:36, borderRadius:12, background:'#fff', display:'flex',
          alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:'0 1px 0 rgba(0,0,0,0.03)' }}>‹</div>
        <div style={{ fontSize:14, fontWeight:700 }}>掃描結果</div>
        <div style={{ width:36, height:36, borderRadius:12, background:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, boxShadow:'0 1px 0 rgba(0,0,0,0.03)' }}>⟳</div>
      </div>

      <div style={{ padding:'18px 20px 0' }}>
        <VToneCard p={0} radius={28} style={{ overflow:'hidden' }}>
          <div style={{ height:240, position:'relative' }}>
            <FoodImage food={f} w="100%" h="100%" label={false} />
            <div style={{ position:'absolute', top:14, left:14 }}>
              <VChip bg={V.green} color="#fff" size={11}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#C8FF3D' }}/>
                辨識完成
              </VChip>
            </div>
            <div style={{ position:'absolute', bottom:14, right:14,
              background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)',
              padding:'6px 10px', borderRadius:12, color:'#fff',
              fontSize:11, fontWeight:700, letterSpacing:0.5 }}>
              信心 94%
            </div>
          </div>

          <div style={{ padding:'18px 20px 6px' }}>
            <div style={{ fontSize:11, color:V.ink3, fontWeight:600, letterSpacing:0.6 }}>VEGETABLE</div>
            <div style={{ fontSize:30, fontWeight:800, lineHeight:1.05, marginTop:2, letterSpacing:-0.8 }}>
              {f.zh}
            </div>
            <div style={{ fontSize:13, color:V.ink2, marginTop:2 }}>{f.en}</div>
          </div>

          {/* editable rows */}
          <div style={{ padding:'12px 16px 18px' }}>
            <VInfoRow label="到期日" value="11月 20日 (週六)" hint="3 天後" tone="warn" />
            <VInfoRow label="存放" value="冷藏 · 上層" />
            <VInfoRow label="數量" value="× 1" />
          </div>
        </VToneCard>
      </div>

      {/* suggestions */}
      <div style={{ padding:'18px 20px 0' }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>
          可以用它做這些 ↓
        </div>
        <div style={{ display:'flex', gap:10, overflow:'hidden' }}>
          {RECIPES.filter(r => r.uses.includes('tomato')).slice(0,2).map(r => (
            <VToneCard key={r.id} p={10} radius={18} style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ width:42, height:42, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                  <FoodImage food={foodById(r.uses[0])} w="100%" h="100%" label={false} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, lineHeight:1.2 }}>{r.zh}</div>
                  <div style={{ fontSize:10, color:V.ink3, marginTop:3 }}>{r.min} 分鐘 · {r.level}</div>
                </div>
              </div>
            </VToneCard>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'20px 20px 0', display:'flex', gap:10 }}>
        <button style={{
          flex:1, height:56, borderRadius:20, border:'1px solid rgba(20,40,20,0.1)', background:'#fff',
          fontSize:15, fontWeight:700, color:V.ink,
        }}>不是這個</button>
        <button style={{
          flex:1.6, height:56, borderRadius:20, border:'none', background:V.green, color:'#fff',
          fontSize:15, fontWeight:800, boxShadow:`0 6px 14px ${V.green}55`,
        }}>加入冰箱 ✓</button>
      </div>
      <div style={{ height: 32 }} />
    </VShell>
  );
}

const VInfoRow = ({ label, value, hint, tone }) => (
  <div style={{
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'12px 4px', borderTop:'0.5px solid rgba(20,40,20,0.08)',
  }}>
    <div style={{ fontSize:12, color:V.ink3, fontWeight:600 }}>{label}</div>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {hint && (
        <span style={{
          fontSize:10, fontWeight:700, padding:'3px 7px', borderRadius:8,
          background: tone==='warn' ? V.peachSoft : V.greenSoft,
          color: tone==='warn' ? '#A2562B' : V.green,
        }}>{hint}</span>
      )}
      <div style={{ fontSize:14, fontWeight:700 }}>{value}</div>
      <span style={{ color:V.ink3, fontSize:14 }}>›</span>
    </div>
  </div>
);

// ── 02.4 Inventory ───────────────────────────────────────────
function VerdeInventory() {
  const sorted = [...FOODS].sort((a,b)=>a.daysLeft-b.daysLeft);
  const cats = ['全部','蔬果','肉類','乳品'];
  return (
    <VShell>
      <div style={{ height:56 }} />
      <div style={{ padding:'12px 20px 0' }}>
        <div style={{ fontSize:13, color:V.ink2, fontWeight:600 }}>我的冰箱</div>
        <div style={{ fontSize:30, fontWeight:800, marginTop:2, letterSpacing:-0.8 }}>
          8 樣食材 ·{' '}
          <span style={{ color:V.red }}>3 急用</span>
        </div>
      </div>

      {/* category tabs */}
      <div style={{ padding:'14px 20px 0', display:'flex', gap:8, overflow:'hidden' }}>
        {cats.map((c, i) => (
          <div key={c} style={{
            padding:'7px 13px', borderRadius:999,
            background: i===0 ? V.ink : '#fff',
            color: i===0 ? '#fff' : V.ink2,
            fontSize:12, fontWeight:700,
            boxShadow: i===0 ? 'none' : '0 1px 0 rgba(0,0,0,0.03)',
          }}>{c}</div>
        ))}
      </div>

      {/* list */}
      <div style={{ padding:'18px 20px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {sorted.map(f => {
          const urgent = f.daysLeft <= 1;
          const soon = f.daysLeft <= 4 && !urgent;
          const dotColor = urgent ? V.red : soon ? V.amber : V.green;
          return (
            <VToneCard key={f.id} p={10} radius={20}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:52, height:64, borderRadius:14, overflow:'hidden', flexShrink:0 }}>
                  <FoodImage food={f} w="100%" h="100%" label={false} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:dotColor }}/>
                    <span style={{ fontSize:15, fontWeight:700 }}>{f.zh}</span>
                  </div>
                  <div style={{ fontSize:11, color:V.ink3, marginTop:3 }}>
                    {f.cat} · {f.en}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:20, fontWeight:800, color: urgent?V.red:V.ink, lineHeight:1 }}>
                    {f.daysLeft<=0?'今':f.daysLeft}
                  </div>
                  <div style={{ fontSize:10, color:V.ink3, marginTop:2, fontWeight:600 }}>
                    {f.daysLeft<=0?'到期':'天'}
                  </div>
                </div>
              </div>
            </VToneCard>
          );
        })}
      </div>
      <div style={{ height: 110 }} />
      <VTabBar active="pantry" />
    </VShell>
  );
}

// ── 02.5 Recipe Detail ───────────────────────────────────────
function VerdeRecipe() {
  const r = RECIPES[0];
  const steps = [
    '番茄切丁,菠菜去梗洗淨,用廚房紙拍乾。',
    '中火熱鍋,橄欖油下鍋後先煎番茄丁約 90 秒。',
    '菠菜整把丟進去快炒 30 秒。',
    '蛋液與帕馬森混合後倒入,小火燜 4 分鐘。',
    '撒上海鹽片與現磨黑胡椒,趁熱享用。',
  ];

  return (
    <VShell>
      {/* hero */}
      <div style={{ height:320, position:'relative' }}>
        <FoodImage food={foodById('tomato')} w="100%" h="100%" label={false} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)'}}/>

        <div style={{ position:'absolute', top:56, left:20, right:20,
          display:'flex', justifyContent:'space-between' }}>
          <div style={{ width:40, height:40, borderRadius:14,
            background:'rgba(255,255,255,0.96)', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, fontWeight:700 }}>‹</div>
          <div style={{ width:40, height:40, borderRadius:14,
            background:'rgba(255,255,255,0.96)', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14 }}>♡</div>
        </div>

        <div style={{ position:'absolute', bottom:18, left:20, right:20, color:'#fff' }}>
          <VChip bg="rgba(255,255,255,0.2)" color="#fff" size={11}>WEEKNIGHT · 省 2 樣食材</VChip>
          <div style={{ fontSize:30, fontWeight:800, marginTop:8, letterSpacing:-0.8, lineHeight:1.1 }}>
            {r.zh}
          </div>
          <div style={{ fontSize:13, opacity:0.85, marginTop:2 }}>{r.en}</div>
        </div>
      </div>

      {/* body card (pulled up) */}
      <div style={{ background:V.bg, borderTopLeftRadius:28, borderTopRightRadius:28, marginTop:-22,
        padding:'22px 20px 0', position:'relative' }}>
        {/* metric row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          <VToneCard p={12} radius={18}>
            <div style={{ fontSize:10, color:V.ink3, fontWeight:600 }}>時間</div>
            <div style={{ fontSize:18, fontWeight:800, marginTop:2 }}>{r.min} 分</div>
          </VToneCard>
          <VToneCard p={12} radius={18}>
            <div style={{ fontSize:10, color:V.ink3, fontWeight:600 }}>份量</div>
            <div style={{ fontSize:18, fontWeight:800, marginTop:2 }}>{r.saves} 人</div>
          </VToneCard>
          <VToneCard p={12} radius={18}>
            <div style={{ fontSize:10, color:V.ink3, fontWeight:600 }}>難度</div>
            <div style={{ fontSize:18, fontWeight:800, marginTop:2 }}>{r.level}</div>
          </VToneCard>
        </div>

        {/* ingredients */}
        <div style={{ fontSize:16, fontWeight:800, marginTop:22, marginBottom:10 }}>
          用你冰箱裡的 ↓
        </div>
        <VToneCard p={6} radius={20}>
          {r.uses.map((id, i) => {
            const f = foodById(id);
            return (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 8px',
                borderTop: i===0 ? 'none' : '0.5px solid rgba(20,40,20,0.08)' }}>
                <div style={{ width:40, height:50, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                  <FoodImage food={f} w="100%" h="100%" label={false} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{f.zh}</div>
                  <div style={{ fontSize:11, color:V.ink3, marginTop:2 }}>{f.cat}</div>
                </div>
                <VChip bg={f.daysLeft<=2?V.peachSoft:V.greenSoft}
                       color={f.daysLeft<=2?'#A2562B':V.green}>
                  剩 {f.daysLeft<=0?'今天':`${f.daysLeft} 天`}
                </VChip>
              </div>
            );
          })}
        </VToneCard>

        {/* steps */}
        <div style={{ fontSize:16, fontWeight:800, marginTop:22, marginBottom:10 }}>
          作法 · {steps.length} 步
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {steps.map((s, i) => (
            <VToneCard key={i} p={14} radius={18}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:V.greenSoft,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:V.green, fontWeight:800, fontSize:13, flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ fontSize:14, lineHeight:1.55, color:V.ink }}>{s}</div>
              </div>
            </VToneCard>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding:'22px 0 28px' }}>
          <button style={{
            width:'100%', height:60, borderRadius:22, border:'none',
            background:V.green, color:'#fff',
            fontSize:16, fontWeight:800, boxShadow:`0 8px 20px ${V.green}55`,
          }}>
            開始烹煮 →
          </button>
        </div>
      </div>
    </VShell>
  );
}

Object.assign(window, { VerdeHome, VerdeScan, VerdeConfirm, VerdeInventory, VerdeRecipe });
