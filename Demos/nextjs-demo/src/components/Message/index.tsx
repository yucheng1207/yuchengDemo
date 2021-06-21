import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { IntlProvider, MessageFormatElement, useIntl } from "react-intl";
import { getLocales, Locales } from "src/intl";

export const IntlContainer: React.FunctionComponent<{}> = (props) => {
	const router = useRouter()
	const locale = useMemo<Locales>(() => {
		return router.locale as Locales
	}, [router])

	useEffect(() => {
		const { locale, locales, defaultLocale } = router
		console.log(`Current locale: ${locale}, Default locale: ${defaultLocale}, Configured locales: ${JSON.stringify(locales)}`)
	}, [])

	return <div style={{ width: '100%', height: '100%' }}>
		<IntlProvider
			locale={locale}
			messages={getLocales(locale)}
			onError={(err) => {
				// react-intl itself doesn't inherently have any locale-data. Ignore Error
				console.warn(err)
			}}
		>
			{props.children}
		</IntlProvider>
	</div>
}
export function Message(
	id: string | number,
	description?: string | object,
	defaultMessage?: string | MessageFormatElement[]
) {
	const intl = useIntl()
	return intl.formatMessage({ id, description, defaultMessage })
}

export default Message;
