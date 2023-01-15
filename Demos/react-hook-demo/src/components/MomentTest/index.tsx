import React, { useEffect } from 'react';
import moment from 'moment';
import dayjs from 'dayjs'

const MICROS_OF_MILLI = 1000;

const MomentTest: React.FunctionComponent<{}> = function (props) {

    useEffect(() => {
        const time: any = moment()
        const timeDayjs: any = dayjs()
        console.log('moment', parseInt(`${time / MICROS_OF_MILLI}`, 10))
        console.log('dayjs', parseInt(`${timeDayjs / MICROS_OF_MILLI}`, 10))
        console.log('value of', time.valueOf(), timeDayjs.valueOf())
        console.log('startOf', time.startOf('day'), timeDayjs.startOf('day'))
    }, [])

    return (
        <div>
            MomentTest
        </div>
    )
}

export default MomentTest