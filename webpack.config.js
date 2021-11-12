//entry는 우리가 처리하고자 하는 파일들이야
//client(이름은 자유 ) folder 만들기 client-(css , js )
//1.entry 필요
//2.output 필요
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
	entry: {
		main: "./src/client/js/main.js",
		videoPlayer: "./src/client/js/videoPlayer.js",
		recorder: "./src/client/js/recorder.js",
	},
	mode: "development",
	//자동 저장 리프레쉬
	watch: true,
	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/styles.css"
		}),
	],
	output: {
		filename: "js/[name].js",
		path: path.resolve(__dirname, "assets"),
		clean: true,
	},
	module: {
		rules: [
			{
				//모든 js파일을가져다가 변환 시키고 싶다는 거야
				///\.js$/ = RegExp 정규표션식
				//정규표현식에선 .가 분류 커맨드이므로 그냥 .을 쓸려면 \.을 해줘야 된다.
				//따라서 \.js는 .js이다
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", { targets: "defaults" }]],
					},
				},
			},
			{
				test: /\.scss$/,
				//webpack은 뒤에서 부터 시작하기 때문에 역순으로 적어줘야함
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
};