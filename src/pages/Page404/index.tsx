import React from 'react'
import { Link } from 'react-router-dom'

import notFound from '../../assets/notfound.png'

const Page404 = () => {
	return (
		<div className='w-full h-screen flex flex-col justify-center items-center'>
			<h1 className='text-center text-2xl'>Erro 404. Página não encontrada</h1>
			<img src={notFound} alt='not found' className='max-w-xs mx-0 my-6' />
			<p className='text-sm text-center'>Não acesse as rotas através da barra de url</p>
			<Link to='/' className='text-white text-center bg-[#132742] py-3 px-5 rounded-xl my-4 mx-3 font-bold sm:hover:scale-105 sm:duration-300'>Voltar para Home</Link>
		</div>
	)
}

export default Page404