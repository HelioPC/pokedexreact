import React from 'react'
import { Link } from 'react-router-dom'
import notFound from '../../assets/notfound.png'
import { PageSeo } from '../../shared/seo/PageSeo'

const NotFoundPage = () => {
	return (
		<div className='w-full h-screen flex flex-col justify-center items-center'>
			<PageSeo
				title='Page not found | Pokédex'
				description='The requested Pokédex page does not exist.'
				path='/404'
				noIndex
			/>
			<h1 className='text-center text-2xl'>Error 404. Page not found</h1>
			<img src={notFound} alt='Page not found' className='max-w-xs mx-0 my-6' />
			<p className='text-sm text-center'>This Pokémon or page does not exist.</p>
			<Link to='/' className='text-white text-center bg-[#132742] py-3 px-5 rounded-xl my-4 mx-3 font-bold sm:hover:scale-105 sm:duration-300'>Back to Home</Link>
		</div>
	)
}

export default NotFoundPage
