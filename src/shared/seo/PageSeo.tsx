import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../lib/constants'

type PageSeoProps = {
	title: string
	description: string
	path?: string
	image?: string
	noIndex?: boolean
}

export const PageSeo = ({ title, description, path = '/', image, noIndex = false }: PageSeoProps) => {
	const url = `${SITE_URL}${path === '/' ? '/' : path}`

	return (
		<Helmet>
			<html lang='en' />
			<title>{title}</title>
			<meta name='description' content={description} />
			{noIndex ? <meta name='robots' content='noindex, nofollow' /> : <meta name='robots' content='index, follow' />}
			<link rel='canonical' href={url} />
			<meta property='og:type' content='website' />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:url' content={url} />
			{image ? <meta property='og:image' content={image} /> : null}
			<meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			{image ? <meta name='twitter:image' content={image} /> : null}
		</Helmet>
	)
}
