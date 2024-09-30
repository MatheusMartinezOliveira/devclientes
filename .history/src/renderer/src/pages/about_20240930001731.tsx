import { useQuery } from "@tanstack/react-query";

	//Buscar os clientes
	const { data } = useQuery({ queryKey: ['version-app'], queryFn: async () => {
		const response = await window.api.getVersionApp();
		return response;
	} });

export function About(){
	return (
		<div className='flex-1 flex flex-col py-12 px-10 text-white'>
			<h1 className='text-white text-xl lg:text-2xl font-semibold mb-4'>Página Sobre</h1>
				
				<p>Projeto criado no curso<b>@sujeitoprogramdor</b></p>
				<p>Versão atual do projeto: {data}</p>
		</div>
	)
}