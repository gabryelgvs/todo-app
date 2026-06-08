'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function entrar(formData: FormData) {
  const supabase = await createClient()

  const dados = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(dados)

  if (error) {
    redirect('/login?erro=Não foi possível entrar. Verifique seu e-mail e senha.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function cadastrar(formData: FormData) {
  const supabase = await createClient()

  const dados = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(dados)

  if (error) {
    redirect('/login?erro=Não foi possível criar a conta. Tente novamente.')
  }

  redirect('/login?mensagem=Conta criada! Verifique seu e-mail para confirmar o cadastro.')
}

export async function sair() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
