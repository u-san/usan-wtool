import { h } from 'preact'
import { ActivityIndicator, Button } from 'antd-mobile'
import styles from './style.less'

export default () => {
	return (
		<div class={styles.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<div className={styles.a}>aaa</div>
			<ActivityIndicator />
			<Button type="ghost" size="large" inline>small</Button>
		</div>
	)
}
