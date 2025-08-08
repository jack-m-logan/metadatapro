<template>
  <div class="max-w-sm mx-auto mt-10 space-y-4">
    <h1 class="text-red-800">hello</h1>
    <UCard>
      <UForm :state="{ email, password }" @submit="handleLogin" >
        <UFormGroup label="Email">
          <UInput v-model="email" type="email" />
        </UFormGroup>
        <UFormGroup label="Password">
          <UInput v-model="password" type="password" />
        </UFormGroup>
        <UButton type="submit" label="Login" class="mt-4" />
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">

const email = ref('')
const password = ref('')

const supabase = useNuxtApp().$supabase

const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    alert(error.message)
  } else {
    navigateTo('/dashboard')
  }
}
</script>