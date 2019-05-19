//<script>
const bookmarkletfunc = () => {
	let tree
	let txt = window.getSelection().toString();  // 選択文字列を取得。
	if (txt) {  // 選択文字列があるときはただのリンクコピーにする。
		tree = createElem("a", {"href": document.URL, "target": "_blank"}, txt)
	} else {
		const mydomain = "p--q.blogspot.com";
		let ogp = {
			title: getOGP("title") || document.title,
			img: getOGP("image"), 	
			desp: getOGP("description"), 	
			url: document.URL,
			domain: location.host
		};  // OGP設定がないときはページタイトルを取得する。
		if (ogp.img) { // OGP画像のurlが取得できたとき。
			if (ogp.img.startsWith("/")) {  // ドメインがないときは修正する。
				ogp.img = location.protocol + "//" + ogp.domain + ogp.img;
			}
			tree = createElem("div", {"class": "blogcard"});
			appendNodes([
				tree, 
				createElem("div", {"class": "blogcard-content"}),
				createElem("div", {"class": "blogcard-image"}),
				createElem("div", {"class": "blogcard-image-wrapper"}),
				createElem("a", {"href": ogp.url, "target": "_blank"}),
				createElem("img", {"alt": "", "height": "132", "width": "200", "src": ogp.img})		
			]);  // サムネイル画像サイズは決め打ちしている。
		} else {  // OGP画像がないとき。
			tree = createElem("div", {"class": "blogcard blogcard-hasnoimage"});
			appendNodes([
				tree, 
				createElem("div", {"class": "blogcard-content"}),	
			]);  
		}
		appendNodes([
			tree.childNodes[0], 
			createElem("div", {"class": "blogcard-text"}),
			createElem("div", {"class": "blogcard-title"}),
			createElem("a", {"href": ogp.url, "target": "_blank"}, ogp.title)
		]);  
		if (ogp.desp) {  // OGPサマリが取得できたとき。
			if (ogp.domain==maydomain) {  // 自分のドメインからの引用には引用符を挿入しない。
				appendNodes([
					tree.childNodes[0].childNodes[1], 
					createElem("div", {"class": "blogcard-description"}, ogp.desp)
				]);  			
			} else {
				appendNodes([
					tree.childNodes[0].childNodes[1], 
					createElem("blockquote", {"cite": ogp.url}),
					createElem("div", {"class": "blogcard-description"}, ogp.desp)
				]);  		
			}
		}
		appendNodes([
			tree, 
			createElem("div", {"class": "blogcard-footer"}),
			createElem("a", {"href": ogp.url, "target": "_blank"}, ogp.domain),
		]);		
		refnode = tree.childNodes[1].childNodes[0].childNodes[0];  // テキストノードの前にファビコンを挿入する。
		refnode.parentNode.insertBefore(createElem("img", {"alt": "", "src": "https://www.google.com/s2/favicons?domain={}".replace("{}", ogp.domain)}), refnode);
	}
	document.addEventListener("copy", onCopy, true);  // targetは何でもよいので、capture phase、つまりドキュメントから行きの伝播を捉える。
	document.execCommand("copy");   // コピーイベントを発生させる。
	document.removeEventListener("copy", onCopy, true);  // リスナーの除去。
	function getOGP(txt){document.evaluate("//meta[@property='og:{}']/@content".replace("{}", txt), document, null, XPathResult.STRING_TYPE, null).stringValue}
	function createElem(tag, props, txt){
			let elem = document.createElement(tag)
			Object.keys(props).forEach(k => elem.setAttribute(k, props[k]))
			txt && elem.appendChild(document.createTextNode(txt));  // 第３引数があるときはテキストノードとして挿入。
			return elem
		}
	function appendNodes(nodes){nodes.reverse().reduce((prev, curr) => {
		curr.appendChild(prev);  // 子要素prevが返ってしまう。
		return curr  // 親要素を返す。
	})}
	function onCopy(ev) {  // イベントリスナー。	
		html = tree.outerHTML;
		ev.clipboardData.setData("text/plain", html);  // textとしてペーストするとき。必須。これがないとクリップボードに何も渡されない。
		ev.clipboardData.setData("text/html", html);  // htmlとしてペーストするとき。
		ev.preventDefault();  // デフォルトの動作を止める。そうしないとクリップボードに元の値が入ってしまう。
		ev.stopPropagation();  // これよりイベントの伝播を止める。
	};
	

}
//</script>
//<a href="javascript:bookmarkletfunc();">ブックマークレットを実行</a>






//executeInBackground(() => getActiveTab(tab => tab), []  // then()メソッドの引数の関数の引数にtabをそのまま渡す。
//).then(tab => {
//    const oncopy = (ev) => {
//        const txt = window.getSelection().toString() || tab.title;  // 選択文字列があるときはそれをテキストノードにする。
//        const html = '<a href="' + tab.url + '">' + txt + '</a>';
//        ev.clipboardData.setData("text/plain", html);  // textとしてペーストするとき。必須。これがないとクリップボードに何も渡されない。
//        ev.clipboardData.setData("text/html", html);  // htmlとしてペーストするとき。
//        ev.preventDefault();  // デフォルトの動作を止める。そうしないとクリップボードに元の値が入ってしまう。
//        ev.stopPropagation();  // これよりイベントの伝播を止める。
//    };  // イベントリスナー。
//    document.addEventListener("copy", oncopy, true);  // targetは何でもよいので、capture phase、つまりドキュメントから行きの伝播を捉える。
//    document.execCommand("copy");   // コピーイベントを発生させる。
//    document.removeEventListener("copy", oncopy, true);  // リスナーの除去。
//});



