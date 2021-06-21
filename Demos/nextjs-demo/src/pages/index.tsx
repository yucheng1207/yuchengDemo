import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import Message from 'src/components/Message/index';
import { Locales } from 'src/intl/index';

export default function Home() {
	const router = useRouter()
	const toggleLocale = useMemo<Locales>(() => {
		const locale = router.locale as Locales
		return locale === Locales.en_US ? Locales.zh_CN : Locales.en_US
	}, [router])

	const src1x = "http://mesh-frontend-static.oss-cn-hangzhou.aliyuncs.com/prod/mesh-website-client/static/image/common/1440.png"
	const src2x = "http://mesh-frontend-static.oss-cn-hangzhou.aliyuncs.com/prod/mesh-website-client/static/image/common/1440%402x.png"
	const src3x = "http://mesh-frontend-static.oss-cn-hangzhou.aliyuncs.com/prod/mesh-website-client/static/image/common/1440%403x.png"

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Image src="/vercel.svg" alt="Vercel Logo" width={72 * 3} height={16 * 3} />
				<p>{Message('HELLO_WORLD')}</p>
				<p>{486}</p>
				<Image src={src3x} alt="test image" width="486" height="190" placeholder="blur" blurDataURL={src1x} />
				<p>{500}</p>
				<Image src={src3x} alt="test image" width="500" height="195" placeholder="blur" blurDataURL={src1x} />
				<Image src={src3x} alt="test image" width="700" height="195" placeholder="blur" blurDataURL={src1x} />
				<p>{972}</p>
				<Image src={src3x} alt="test image" width="972" height="380" placeholder="blur" blurDataURL={src1x} />

				<Image
					loader={({ src, width, quality }) => {
						return `http://mesh-frontend-static.oss-cn-hangzhou.aliyuncs.com/staging/mesh-website-client/static/image/common/${src}?w=${width}&q=${quality || 100}`
					}}
					src="1440.png"
					alt="Picture of the author"
					layout="fixed"
					width={486}
					height={190}
				/>
				{/* <img src={src1x} srcSet={`${src2x} 2x, ${src3x} 3x`} alt="photo" /> */}
			</main>

			<footer className={styles.footer}>
				<button>
					<Link href="/" locale={toggleLocale}>
						<a>{Message('TOGGLE_LOCALE')}</a>
					</Link>
				</button>
				{/* <a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a> */}
			</footer>
		</div>
	)
}
