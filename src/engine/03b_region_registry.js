/* ============================================================
   エリアの登録口 (山手線の外、東側): regions/ の各ファイルが REGION({...}) を呼ぶ
   - towns: 地名 [名前, x, z] (エリア表示・地図)
   - hubs: 自動生成の街の性格 { x, z, core, town, style } (core / town の半径と、その外側の街の種類)
   - styles: 長方形ごとの街の種類 [[x0, z0, x1, z1], style]  (soko 倉庫 / park 公園 / towers タワーマンション …)
   - labels: 全体マップのラベル / build(r): 作り込み (名所)
   ============================================================ */
const REGION_DEFS = [];
const REGION = d => REGION_DEFS.push(d);
/*@@REGIONS@@*/
