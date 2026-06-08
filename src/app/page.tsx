import { createClient } from '@/utils/supabase/server'
import { sair } from './login/actions'
import { criarTarefa, alternarTarefa, apagarTarefa } from './actions'

type Tarefa = {
  id: number
  titulo: string
  concluida: boolean
  prioridade: 'alta' | 'media' | 'baixa'
}

const NIVEIS = [
  {
    chave: 'alta',
    rotulo: 'Alta prioridade',
    cor: '#ff3b30',
    chip: 'bg-[#ff3b30]/10 text-[#d9342a]',
    chipAtivo:
      'peer-checked:bg-[#ff3b30] peer-checked:text-white peer-checked:shadow-[0_6px_16px_-4px_rgba(255,59,48,0.5)]',
  },
  {
    chave: 'media',
    rotulo: 'Média prioridade',
    cor: '#ff9500',
    chip: 'bg-[#ff9500]/10 text-[#cc7700]',
    chipAtivo:
      'peer-checked:bg-[#ff9500] peer-checked:text-white peer-checked:shadow-[0_6px_16px_-4px_rgba(255,149,0,0.5)]',
  },
  {
    chave: 'baixa',
    rotulo: 'Baixa prioridade',
    cor: '#34c759',
    chip: 'bg-[#34c759]/10 text-[#1f9e44]',
    chipAtivo:
      'peer-checked:bg-[#34c759] peer-checked:text-white peer-checked:shadow-[0_6px_16px_-4px_rgba(52,199,89,0.5)]',
  },
] as const

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

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('tarefas')
    .select('id, titulo, concluida, prioridade')
    .order('created_at', { ascending: false })

  const tarefas = (data ?? []) as Tarefa[]

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <header className="mb-8 flex items-center justify-between animate-rise">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-stone-900">Minhas Tarefas</h1>
          <p className="mt-1 text-[13px] text-stone-400">{user?.email}</p>
        </div>
        <form action={sair}>
          <button className="press rounded-full bg-stone-900/[0.05] px-4 py-2 text-[13px] font-medium text-stone-600 hover:bg-stone-900/[0.08]">
            Sair
          </button>
        </form>
      </header>

      <form
        action={criarTarefa}
        className="glass mb-10 animate-rise rounded-[28px] p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.04]"
      >
        <input
          name="titulo"
          type="text"
          placeholder="Adicionar uma tarefa..."
          required
          className="w-full rounded-2xl border-0 bg-white/80 px-4 py-3 text-[15px] text-stone-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-stone-400 focus:shadow-[inset_0_0_0_1.5px_rgba(10,132,255,0.5)]"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex gap-2">
            <legend className="sr-only">Prioridade</legend>
            {NIVEIS.map((nivel, i) => (
              <label key={nivel.chave} className="cursor-pointer">
                <input
                  type="radio"
                  name="prioridade"
                  value={nivel.chave}
                  defaultChecked={i === 1}
                  className="peer sr-only"
                />
                <span
                  className={`press inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium ${nivel.chip} ${nivel.chipAtivo}`}
                >
                  {nivel.rotulo.replace(' prioridade', '')}
                </span>
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            className="press rounded-2xl bg-[#0a84ff] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(10,132,255,0.5)] hover:bg-[#0a7ae8]"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div className="space-y-9">
        {NIVEIS.map((nivel) => {
          const itens = tarefas.filter((t) => t.prioridade === nivel.chave)
          if (itens.length === 0) return null

          return (
            <section key={nivel.chave} className="animate-rise">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: nivel.cor }} />
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-stone-500">{nivel.rotulo}</h2>
                <span className="text-[12px] text-stone-400">{itens.length}</span>
              </div>

              <ul className="glass space-y-0 divide-y divide-stone-900/[0.05] overflow-hidden rounded-[24px] shadow-[0_16px_50px_-24px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.04]">
                {itens.map((tarefa) => (
                  <li key={tarefa.id} className="group flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-white/60">
                    <form action={alternarTarefa.bind(null, tarefa.id, tarefa.concluida)} className="min-w-0 flex-1">
                      <button type="submit" className="press flex w-full items-center gap-3 text-left">
                        <span
                          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[11px] transition ${
                            tarefa.concluida ? 'border-[#0a84ff] bg-[#0a84ff] text-white' : 'border-stone-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span
                          className={`truncate text-[15px] transition ${
                            tarefa.concluida ? 'text-stone-400 line-through' : 'text-stone-800'
                          }`}
                        >
                          {tarefa.titulo}
                        </span>
                      </button>
                    </form>

                    <form action={apagarTarefa.bind(null, tarefa.id)}>
                      <button
                        type="submit"
                        className="press shrink-0 rounded-full p-2 text-stone-300 opacity-0 transition group-hover:opacity-100 hover:bg-[#ff3b30]/10 hover:text-[#ff3b30]"
                        aria-label="Apagar tarefa"
                      >
                        <IconeLixeira />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        {tarefas.length === 0 && (
          <p className="glass animate-rise rounded-[28px] py-14 text-center text-[15px] text-stone-400 ring-1 ring-black/[0.04]">
            Nenhuma tarefa ainda — adicione a primeira acima.
          </p>
        )}
      </div>
    </div>
  )
}
