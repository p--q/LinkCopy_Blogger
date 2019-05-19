<script>
let bookmarkletfunc = () => {
	let ogp = {
		title: getOGP("title"),
		img: getOGP("image"), 	
		desp: getOGP("description"), 	
		url: document.URL,
		domain: location.host
	};
	let tree = createElem("div", {"class": "blogcard"});
	appendNodes([
		tree, 
		createElem("div", {"class": "blogcard-content"}),
		createElem("div", {"class": "blogcard-image"}),
		createElem("div", {"class": "blogcard-image-wrapper"}),
		createElem("a", {"href": ogp.url, "target": "_blank"}),
		createElem("img", {"alt": "", "src": ogp.img})		
	]); 
	appendNodes([
		tree.childNodes[0], 
		createElem("div", {"class": "blogcard-text"}),
		createElem("div", {"class": "blogcard-title"}),
		createElem("a", {"href": ogp.url, "target": "_blank"}, ogp.title)
	]);  
	appendNodes([
		tree.childNodes[0].childNodes[1], 
		createElem("blockquote", {"cite": ogp.url}),
		createElem("div", {"class": "blogcard-description"}, ogp.desp)
	]);  
	appendNodes([
		tree, 
		createElem("div", {"class": "blogcard-footer"}),
		createElem("a", {"href": ogp.url, "target": "_blank"}, ogp.domain),
	]);		
	refnode = tree.childNodes[1].childNodes[0].childNodes[0];  // テキストノードの前にファビコンを挿入する。
	refnode.parentNode.insertBefore(createElem("img", {"alt": "", "src": "https://www.google.com/s2/favicons?domain={}".replace("{}", ogp.domain)}), refnode);
	prompt('作成されたHTMLをコピーしてください', tree.outerHTML);
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
}
</script>
<a href="javascript:bookmarkletfunc();">ブックマークレットを実行</a>






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



