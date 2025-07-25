# Ladder of Emotion

## アプリ概要

「Ladder of Emotion」は、ポリヴェーガル理論に基づいた9段階の感情ラダーで、日々の感情状態を記録・可視化できるPWA（プログレッシブWebアプリ）です。感情の変化を追跡し、心の健康をサポートします。

---

## 主な機能（実装済み）

### 感情記録
- 9段階の感情ラダー（単色・説明付き）からワンクリックで記録
- ボタンは画面端まで広がり、上下が隣接した「はしご」デザイン（最上段・最下段のみ角丸、区切り線で階層感を強調）
- 記録時に任意のメモを追加可能
- キーボード操作・Enter/Spaceで記録可

### 統計・可視化
- 総記録数、今日の記録数、平均階数を自動集計
- 記録の推移を折れ線グラフで可視化（期間指定可、画像ダウンロード対応）

### 履歴管理・フィルタ
- 記録履歴を時系列で一覧表示
- 日付・階数・説明・メモで検索フィルタ
- **階数で絞り込み**（ドロップダウンで1〜9階を選択、デザイン刷新）
- **メモありのみ**で絞り込み（チェックボックスもモダンなデザイン）
- 各履歴アイテムに「削除ボタン」設置（ワンクリックで削除確認）
- 全記録の一括削除（確認ダイアログ付き）

### データ管理
- CSV形式でのデータエクスポート（ワンクリック）
- CSVファイルからのデータインポート（既存データに追加）

### UI/UX・アクセシビリティ
- フラット＆単色ベースのモダンなUI、ラダー（はしご）感のあるボタン配置
- 角丸・区切り線・配色で視認性と操作性を両立
- 検索・ドロップダウン・チェックボックスも全体の雰囲気に合わせてデザイン
- レスポンシブデザイン（スマホ・タブレット・PC対応）
- ダークモード対応（OS設定に自動追従）
- キーボード操作・フォーカス表示
- スクリーンリーダー対応

### グラフ機能
- 記録の期間指定グラフ生成（Chart.js使用）
- グラフ画像のダウンロード（html2canvas利用、iOS/Android長押し保存対応）

### セキュリティ
- 履歴リスト生成時は`textContent`を利用し、XSSリスクを排除

### PWA対応
- オフライン利用可（Service Worker）
- ホーム画面追加対応（Web App Manifest）

---

## 使い方

1. 今の気分に最も近い階数をクリック
2. 必要に応じてメモを入力し「記録する」
3. 履歴や統計、グラフで自分の傾向を確認
4. 検索ボックス・階数ドロップダウン・メモありチェックで履歴を絞り込み
5. データのエクスポート/インポートや全削除も可能

---

## 技術仕様

- HTML5, CSS3（Flexbox, 変数, ダークモード）
- JavaScript（ES6+、クラスベース設計）
    - DataManager（データ管理）
    - UIManager（UI制御・ダークモード）
    - ChartManager（グラフ生成・画像出力）
    - App（全体統括・イベント連携）
- Chart.js, html2canvas, luxon
- PWA（Service Worker, Manifest, Local Storage）

---

## ライセンス

MIT

---

## 貢献

バグ報告・機能提案・プルリクエスト歓迎！

---

あなたの心の健康を、毎日の小さな記録からサポートします。 