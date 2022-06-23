const API_KEY = '' // ここにGCPにて取得したAPIKeyを入れる

const ch_id = ''
/*
ch_idにはチャンネルIDを追加。
以下チャンネルIDの調べ方

取得したいチャンネルを開く
↓
右クリックでソースコードの表示を選ぶ
↓
Ctrl + F で検索窓を開き、「externalId」と検索
↓
その右側にある文字列をコピー、ch_idに貼り付け
この時文字列のみではなく「'文字列'」の形式でコピーすると楽
*/

let url = 'https://www.googleapis.com/youtube/v3/search' // ここは触らない

const getData = () => {
    return $.ajax({
        type: 'GET', // GETリクエスト
        dataType: 'json', // Jsonデータ
        url: url,
        data: {
            key: API_KEY,
            channelId: ch_id,
            part: 'snippet',
            maxResults: 5, // 検索したい件数
            order: 'date', // ソート方法

            /**
             * この辺りについては以下を参照
             * https://developers.google.com/youtube/v3/docs/search?hl=ja
             * ここに検索する際のオプションが記載されている
             */

        },
        error: () => {
            console.error('YouTube動画情報を取得できませんでした。'); // 取得に失敗した際にエラー表示
        }
    });
}

// 以下ajax通信が成功(done)した際に走る処理
getData().done(function (data) {

    console.log(data) // 提出時にデバッグ系は消す、もしくはコメントアウトする

    let items = data.items;
    /**
     * getData()で取得したデータはオブジェクト型で、そのままでは加工しづらい
     * 今回必要なのは動画の情報のみなので
     * dataオブジェクトの中に存在するitems配列を変数itemsに格納する
     * この辺りはconsole.logで表示されているデータを実際みた方が分かりやすい
     */
    let html = []; // html追加用の空の配列を用意

    items.forEach((v) => {
        // 先ほど取り出しておいた配列をループで一つずつ分解、li要素にする

        let videoId = v.id.videoId; // 動画のID
        let snippet = v.snippet; // 動画の詳細部分。ここもログを見るとわかる

        if (v.id.videoId && snippet.title !== 'Private video') {
            // 動画のIDが存在していて動画が非公開じゃない場合に追加する

            html.push(`
                <li>
                タイトル: ${snippet.title}<br>
                投稿日時: ${new Date(snippet.publishedAt).toLocaleString()}<br>
                <iframe width="400" height="225" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>
                </li>
            `);
        }
    });
    $('#result').html(html.join(''));
    // 最後にid=resultのhtml要素にループで作成したhtml要素を追加する
});











