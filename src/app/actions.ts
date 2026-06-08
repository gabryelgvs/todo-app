'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function criarTarefa(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const prioridade = (formData.get('prioridade') as string) || 'media'

  if (!titulo || titulo.trim() === '') return

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('tarefas').insert({ titulo, prioridade, usuario_id: user.id })

  revalidatePath('/')
}

export async function alternarTarefa(id: number, concluidaAtual: boolean) {
  const supabase = await createClient()

  await supabase.from('tarefas').update({ concluida: !concluidaAtual }).eq('id', id)

  revalidatePath('/')
}

export async function apagarTarefa(id: number) {
  const supabase = await createClient()

  await supabase.from('tarefas').delete().eq('id', id)

  revalidatePath('/')
}
