'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { z } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from '@igrp/igrp-framework-react-design-system';
import { 
  IGRPForm,
	IGRPInputText,
	IGRPTextarea,
	IGRPSwitch,
	IGRPInputNumber,
	IGRPInputColor 
} from '@igrp/igrp-framework-react-design-system';
import { fetchCategoriaById, createCategoria, updateCategoria } from '@/app/[locale]/(myapp)/actions/categorias';
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '@/app/[locale]/(myapp)/types/categorias';

export default function Categoriaformulario({ id, afterSubmit, formRef } : { id?: string, afterSubmit?: () => void, formRef?: React.RefObject<IGRPFormHandle<any>> }) {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();
  
  // Definir o schema de validação do formulário
  const form1 = z.object({
    catNome: z.string().min(1, "Nome é obrigatório"),
    catCodigo: z.string().min(1, "Código é obrigatório"),
    catDescricao: z.string().optional(),
    catOrdem: z.number().optional(),
    catIcone: z.string().optional(),
    catCor: z.string().optional(),
    catStatus: z.boolean().default(true)
  })

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
    catNome: ``,
    catCodigo: ``,
    catDescricao: ``,
    catOrdem: 1,
    catIcone: ``,
    catCor: `#000000`,
    catStatus: true
  }

  const formform1Ref = useRef<IGRPFormHandle<any>>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Controle para evitar múltiplas chamadas
  const fetchController = useRef<AbortController | null>(null);
  
  // Efeito para carregar os dados da categoria apenas uma vez
  useEffect(() => {
    // Validar se temos um ID válido
    if (!id || id.trim() === '') {
      return;
    }
    
    // Função para carregar os dados da categoria
    const loadCategoriaData = async () => {
      try {
        setIsLoading(true);
        console.log(`Carregando categoria com ID: ${id}`);
        
        const categoria = await fetchCategoriaById(id);
        
        if (categoria) {
          console.log('Categoria carregada:', categoria);
          
          // Mapear os dados da categoria para o formato do formulário
          const formData = {
            catNome: categoria.nome || '',
            catCodigo: categoria.codigo || '',
            catDescricao: categoria.descricao || '',
            catOrdem: categoria.ordem || 1,
            catIcone: categoria.icone || '',
            catCor: categoria.cor || '#000000',
            catStatus: categoria.ativo !== undefined ? categoria.ativo : true
          };
          
          setForm1Data(formData);
          setDataLoaded(true);
        }
      } catch (error: any) {
        console.error('Erro ao carregar categoria:', error);
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: `Erro ao carregar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Carregar apenas se ainda não foi carregado
    if (!dataLoaded) {
      loadCategoriaData();
    }
  }, []); // Executar apenas uma vez no mount



  // Função para lidar com o envio do formulário
  const handleSubmit = async (data: z.infer<Form1ZodType>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Mapear os dados do formulário para o formato esperado pela API
      const categoriaData: CreateCategoriasServicosCommand = {
        nome: data.catNome,
        codigo: data.catCodigo,
        descricao: data.catDescricao,
        ordem: data.catOrdem,
        icone: data.catIcone,
        cor: data.catCor,
        ativo: data.catStatus
      };
      
      let response;
      
      if (id) {
        // Atualizar categoria existente
        // Criar a estrutura correta para UpdateCategoriasServicosCommand
        const updateData: UpdateCategoriasServicosCommand = {
          categoriaServicoId: id,
          criarcategoriasservicos: categoriaData
        };
        
        response = await updateCategoria(id, updateData);
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Categoria atualizada com sucesso!',
        });
      } else {
        // Criar nova categoria
        response = await createCategoria(categoriaData);
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Categoria criada com sucesso!',
        });
      }
      
      // Chamar a função de callback se fornecida
      if (afterSubmit) {
        afterSubmit();
      } else {
        // Redirecionar para a lista de categorias
        router.push('/categorias');
      }
    } catch (error) {
      igrpToast({
        type: 'error',
        title: 'Erro',
        description: `Erro ao ${id ? 'atualizar' : 'criar'} categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sincronizar o formRef interno com o formRef externo, se fornecido
  useEffect(() => {
    if (formRef && formform1Ref.current) {
      // Usando type assertion para garantir compatibilidade de tipos
      (formRef as React.MutableRefObject<IGRPFormHandle<any>>).current = formform1Ref.current;
    }
  }, [formRef]);

  return (
    <div className={cn('component')}>
      { (
        <IGRPForm
          schema={form1}
          validationMode={`onBlur`}
          gridClassName={`grid`}
          formRef={formform1Ref as React.RefObject<IGRPFormHandle<any>>}
          className={cn()}
          onSubmit={handleSubmit}
          defaultValues={form1Data}
        >
          <>
            <div className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-2 ', ' gap-4')}>
              <div className={cn('col-span-6 flex flex-col gap-6')}>
                <IGRPInputText
                  name={`catNome`}
                  label={`Nome`}
                  showIcon={false}
                  required={true}
                  disabled={isSubmitting}
                >
                </IGRPInputText>
                <IGRPInputText
                  name={`catCodigo`}
                  label={`Código`}
                  showIcon={false}
                  required={true}
                  disabled={isSubmitting}
                >
                </IGRPInputText>
                <IGRPTextarea
                  name={`catDescricao`}
                  label={`Descrição`}
                  rows={3}
                  required={false}
                  disabled={isSubmitting}
                >
                </IGRPTextarea>
                <IGRPSwitch
                  name={`catStatus`}
                  label={`Ativo?`}
                  gridSize={`full`}
                  required={true}
                  disabled={isSubmitting}
                >
                </IGRPSwitch>
              </div>
              <div className={cn('col-span-6 flex flex-col gap-6')}>
                <IGRPInputNumber
                  name={`catOrdem`}
                  label={`Ordem`}
                  max={9999999}
                  step={1}
                  required={false}
                  disabled={isSubmitting}
                >
                </IGRPInputNumber>
                <IGRPInputText
                  name={`catIcone`}
                  label={`Icon`}
                  showIcon={false}
                  required={false}
                  disabled={isSubmitting}
                >
                </IGRPInputText>
                <IGRPInputColor
                  name={`catCor`}
                  label={`Cor`}
                  defaultValue={`#000000`}
                  showHexValue={true}
                  required={false}
                  disabled={isSubmitting}
                >
                </IGRPInputColor>
              </div>
            </div>
          </>
        </IGRPForm>
      )}
    </div>
  );
}