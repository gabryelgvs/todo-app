'use client'

import { useOptimistic, useTransition } from 'react'
import { alternarTarefa, apagarTarefa } from './actions'

function IconeLixeira() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

type Tarefa = {
  id: number
  titulo: string
  concluida: boolean
  prioridade: 'alta' | 'media' | 'baixa'
}

export function TarefaItem({ tarefa, corPrioridade }: { tarefa: Tarefa; corPrioridade?: string }) {
  const [concluidaOtimista, definirOtimista] = useOptimistic(tarefa.concluida)
  const [emAndamento, iniciarTransicao] = useTransition()

  function alternar() {
    iniciarTransicao(async () => {
      definirOtimista(!concluidaOtimista)
      await alternarTarefa(tarefa.id, tarefa.concluida)
    })
  }

  function apagar() {
    iniciarTransicao(async () => {
      await apagarTarefa(tarefa.id)
    })
  }

  return (
    <li
      onClick={alternar}
      className="group relative flex cursor-pointer items-center justify-between gap-3 overflow-hidden px-4 py-3.5 transition hover:bg-[#0a84ff]/[0.06]"
    >
      {emAndamento && (
        <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-[#0a84ff]/10">
          <span className="block h-full w-1/3 animate-[carregando_0.9s_ease-in-out_infinite] rounded-full bg-[#0a84ff]" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        {corPrioridade ? (
          <span
            className="ml-[7px] h-[7px] w-[7px] shrink-0 rounded-full"
            style={{ backgroundColor: corPrioridade }}
          />
        ) : (
          <span
            className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[11px] transition ${
              concluidaOtimista ? 'border-[#0a84ff] bg-[#0a84ff] text-white' : 'border-stone-300 text-transparent'
            }`}
          >
            ✓
          </span>
        )}
        <span
          className={`truncate text-[15px] transition ${
            concluidaOtimista ? 'text-stone-400 line-through' : 'text-stone-800'
          }`}
        >
          {tarefa.titulo}
        </span>
      </div>

      <button
        onClick={(evento) => {
          evento.stopPropagation()
          apagar()
        }}
        className="press shrink-0 rounded-full p-2 text-stone-300 opacity-60 transition group-hover:opacity-100 hover:bg-[#ff3b30]/10 hover:text-[#ff3b30]"
        aria-label="Apagar tarefa"
      >
        <IconeLixeira />
      </button>
    </li>
  )
}
