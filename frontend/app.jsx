// Main app — wraps all 15 mockups (3 directions × 5 screens) in
// DesignCanvas + iPhone frames, with Tweaks for showcase tuning.

const { useState, useEffect } = React;

const PHONE_W = 402;
const PHONE_H = 874;

// Compose one ios-framed artboard
function Frame({ children, dark=false }) {
  return (
    <IOSDevice width={PHONE_W} height={PHONE_H} dark={dark}>
      {children}
    </IOSDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level app
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <DesignCanvas>
        {/* ─── Direction 01 · Mercado ──────────────────────── */}
        <DCSection
          id="mercado"
          title="01 · Mercado"
          subtitle="食物雜誌 · Editorial · 米白 / 番茄紅 / 橄欖綠 · DM Serif Display"
        >
          <DCArtboard id="m-home"      label="Home · 今日"        width={PHONE_W} height={PHONE_H}>
            <Frame><MercadoHome/></Frame>
          </DCArtboard>
          <DCArtboard id="m-scan"      label="Scan · 取景"        width={PHONE_W} height={PHONE_H}>
            <Frame dark><MercadoScan/></Frame>
          </DCArtboard>
          <DCArtboard id="m-confirm"   label="Confirm · 結果"     width={PHONE_W} height={PHONE_H}>
            <Frame><MercadoConfirm/></Frame>
          </DCArtboard>
          <DCArtboard id="m-inventory" label="Pantry · 冰箱"      width={PHONE_W} height={PHONE_H}>
            <Frame><MercadoInventory/></Frame>
          </DCArtboard>
          <DCArtboard id="m-recipe"    label="Recipe · 食譜"      width={PHONE_W} height={PHONE_H}>
            <Frame><MercadoRecipe/></Frame>
          </DCArtboard>
        </DCSection>

        {/* ─── Direction 02 · Verde ────────────────────────── */}
        <DCSection
          id="verde"
          title="02 · Verde"
          subtitle="鮮綠市場 · 圓潤現代 · 奶白 / 鮮綠 / 桃橘 · Plus Jakarta Sans"
        >
          <DCArtboard id="v-home"      label="Home · 首頁"        width={PHONE_W} height={PHONE_H}>
            <Frame><VerdeHome/></Frame>
          </DCArtboard>
          <DCArtboard id="v-scan"      label="Scan · 對焦"        width={PHONE_W} height={PHONE_H}>
            <Frame dark><VerdeScan/></Frame>
          </DCArtboard>
          <DCArtboard id="v-confirm"   label="Confirm · 結果"     width={PHONE_W} height={PHONE_H}>
            <Frame><VerdeConfirm/></Frame>
          </DCArtboard>
          <DCArtboard id="v-inventory" label="Pantry · 我的冰箱"  width={PHONE_W} height={PHONE_H}>
            <Frame><VerdeInventory/></Frame>
          </DCArtboard>
          <DCArtboard id="v-recipe"    label="Recipe · 食譜"      width={PHONE_W} height={PHONE_H}>
            <Frame><VerdeRecipe/></Frame>
          </DCArtboard>
        </DCSection>

        {/* ─── Direction 03 · Pantry OS ────────────────────── */}
        <DCSection
          id="pantry-os"
          title="03 · Pantry OS"
          subtitle="暗色 AI 終端 · 深森林 / 霓虹萊姆 / 暖橘 · Geist Mono · HUD overlays"
        >
          <DCArtboard id="p-home"      label="Dashboard · 狀態"   width={PHONE_W} height={PHONE_H}>
            <Frame dark><PantryHome/></Frame>
          </DCArtboard>
          <DCArtboard id="p-scan"      label="Scan · live HUD"    width={PHONE_W} height={PHONE_H}>
            <Frame dark><PantryScan/></Frame>
          </DCArtboard>
          <DCArtboard id="p-confirm"   label="Match · 詳細"       width={PHONE_W} height={PHONE_H}>
            <Frame dark><PantryConfirm/></Frame>
          </DCArtboard>
          <DCArtboard id="p-inventory" label="inventory.db"       width={PHONE_W} height={PHONE_H}>
            <Frame dark><PantryInventory/></Frame>
          </DCArtboard>
          <DCArtboard id="p-recipe"    label="recipe.r1"          width={PHONE_W} height={PHONE_H}>
            <Frame dark><PantryRecipe/></Frame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="操作">
          <div style={{ fontSize:12, color:'#6b6760', lineHeight:1.6 }}>
            滾輪縮放 · 拖曳平移 · 卡片標籤旁的 <b>▢</b> 進入全螢幕、<b>⠿</b> 拖移排序、<b>···</b> 刪除。
          </div>
        </TweakSection>

        <TweakSection label="Direction 01 · Mercado">
          <div style={{ fontSize:12, color:'#6b6760', lineHeight:1.6 }}>
            食物雜誌風 — 大襯線、編號、紙感。最有 editorial 風骨,適合做品牌定位高的版本。
          </div>
        </TweakSection>

        <TweakSection label="Direction 02 · Verde">
          <div style={{ fontSize:12, color:'#6b6760', lineHeight:1.6 }}>
            鮮綠市場風 — 圓潤、彩色、卡片化。最容易上手、量產畫面方便,適合一般 C 端 app。
          </div>
        </TweakSection>

        <TweakSection label="Direction 03 · Pantry OS">
          <div style={{ fontSize:12, color:'#6b6760', lineHeight:1.6 }}>
            暗色 AI 終端機風 — HUD、monospace、信心分數可視化。最能展現「這是 AI 應用」。
          </div>
        </TweakSection>

        <TweakSection label="下一步">
          <div style={{ fontSize:12, color:'#6b6760', lineHeight:1.6 }}>
            告訴我:<br/>
            · 想往哪個方向細化?<br/>
            · 還想看哪些畫面?(設定、家人共享、條碼掃描、推播…)<br/>
            · 食材照片要換成可拖放真實照片嗎?
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
