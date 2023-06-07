import Link from "next/link";

import { getItems } from "@/actions/produtos";

export default function Lista({ produtos }) {
  return (
    <div className="p-6">
      <h2 className="mb-5 text-3xl font-semibold text-gray-800">Menu de Produtos</h2>
      <ul className="my-7 mx-2 space-y-6">
        {produtos?.map(item => (
          <li key={item.id}>
            <Link
              href={`/produtos/${item.id}`}
              className="p-2 bg-gray-200 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:text-white">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// esse é o uso mais comum da função getStaticProps, além de receber parametros
// da URL e passar para o componente como variáveis válidas, também podemos usar essa função
// para buscar dados de uma API ou banco de dados, e mandar direto para o componente/next
// afim do mesmo ter os dados em tempo de renderização de servidor e ter
// como já usar esses dados no HTML base da aplicação
export async function getStaticProps() {
  const produtos = await getItems();

  return {
    props: {
      produtos,
    },
  };
}
