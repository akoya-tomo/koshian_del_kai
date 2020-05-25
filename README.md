## <sub><img src="koshian_del/icons/icon-48.png"></sub> KOSHIAN delフォームをポップアップで開く 改
このFirefoxアドオンはふたば☆ちゃんねるでdelフォームをポップアップで開く[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN delフォームをポップアップで開く](https://addons.mozilla.org/ja/firefox/addon/koshian-del%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%82%92%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E3%81%A7%E9%96%8B%E3%81%8F/)の非公式改変版です。  
del送信後の規制時間やdelしたスレ・レスを非表示にする機能をオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のKOSHIAN改変版などのふたば支援ツールは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。  

## 機能
* オリジナルの機能（KOSHIAN delフォームをポップアップで開く）
  - スレ画面でdelフォームをポップアップで開く
* 追加・変更された機能（KOSHIAN delフォームをポップアップで開く 改）
  - ~~カタログからスレのdelフォームをポップアップで開く機能~~  
    ~~カタログでdelをしたいスレのリンク（スレ画、無ければスレ本文）の上で右クリックしてコンテキストメニューを開き、「delフォームを開く」を選択するとdelフォームがポップアップします。~~  
    v2.9.0でふたば標準のプルダウンメニューからの削除依頼に統合しました。  
  - カタログでdelしたスレを非表示（要 [futaba catalog NG](https://greasyfork.org/ja/scripts/37565-futaba-catalog-ng/) v1.3以上）（デフォルト：無効）  
    futaba catalog NGと連携してカタログで「削除依頼（del&NG）」したスレを非表示にします。NGの種類はfutaba catalog NGで「スレNG」にしたときと同じです。  
  - ~~delフォームを各板の項目内容で表示~~  
    ~~delフォームの項目内容が固定になっていたのを、各板の項目内容で表示するようにしました。~~  
    v2.8.0で削除理由の項目は無くなりました。  
  - del送信後の応答メッセージを表示（デフォルト：無効）  
    del送信後のサーバーからの応答メッセージを表示することができます。  
    また、メッセージの表示時間を設定して、メッセージを自動的に閉じることができます。（デフォルト：1000ミリ秒）  
  - ~~ピックアップしたスレからdelフォームを開く（要 [futaba thread highlighter K](https://greasyfork.org/ja/scripts/36639-futaba-thread-highlighter-k/)）~~  
    ~~futaba thread highlighter Kでピックアップしたスレからdelフォームをポップアップで開くことができます。~~  
    v2.9.0でふたば標準のプルダウンメニューからの削除依頼に統合しました。  
  - del送信後の規制時間（デフォルト：5.5秒）  
    del送信後に次にdel送信が可能になるまでの規制時間を設定することができます。  
    規制中は「削除依頼をする」ボタンが無効になり、規制解除までの残り時間が表示されます。  
  - レス送信モードでdelしたレスを非表示（要 KOSHIAN NG (改)）（デフォルト：無効）  
    KOSHIAN NG (改)と連携してレス送信モードでdelしたレスを非表示にします。  
  - スレを閉じたりページをリロードしても「del送信済み」を記憶  
    スレを閉じたりページをリロードしてもdelしたレスに「del送信済み」が残ります。  
    ブラウザを閉じるとクリアされます。  
  - 「delフォームを先読みする」オプション（実験的機能　デフォルト：無効）  
    ページを開くときにdelフォームを先読みして、delフォームを開く速度を改善します。  
    ただし、**Firefox 69以降** で動作する実験的機能になります。  
    del送信時に「refererが空です.」のエラーメッセージが出たときは無効にしてください。  
  - 「レスに\[del\]ボタンを付ける」オプション（デフォルト：有効）  
    メニュー化されたレスNo.の横にdelフォームがポップアップする\[del\]ボタンを付けます。  
    設定の変更は開いているレス送信モードのページを再読み込みすることで反映されます。  

## インストール
**GitHub**  
[![インストールボタン](images/install_button.png "クリックでアドオンをインストール")](https://github.com/akoya-tomo/koshian_del_kai/releases/download/v2.9.1/koshian_del_kai-2.9.1-fx.xpi)

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ないときはインストールボタンを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* アドオン（KOSHIAN リロード拡張（改）・赤福extended）無しでリロードしたときは開いているdelフォームが閉じます。  
* 一度閉じたスレを再び開く、またはページをリロードしたときは「delしたレスを非表示」を有効にしていてもdelしたレスが表示されることがあります。  

## 更新履歴
* v2.9.1 2020-05-25
  - カタログから「削除依頼（del）」でスレNGされる不具合を修正
* v2.9.0 2020-05-22
  - カタログからのdel送信をふたば標準のプルダウンメニューからの削除依頼に統合
* v2.8.0 2020-02-13
  - 削除理由の選択を削除
* v2.7.1 2020-01-31
  - \[del\]ボタンの位置が必ずKOSHIAN 引用メニュー 改の引用ボタンの右側になるように修正
* v2.7.0 2019-11-13
  - 「レスに\[del\]ボタンを付ける」オプションを追加
  - 新レイアウトのカタログの文字スレがdelできない不具合を修正
* v2.6.0 2019-11-11
  - 新レイアウトのカタログに暫定対応
* v2.5.2 2019-09-11
  - delフォームの先読みに失敗したとき、delフォームが初回のみ正常に動作しない不具合を修正
* v2.5.1 2019-08-22
  - 「delフォームを先読みする」オプションを実験的機能として追加
* v2.5.0 2019-08-22
  - delフォームを開く速度を改善
  - リロード監視を修正
* v2.4.0 2019-06-08
  - スレを閉じたりリロードしても「del送信済み」を記憶するように修正
* v2.3.1 2019-05-13
  - 送信ボタンを押したらボタン文字を「送信中...」に変更するように修正
* v2.3.0 2019-05-09
  - ふたばのリロードの仕様変更に対応
* v2.2.1 2019-04-13
  - レス送信モードでメッセージを自動で閉じない設定のときに「del 送信済み」をクリックしてもポップアップが閉じない不具合を修正
  - 「理由がありません」が表示されたときは「del 送信済み」にならないように修正
* v2.2.0 2019-02-17
  - レス送信モードでdelしたレスを非表示にするオプションを追加
  - 規制時間の設定を1秒単位から0.5秒単位に変更
  - 規制時間のデフォルト値を5秒から5.5秒に変更
  - 内部処理の細かな修正
* v2.1.1 2019-01-13
  - 「delの後メッセージを表示する」が有効のときはメッセージ受信で規制時間の計時を開始するように修正
  - 内部処理の細かな修正
* v2.1.0 2019-01-07
  - del送信後の規制時間の設定を追加
  - 「操作が早すぎます」が表示されたときは「del 送信済み」にならないように修正
  - メッセージ非表示時に「del 送信済み」にならない不具合を修正
* v2.0.6 2018-09-14
  - 赤福Extendedのカタログズームに対応
  - delフォームがKOSHIAN改や赤福Extendedのポップアップなどに隠れる不具合を修正
  - 赤福Extendedのリロード検出を修正
* v2.0.5 2018-09-10
  - [赤福Extended](https://toshiakisp.github.io/akahuku-firefox-sp/)のリロードに対応
* v2.0.4 2018-08-31
  - 「カタログでdelしたスレを非表示」が有効の時にdel送信後の応答メッセージが表示されない不具合を修正
* v2.0.3 2018-08-22
  - [KOSHIAN カタログの画像をポップアップで表示](https://addons.mozilla.org/ja/firefox/addon/koshian-image-popuper/)（[改](https://github.com/akoya-tomo/koshian_image_popuper_kai/)）のポップアップ上でdelフォームが正常に開けない不具合を修正
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
