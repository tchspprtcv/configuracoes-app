/* eslint-disable @typescript-eslint/no-unused-vars */
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand, WrapperListaCategoriaServicoDTO } from "../types/categorias";

// Constantes para URLs da API
const API_ENDPOINTS = {
  CATEGORIAS: '/api/categorias',
  CATEGORIA_BY_ID: (id: string) => `/api/categorias/${id}`
};

// Tipos de resposta para as funções
export type FetchCategoriasResponse = {
  list: CategoriaServico[];
  options: Array<{ label: string; value: string }>;
  total: number;
  message: string;
};

type StatusBadgeResponse = {
  iconName?: string;
  bgClass?: string;
  textClass?: string;
  label?: string;
  className?: string;
};

// Opções para filtrar categorias
export type FetchCategoriasOptions = {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
};


/**
 * Busca categorias de serviço com opções de filtragem e paginação
 * 
 * @param {FetchCategoriasOptions} options - Opções para filtragem e paginação
 * @param {string} options.search - Termo de busca para filtrar por nome ou código
 * @param {number} options.page - Número da página para paginação
 * @param {number} options.size - Tamanho da página para paginação
 * @param {string} options.sort - Campo e direção para ordenação
 * @param {AbortSignal} [signal] - Sinal para abortar a requisição
 * @returns {Promise<FetchCategoriasResponse>} Dados das categorias filtradas e metadados
 * @throws {Error} Se a requisição falhar
 */
export async function fetchCategorias(options: FetchCategoriasOptions = {}, signal?: AbortSignal): Promise<FetchCategoriasResponse> {
    const { search = '', page, size, sort } = options;
    
    try {
        // Construir query params para busca, paginação e ordenação
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (page !== undefined) queryParams.append('page', page.toString());
        if (size !== undefined) queryParams.append('size', size.toString());
        if (sort) queryParams.append('sort', sort);
        
        const queryString = queryParams.toString();
        const url = `${API_ENDPOINTS.CATEGORIAS}${queryString ? `?${queryString}` : ''}`;
        
        const res = await fetch(url, { signal });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar categorias: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }

        const raw = await res.json();
        let categorias: CategoriaServico[] = [];
        let total = 0;
        
        // Verificar se a resposta é um wrapper de paginação ou array direto
        if (raw.content && Array.isArray(raw.content)) {
            // Resposta paginada
            const typedResponse = raw as WrapperListaCategoriaServicoDTO;
            categorias = typedResponse.content;
            total = typedResponse.totalElements || categorias.length;
        } else if (Array.isArray(raw)) {
            // Array direto
            categorias = raw as CategoriaServico[];
            total = categorias.length;
        }

        // Se a API não implementa a busca, filtrar localmente
        // Isso é um fallback caso o backend não processe o parâmetro search
        const filtered = search && !url.includes('search=') 
            ? categorias.filter(
                (c: CategoriaServico) =>
                    (c.nome?.toLowerCase() || '').includes(search.toLowerCase()) ||
                    (c.codigo?.toLowerCase() || '').includes(search.toLowerCase())
              )
            : categorias;

        // Preparar opções para o filtro de estado
        // Verificar se há categorias com estados diferentes para criar as opções
        const estadosUnicos = new Set<string>();
        filtered.forEach(c => {
            if (c.estado) estadosUnicos.add(c.estado);
        });
        
        // Criar as opções para o filtro
        const opcoesEstado = Array.from(estadosUnicos).map(estado => ({
            label: estado === 'ATIVO' ? 'Ativo' : 'Inativo',
            value: estado
        }));
        
        // Se não houver estados únicos, usar opções padrão
        const options = opcoesEstado.length > 0 
            ? opcoesEstado 
            : [{ label: 'Ativo', value: 'ATIVO' }, { label: 'Inativo', value: 'INATIVO' }];

        return {
            list: filtered,
            options,
            total: filtered.length,
            message:
                filtered.length > 0 ? 'Dados carregados com sucesso' : 'Nenhuma categoria encontrada',
        };
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar categorias');
    }
}

/**
 * Busca uma categoria de serviço pelo ID
 * 
 * @param {string} id - ID da categoria a ser buscada
 * @param {AbortSignal} [signal] - Sinal para abortar a requisição
 * @returns {Promise<CategoriaServico>} Dados da categoria
 * @throws {Error} Se a requisição falhar ou a categoria não for encontrada
 */
export async function fetchCategoriaById(id: string, signal?: AbortSignal): Promise<CategoriaServico> {
    try {
        const res = await fetch(API_ENDPOINTS.CATEGORIA_BY_ID(id), {
            signal: signal
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar categoria: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        // Propagar erros de abort para que possam ser tratados adequadamente
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('Requisição de categoria abortada');
            throw error;
        }
        
        console.error('Erro ao buscar categoria por ID:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar categoria');
    }
}

/**
 * Cria uma nova categoria de serviço
 * 
 * @param {CreateCategoriasServicosCommand} data - Dados da categoria a ser criada
 * @returns {Promise<CategoriaServico>} Dados da categoria criada
 * @throws {Error} Se a requisição falhar
 */
export async function createCategoria(data: CreateCategoriasServicosCommand): Promise<CategoriaServico> {
    try {
        const res = await fetch(API_ENDPOINTS.CATEGORIAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao criar categoria: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao criar categoria');
    }
}

/**
 * Atualiza uma categoria de serviço existente
 * 
 * @param {string} id - ID da categoria a ser atualizada
 * @param {CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand} data - Dados atualizados da categoria
 * @returns {Promise<CategoriaServico>} Dados da categoria atualizada
 * @throws {Error} Se a requisição falhar
 */
export async function updateCategoria(id: string, data: CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand): Promise<CategoriaServico> {
    try {
        const res = await fetch(API_ENDPOINTS.CATEGORIA_BY_ID(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao atualizar categoria: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao atualizar categoria');
    }
}

/**
 * Inativa uma categoria de serviço
 * 
 * @param {string} id - ID da categoria a ser inativada
 * @returns {Promise<CategoriaServico>} Dados da categoria inativada
 * @throws {Error} Se a requisição falhar
 */
export async function deleteCategoria(id: string): Promise<CategoriaServico> {
    try {
        const res = await fetch(API_ENDPOINTS.CATEGORIA_BY_ID(id), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao inativar categoria: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao inativar categoria:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao inativar categoria');
    }
}

/**
 * Retorna as classes CSS e informações para exibir o badge de status da categoria
 * 
 * @param {CategoriaServico | undefined} categoria - Categoria para a qual gerar o badge
 * @returns {StatusBadgeResponse} Objeto com classes CSS e texto para o badge
 */
export function getStatusBadge(categoria?: CategoriaServico): StatusBadgeResponse {
    if (!categoria) return {};
    
    const isAtivo = categoria.estado === 'ATIVO';
    
    const bgClass = isAtivo
        ? 'bg-green-100 text-green-800 hover:bg-green-100'
        : 'bg-red-100 text-red-800 hover:bg-red-100';

    const label = categoria.estado;
    const iconName = isAtivo ? 'check-circle' : 'x-circle';
    
    return { 
        label, 
        bgClass,
        iconName
    };
}