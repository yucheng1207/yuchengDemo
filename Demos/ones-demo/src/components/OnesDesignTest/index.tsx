
import React, { useCallback, useState } from 'react';
import { Button } from '@ones-design/core';

const OnesDesignTest: React.FunctionComponent<{}> = function (props) {
	const [loading, setLoading] = useState(false)
	const handleClick = useCallback(() => {
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 5000)
	}, [])
	return (
		<div style={{fontFamily: 'PingFang SC,"微软雅黑",Arial'}}>
			<Button loading={loading} onClick={handleClick}>123</Button>
			<Button type="primary" disabled={false} loading={loading} onClick={handleClick}>123</Button>
		</div>
	)
}

export default OnesDesignTest

