/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_CATEGORIAS_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/categoriaservico';

// GET: obter categoria por ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Acessar o id dos parâmetros com await conforme exigido pelo Next.js 15
        const { id } = await params;
        
        console.log(`Buscando categoria com ID: ${id}`);
        
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Erro na resposta da API: ${res.status} ${res.statusText}`, errorText);
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText}`);
        }
        
        const categoria = await res.json();
        console.log(`Categoria ${id} encontrada:`, categoria);
        return NextResponse.json(categoria);
        
    } catch (error: any) {
        console.error(`Erro ao buscar categoria:`, error);
        return NextResponse.json(
            { error: `Erro ao buscar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT: atualizar categoria por ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Acessar o id dos parâmetros com await conforme exigido pelo Next.js 15
        const { id } = await params;
        const data = await req.json();
        
        // Verificar se os dados estão no formato correto para a API
        console.log(`Atualizando categoria ${id} com dados:`, JSON.stringify(data, null, 2));
        
        // Garantir que estamos enviando a estrutura correta para a API
        // A API espera um objeto com categoriaServicoId e criarcategoriasservicos
        let requestBody = data;
        
        // Se os dados já estiverem no formato correto, use-os diretamente
        // Caso contrário, construa a estrutura correta
        if (!data.categoriaServicoId || !data.criarcategoriasservicos) {
            console.log('Dados não estão no formato esperado, ajustando estrutura...');
            requestBody = {
                categoriaServicoId: id,
                criarcategoriasservicos: data
            };
        }
        
        console.log('Enviando para API:', JSON.stringify(requestBody, null, 2));
        
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Erro na resposta da API: ${res.status} ${res.statusText}`, errorText);
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText}`);
        }
        
        const categoriaAtualizada = await res.json();
        console.log(`Categoria ${id} atualizada com sucesso:`, categoriaAtualizada);
        return NextResponse.json(categoriaAtualizada);
        
    } catch (error: any) {
        console.error(`Erro ao atualizar categoria:`, error);
        return NextResponse.json(
            { error: `Erro ao atualizar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}

// DELETE: inativar categoria por ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Acessar o id dos parâmetros com await conforme exigido pelo Next.js 15
        const { id } = await params;
        
        console.log(`Inativando categoria com ID: ${id}`);
        
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Erro na resposta da API: ${res.status} ${res.statusText}`, errorText);
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText}`);
        }
        
        console.log(`Categoria ${id} inativada com sucesso`);
        return NextResponse.json({ message: 'Categoria inativada com sucesso' });
        
    } catch (error: any) {
        console.error(`Erro ao inativar categoria:`, error);
        return NextResponse.json(
            { error: `Erro ao inativar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}