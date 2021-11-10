import React from 'react';
import styles from './index.module.scss'
import Model3D from '../../components/Model3D/index';

interface Props {

}

const Home: React.FunctionComponent<Props> = (props) => {
	return <div className={styles.home}>
		<Model3D />
	</div>
}

export default Home;
