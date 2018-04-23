## KOSHIAN delフォームをポップアップで開く 改
このFirefoxアドオンはふたば☆ちゃんねるでdelフォームをポップアップで開く[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN delフォームをポップアップで開く](https://addons.mozilla.org/ja/firefox/addon/koshian-del%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%82%92%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E3%81%A7%E9%96%8B%E3%81%8F/)アドオンを改変したものです。  
カタログからスレのdelフォームをポップアップで開く機能をオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のこしあんアドオン改変版やUserscriptは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)の一覧からどうぞ。  

## 機能
* オリジナルの機能（KOSHIAN delフォームをポップアップで開く）
  - スレ画面でdelフォームをポップアップで開く
* 追加された機能（KOSHIAN delフォームをポップアップで開く 改）
  - カタログからスレのdelフォームをポップアップで開く機能  
    カタログでdelをしたいスレのリンク（スレ画、無ければスレ本文）の上で右クリックしてコンテキストメニューを開き、「delフォームを開く」を選択するとdelフォームがポップアップします。  
  - カタログでdelしたスレを非表示（要 [futaba catalog NG](https://greasyfork.org/ja/scripts/37565-futaba-catalog-ng/)）（デフォルト：無効）  
    futaba catalog NGと連携してカタログでdelしたスレを非表示にします。NGの種類はfutaba catalog NGで「スレNG」にしたときと同じです。  
    このオプションを有効にするときは「delの後ページを移動する」オプションを無効にして下さい。
      

## インストール
[GitHub](https://github.com/akoya-tomo/koshian_del_kai/releases/download/v1.0.0/koshian_del_kai-1.0.0-an.fx.xpi)

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ないときはリンクを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* このアドオンはWebExtensionアドオン対応のFirefox専用です。  
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* フレーム表示では動作しません。  

## 既知の問題
* delフォームの項目が板によって変化しない  
  - delフォームは板によって項目が変化しますが、ポップアップするdelフォームは現状同じ項目しかありません。
 
## 更新履歴
* v1.0.0 2018-04-23
  - KOSHIAN delフォームをポップアップで開く v1.0.2ベース
  - カタログからスレのdelフォームをポップアップで開く機能を追加
  - カタログでdelしたスレを非表示にするオプションを追加
