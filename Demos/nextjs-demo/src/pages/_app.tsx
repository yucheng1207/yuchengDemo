import 'src/styles/globals.scss'
import type { AppProps } from 'next/app'
import { IntlContainer } from 'src/components/Message'

/**
 * Measuring performance
 * https://nextjs.org/docs/advanced-features/measuring-performance
 */
export function reportWebVitals(metric: any) {
	console.log('ReportWebVitals', metric)
}

function MyApp({ Component, pageProps }: AppProps) {
	return <IntlContainer>
		<Component {...pageProps} />
	</IntlContainer>
}
export default MyApp
