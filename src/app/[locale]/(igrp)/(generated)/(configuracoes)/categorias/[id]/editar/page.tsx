'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@igrp/igrp-framework-react-design-system';
import CategoriaFormulario from '@/app/[locale]/(igrp)/(generated)/(configuracoes)/categorias/components/categoriaformulario';
import { 
  IGRPPageHeader,
  IGRPButton,
  IGRPFormHandle
} from '@igrp/igrp-framework-react-design-system';

export default function PageEditarComponent() {
  const router = useRouter();
  const params = useParams();
  
  // Memoizar o ID para evitar re-renders desnecessários
  const id = useMemo(() => {
    return params?.id ? String(params.id) : '';
  }, [params?.id]);
  
  const formRef = useRef<IGRPFormHandle<any>>(null);

  // Função para lidar com o clique no botão de atualizar
  const handleUpdate = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  // Função para redirecionar após o envio bem-sucedido
  const afterSubmit = () => {
    router.push('/categorias');
  };

  return (
    <div className={cn('page', 'space-y-6')}>
      <div className={cn('section', ' space-x-6 space-y-6')}>
        <IGRPPageHeader
          name={`pageHeader1`}
          title={`Atualizar Categoria`}
          description={`Atualizar Categoria de Serviço`}
          iconBackButton={`ArrowLeft`}
          showBackButton={true}
          urlBackButton={`/categorias`}
          variant={`h3`}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`button1`}
              variant={`default`}
              size={`lg`}
              showIcon={true}
              iconName={`SaveAll`}
              className={cn()}
              onClick={handleUpdate}
            >
              Atualizar
            </IGRPButton>
          </div>
        </IGRPPageHeader>

        <CategoriaFormulario 
          id={id} 
          formRef={formRef as React.RefObject<IGRPFormHandle<any>>}
          afterSubmit={afterSubmit} 
        />
      </div>
    </div>
  );
}
