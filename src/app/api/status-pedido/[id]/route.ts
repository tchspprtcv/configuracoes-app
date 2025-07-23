/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

// Verificar se a URL da API está definida
if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('[API_ROUTE][ID] NEXT_PUBLIC_API_URL não está definido no ambiente!');
}

const API_STATUS_PEDIDO_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/statusPedido';
console.log('[API_ROUTE][ID] URL da API configurada:', API_STATUS_PEDIDO_URL);

// GET: obter status de pedido por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Acessar o ID dos parâmetros com a sintaxe correta para Next.js
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`);
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const statusPedido = await res.json();
        return NextResponse.json(statusPedido);
        
    } catch (error: any) {
        console.error(`Erro ao buscar status de pedido ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao buscar status de pedido: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT: atualizar status de pedido por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // Acessar o ID dos parâmetros com a sintaxe correta para Next.js
    const { id } = await params;
    const rawData = await req.json();
    
    // Garantir que o ID esteja incluído nos dados e seja um número
    const data = {
        ...rawData,
        id: parseInt(id, 10) // Converter o id para number conforme exigido pela interface UpdateStatusPedidoCommand
    };
    
    console.log(`[API_ROUTE][PUT] Atualizando status de pedido ${id}:`, data);
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        console.log('[API_ROUTE][PUT] Status da resposta:', res.status, res.statusText);
        console.log('[API_ROUTE][PUT] Headers da resposta:', Object.fromEntries([...res.headers.entries()]));
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[API_ROUTE][PUT] Erro texto completo:', errorText);
            
            let errorData = null;
            try {
                errorData = JSON.parse(errorText);
                console.error('[API_ROUTE][PUT] Erro dados JSON:', errorData);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                console.error('[API_ROUTE][PUT] Resposta não é JSON válido');
            }
            
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText} - ${errorText}`);
        }
        
        const statusPedidoAtualizado = await res.json();
        console.log('[API_ROUTE][PUT] Dados da resposta:', statusPedidoAtualizado);
        return NextResponse.json(statusPedidoAtualizado);
        
    } catch (error: any) {
        console.error(`[API_ROUTE][PUT] Erro ao atualizar status de pedido ${id}:`, error);
        console.error("[API_ROUTE][PUT] Stack trace:", error.stack);
        
        // Tentar fornecer mais informações sobre o erro
        const errorMessage = error.message || 'Erro desconhecido';
        const errorStatus = error.status || 500;
        const errorDetails = error.details || {};
        
        return NextResponse.json(
            { 
                error: `Erro ao atualizar status de pedido: ${errorMessage}`,
                details: errorDetails,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: errorStatus }
        );
    }
}

// DELETE: inativar status de pedido por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // Acessar o ID dos parâmetros com a sintaxe correta para Next.js
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        return NextResponse.json({ message: 'Status de pedido inativado com sucesso' });
        
    } catch (error: any) {
        console.error(`Erro ao inativar status de pedido ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao inativar status de pedido: ${error.message}` },
            { status: 500 }
        );
    }
}