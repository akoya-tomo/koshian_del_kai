## <sub><img src="koshian_del/icons/icon-48.png"></sub> KOSHIAN delフォームをポップアップで開く 改
このFirefoxアドオンはふたば☆ちゃんねるでdelフォームをポップアップで開く[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN delフォームをポップアップで開く](https://addons.mozilla.org/ja/firefox/addon/koshian-del%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%82%92%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E3%81%A7%E9%96%8B%E3%81%8F/)の非公式改変版です。  
カタログからスレのdelフォームをポップアップで開く機能をオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のKOSHIAN改変版などのふたば支援ツールは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。  

## 機能
* オリジナルの機能（KOSHIAN delフォームをポップアップで開く）
  - スレ画面でdelフォームをポップアップで開く
* 追加・変更された機能（KOSHIAN delフォームをポップアップで開く 改）
  - カタログからスレのdelフォームをポップアップで開く機能  
    カタログでdelをしたいスレのリンク（スレ画、無ければスレ本文）の上で右クリックしてコンテキストメニューを開き、「delフォームを開く」を選択するとdelフォームがポップアップします。  
  - カタログでdelしたスレを非表示（要 [futaba catalog NG](https://greasyfork.org/ja/scripts/37565-futaba-catalog-ng/) v1.3以上）（デフォルト：無効）  
    futaba catalog NGと連携してカタログでdelしたスレを非表示にします。NGの種類はfutaba catalog NGで「スレNG」にしたときと同じです。  
  - \(New\) delフォームを各板の項目内容で表示  
    delフォームの項目内容が固定になっていたのを、各板の項目内容で表示するようにしました。  
  - \(New\) del送信後の応答メッセージを表示  
    del送信後のサーバーからの応答メッセージを表示することができます。  
    また、メッセージの表示時間を設定して、メッセージを自動的に閉じることができます。  
  - \(New\) ピックアップしたスレからdelフォームを開く（要 [futaba thread highlighter K](https://greasyfork.org/ja/scripts/36639-futaba-thread-highlighter-k/)）  
    futaba thread highlighter Kでピックアップしたスレからdelフォームをポップアップで開くことができます。  

## インストール
**GitHub**  
[![インストールボタン](images/install_button.png "クリックでアドオンをインストール")](https://github.com/akoya-tomo/koshian_del_kai/releases/download/v2.0.2/koshian_del_kai-2.0.2-an+fx.xpi)

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ないときはインストールボタンを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  

## 更新履歴
* v2.0.2 2018-07-14
  - delフォームのラジオボタンの横のテキストをクリックでもチェックできるように修正
  - 前回del送信した項目がチェックされた状態でdelフォームが開くように修正
* v2.0.1 2018-07-12
  - カタログからdelフォームを開くときの処理を修正
* v2.0.0 2018-07-12
  - delフォームを各板の項目内容で表示するように変更
  - del送信後の応答メッセージを表示するように変更
  - ピックアップしたスレからdelフォームを開けるように変更
* v1.0.1 2018-06-29
  - フレーム表示のカタログで動作するように修正
* v1.0.0 2018-04-23
  - KOSHIAN delフォームをポップアップで開く v1.0.2ベース
  - カタログからスレのdelフォームをポップアップで開く機能を追加
  - カタログでdelしたスレを非表示にするオプションを追加
