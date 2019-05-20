//<script>
const bookmarkletfunc = () => {
	const mydomain = "p--q.blogspot.com";  // 引用符をつけないドメイン。
	let elem; // 要素を入れる変数。
	let selectedtxt = window.getSelection().toString();  // 選択文字列を取得。
	let ogp = {
		title: selectedtxt || getOGP("title") || document.title,
		img: getOGP("image"), 	
		desp: getOGP("description"), 	
		url: document.URL,
		domain: location.host
	};  // 選択文字列があればそれを、OGP設定がないときはページタイトルをタイトルとして取得する。
	if (ogp.img.startsWith("/")) {  // /から始まっているurlはプロトコールとドメインを追加する。
		ogp.img = location.protocol + "//" + ogp.domain + ogp.img;
	}
	let root = createTree([
					[createElem("div", {"class": "blogcard"}),
						[createElem("div", {"class": "blogcard-content"}),
							[createElem("div", {"class": "blogcard-text"}),
								createElem("div", {"class": "blogcard-title"}),
									createElem("a", {"href": ogp.url, "target": "_blank"}, ogp.title)
							],
								createElem("blockquote", {"cite": ogp.url}),
									createElem("div", {"class": "blogcard-description"}, ogp.desp)
						],
							createElem("div", {"class": "blogcard-image"}),
								createElem("div", {"class": "blogcard-image-wrapper"}),
									createElem("a", {"href": ogp.url, "target": "_blank"}),
										createElem("img", {"alt": "", "height": "132", "width": "200", "src": ogp.img})
					],
						createElem("div", {"class": "blogcard-footer"}),
							[createElem("a", {"href": ogp.domain, "target": "_blank"}),
								createElem("img", {"alt": "", "src": "https://www.google.com/s2/favicons?domain={}".replace("{}", ogp.domain)})
							],
								createTxtNode(ogp.domain)
				]) // ルートノードから始まる、ツリーにするノードの配列。サムネイル画像サイズは決め打ちしている。
	if (!ogp.img) { // OGP画像ないとき。		
		root.classList.add("blogcard-hasnoimage");  // ルートノードのクラス名を追加。
		elem = document.evaluate("//div[@class='blogcard-image']", root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
		elem.parentNode.removeChild(elem);  // <div class='blogcard-image'></div>を削除。
	}	
	if (selectedtxt || !ogp.desp) {  // 選択文字列があるとき、または、OGPサマリがないとき。
		elem = document.evaluate("//blockquote", root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
		elem.parentNode.removeChild(elem);  // <blockquote></blockquote>を削除。
	} else if (ogp.domain==mydomain) {  // 自分のドメインのときは引用符のみ削除。			
		elem = document.evaluate("//blockquote", root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
		elem.parentNode.insertBefore(elem.firstElementChild, elem);  // <blockquote>の子要素を親要素に付け替える。
		elem.parentNode.removeChild(elem);  // <blockquote></blockquote>を削除。
	}
	document.addEventListener("copy", onCopy, true);  // targetは何でもよいので、capture phase、つまりドキュメントから行きの伝播を捉える。
	document.execCommand("copy");   // コピーイベントを発生させる。
	document.removeEventListener("copy", onCopy, true);  // リスナーの除去。
	function getOGP(txt){return document.evaluate("//meta[@property='og:{}']/@content".replace("{}", txt), document, null, XPathResult.STRING_TYPE, null).stringValue;}
	function createElem(tag, props, txt){  // タグ名、プロパティの辞書、テキストノードにするテキスト。
		let elem = document.createElement(tag);  // 要素を作成。
		Object.keys(props).forEach(k => elem.setAttribute(k, props[k]));  // 要素のプロパティを設定。				
		txt && elem.appendChild(createTxtNode(txt));  // テキストノードがあれば挿入。		
		return elem;  // 要素を返す。
	}
	function createTxtNode(txt){return document.createTextNode(txt);}  // テキストノードを返す。
	function createTree(nodes){  // ノードの配列を受け取って、再帰的に子要素にしてツリーにして返す。二分木しか作れない。[[A,B,C,D],E,F,G]を渡した場合、BとEの親がAとなる。
		let root;  // ルートを入れる変数。
		nodes.reduce((prev, curr) => {  // prevが親、currが子。
					if (Array.isArray(prev)){  // 親が配列のときはまず子のツリーを作る。
						prev = createTree(prev);  // 配列をツリーにしたルートを取得。
					} 		
					if (!root) {  // ルートがまだ取得できていないとき。
						root = prev;  // 最初のツリーのルートをこのツリーのルートとして取得。
					}
					if (Array.isArray(curr)){  // 子が配列のときはまず子のツリーを作る。
						curr = createTree(curr);  // 配列をツリーにしたルートを取得。
					} 					
					return prev.appendChild(curr);  // 子要素currを返す。
					 }); 			
		return root  // 木のルートを返す。
	}
	function onCopy(ev) {  // イベントリスナー。	
		html = root.outerHTML;  // ツリーをHTML文字列に変換する。
		ev.clipboardData.setData("text/plain", html);  // textとしてペーストするとき。必須。これがないとクリップボードに何も渡されない。
		ev.clipboardData.setData("text/html", html);  // htmlとしてペーストするとき。
		ev.preventDefault();  // デフォルトの動作を止める。そうしないとクリップボードに元の値が入ってしまう。
		ev.stopPropagation();  // これよりイベントの伝播を止める。
	}
};
//</script>
//<a href="javascript:bookmarkletfunc();">ブックマークレットを実行</a>
