import React from 'react';
import styles from './index.module.scss'
import Marzipano from '../../components/Marzipano/index';

interface Props {

}

const Home: React.FunctionComponent<Props> = (props) => {
	return <div className={styles.home}>
		<Marzipano />
	</div>
}

export default Home;
