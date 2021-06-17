import '../styles/globals.css'
import type { AppProps } from 'next/app'

/**
 * Measuring performance
 * https://nextjs.org/docs/advanced-features/measuring-performance
 */
export function reportWebVitals(metric: any) {
	console.log('ReportWebVitals', metric)
}

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
export default MyApp
