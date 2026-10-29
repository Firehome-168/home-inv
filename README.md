# 家用進銷存

家庭用品的購入、使用、庫存與每月支出分析。手機瀏覽器開啟後加到主畫面，用起來就像一般 APP，不需網路也能用。
資料只存在各自的手機裡（瀏覽器 IndexedDB），請定期在「設定 → 備份匯出」保存備份檔。

## 檔案

- index.html：整個程式（畫面、資料庫、圖表）
- manifest.json：APP 名稱與圖示設定
- sw.js：離線快取
- icon-192.png、icon-512.png、icon-maskable-512.png、apple-touch-icon.png：圖示

## 放上 GitHub Pages

1. 到 github.com 登入，右上「+」→「New repository」，名稱例如 `home-inv`，選 Public，按「Create repository」。
2. 在新 repository 頁面按「uploading an existing file」，把本資料夾的檔案全部拖進去（README.md 可不放），按「Commit changes」。
3. 進入「Settings」→ 左邊「Pages」→ Source 選「Deploy from a branch」，Branch 選 `main`、資料夾 `/ (root)`，按「Save」。
4. 約 1～2 分鐘後，網址會是 `https://你的帳號.github.io/home-inv/`。

程式碼是公開的，但每個人的資料只在自己手機上，不會上傳。

## 安裝到手機

- iPhone / iPad：用 Safari 開網址 →「分享」→「加入主畫面」。
- Android：用 Chrome 開網址 → 右上「⋮」→「安裝應用程式」或「加到主畫面」。

## 更新程式

把改好的檔案再上傳到同一個 repository 覆蓋即可；手機下次有網路開啟時會自動換成新版。
改版時請把 sw.js 第一行附近的 `homeinv-v1` 改成 `homeinv-v2`（依序遞增）。

## 分享 (v2.4 起)

- 設定 > 分享 APP > 「分享 APP 網址給親友」：手機跳出分享選單 (可選 LINE)，電腦複製到剪貼簿。親友安裝後是自己獨立的帳本，資料只存在他們自己的手機。
- 銷售 > 商品型錄網頁 > 「分享型錄網址」：把 …/catalog.html 的網址傳給會員 (catalog.html 要先上傳到同一個 GitHub 資料夾)。
- 型錄網頁最下面有「分享這個型錄給朋友」和「安裝家用進銷存 APP」，會員也能安裝 APP 記自己家裡的帳。

## 彙整庫存 (v2.5 起)
- 物品頁「彙整庫存」→「彙整並上傳」：把每項物品目前的庫存數量、平均單價、庫存金額、售價、安全存量存成一份 (記錄時間、裝置、備註)。
- 加入家庭雲端時會自動上傳，家人每台都看得到；沒加入就只存在這台。
- 點開任一份可和現在庫存對照增減、用 LINE 分享、下載 CSV、刪除 (家人那邊也會刪)。

## 家庭雲端同步 (多人共用，v2.3 起)

不需要架伺服器：資料放在 Google 的 Firebase (免費方案即可)，每台裝置匿名登入。只有家庭裝置清單裡的手機能讀寫資料，新手機要用家人給的「協作者 ID」才能加入。
本機仍保留一份資料，沒網路時照常記帳，連上網自動補傳。

### 一次性設定 (管理者做一次，約 10 分鐘)

1. 用 Google 帳號登入 https://console.firebase.google.com ，按「建立專案」，名稱例如 home-inv (Google Analytics 可關閉)。
2. 左側「建構 > Authentication」→「開始使用」→「登入方式」→ 啟用「匿名」。
3. 左側「建構 > Firestore Database」→「建立資料庫」→ 位置選 asia-east1 (台灣) →「以正式版模式啟動」。
4. Firestore 的「規則」分頁：把本資料夾 firestore.rules 的內容整個貼上，按「發布」。
5. 專案總覽旁齒輪「專案設定」→「您的應用程式」→ 按 </> (網頁) 新增應用程式 (名稱隨意，不用勾 Hosting)。
   畫面上的 firebaseConfig = { apiKey: ..., authDomain: ..., projectId: ..., ... } 照抄到 firebase-config.js 對應的欄位。
6. 把 firebase-config.js、index.html、sw.js 上傳到 GitHub (https://github.com/Firehome-168/home-inv/upload/main)。

firebase-config.js 裡的值不是密碼，可以公開；只有家庭裝置清單裡的手機能讀寫，由 firestore.rules 把關。

### 使用方式

- 第一台：設定 > 家庭雲端同步 > 輸入這台裝置名稱 > 「建立家庭帳本」。這台現有資料會上傳成為家庭資料。
- 新增協作者：已加入的任何一台，在「新增協作者」輸入家人裝置名稱 (例如 媽媽手機) > 「產生協作者 ID」，用 LINE 把邀請文字傳給家人。
- 協作者 ID 是 8 碼英數，只限今天 (當天 23:59 到期)，只能用一次；還沒用的可以按「傳送」再傳一次，或按「取消」作廢。
- 家人開啟 APP > 設定 > 家庭雲端同步 > 「通行密碼」輸入 ID + 今天月日 4 碼 (例 10 月 29 日：K7P2M9QX1029) > 「加入家庭」。裝置名稱自動用產生 ID 時取的名稱。
- 加入後自動下載家庭資料，之後任何人記帳，其他人幾秒內就看到。
- 手機遺失或不再使用：在「已加入的裝置」按那台的「移除」，那台立刻無法再讀取家庭資料。
- 標題列 ☁ 綠色 = 同步中；灰色 = 離線。

### 注意

- 加入家庭的裝置，原本的本機資料會被家庭資料取代 (申請前有提醒，可先備份)。
- 家庭同步中，「從備份還原」與「清除全部資料」會影響全家 (每台手機都能做，按之前請先確認)。
- 顯示主題 (深色/淺色)、上次使用的帳戶屬於各台自己的設定，不同步。
- 手機清除瀏覽器資料或重裝 APP 後會變成新的裝置，要請家人再產生一個協作者 ID 重新加入 (家庭資料都在雲端，不會遺失)；舊的那台請在裝置清單按「移除」。
- v2.3 起規則檔 firestore.rules 有更新，已設定過 Firebase 的話，要把新的 firestore.rules 內容重新貼到 Firestore「規則」分頁按「發布」。舊版的邀請連結 (?family=) 已停用。
