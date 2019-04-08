import 'promise-polyfill'
// import 'isomorphic-fetch';
import fastclick from 'fastclick'
import { h, render } from 'preact'
import './style'

fastclick.attach(document.body)

let root
function init() {
	let App = require('./routes/app').default
	root = render(<App />, document.body, root)
}

if (process.env.NODE_ENV==='production') {
	require('./pwa')
}

if (module.hot) {
	//require('preact/devtools');
	module.hot.accept('./routes/app', () => requestAnimationFrame(init) )
}

init()
