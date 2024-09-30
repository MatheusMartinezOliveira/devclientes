import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'

export function Detail(){
	const { id } = useParams<{ id: string }>();
	
	//Buscar os clientes
	const { data } = useQuery({ queryKey: ['customers'], queryFn: async () => {
		const response = await window.api.fetchAllCustomers();
		//console.log('response => ',response)
		return response;
	} });
	
	return (
		<div>
			<h1>ID: {id}</h1>
		</div>
	)
}