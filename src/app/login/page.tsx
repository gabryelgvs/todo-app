import { entrar, cadastrar } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; mensagem?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-8 text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-stone-900">Minhas Tarefas</h1>
          <p className="mt-1.5 text-[15px] text-stone-500">Entre ou crie sua conta para continuar</p>
        </div>

        <div className="glass rounded-[28px] p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] ring-1 ring-black/[0.04]">
          {params.erro && (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{params.erro}</p>
          )}
          {params.mensagem && (
            <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-600">{params.mensagem}</p>
          )}

          <form className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block px-1 text-[13px] font-medium text-stone-500">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1.5 w-full rounded-2xl border-0 bg-white/80 px-4 py-3 text-[15px] text-stone-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition focus:shadow-[inset_0_0_0_1.5px_rgba(10,132,255,0.5)]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block px-1 text-[13px] font-medium text-stone-500">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1.5 w-full rounded-2xl border-0 bg-white/80 px-4 py-3 text-[15px] text-stone-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition focus:shadow-[inset_0_0_0_1.5px_rgba(10,132,255,0.5)]"
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-3">
              <button
                formAction={entrar}
                className="press w-full rounded-2xl bg-[#0a84ff] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(10,132,255,0.5)] hover:bg-[#0a7ae8]"
              >
                Entrar
              </button>
              <button
                formAction={cadastrar}
                className="press w-full rounded-2xl bg-stone-900/[0.04] px-4 py-3 text-[15px] font-medium text-stone-700 hover:bg-stone-900/[0.07]"
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
