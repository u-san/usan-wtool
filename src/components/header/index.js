import { h, Component } from 'preact'
import { Link } from 'preact-router'
import styles from './style.less'

export default class Header extends Component {
	render() {
		return (
			<header class={styles.header}>
				<h1>Preact App</h1>
				<nav>
					<Link href="/">Home</Link>
					<Link href="/test">test</Link>
				</nav>
			</header>
		)
	}
}
