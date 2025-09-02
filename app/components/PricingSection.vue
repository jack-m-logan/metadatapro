<template>
  <section
    id="pricing"
    class="py-20 bg-neutral-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p class="text-xl text-neutral-600">
          Choose the plan that fits your needs.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        <!-- Free Plan -->
        <div class="bg-gradient-to-br from-neutral-100 to-primary-50 rounded-xl flex flex-col h-full">
          <div class="glass-card p-8 flex flex-col h-full rounded-xl">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Free
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-neutral-900">£0</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
              
            <ul class="space-y-3 mb-8 flex-grow relative z-10">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>5 validations per month</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>5 corrections per month</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Basic validation reports</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Email support</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors mt-auto relative z-10"
            >
              Get Started Free
            </NuxtLink>
          </div>
        </div>

        <!-- Pro Artist Plan -->
        <div class="bg-gradient-to-br from-neutral-100 to-primary-50 rounded-xl flex flex-col h-full">
          <div class="glass-card p-8 flex flex-col h-full rounded-xl">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Pro Artist
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-neutral-900">£4.99</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
              
            <ul class="space-y-3 mb-8 flex-grow relative z-10">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Unlimited</strong> validations</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Unlimited</strong> corrections</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Manage 1 artist (and verified aliases)</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Revenue impact calculator</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors mt-auto relative z-10"
            >
              Sign Up For Artist
            </NuxtLink>
          </div>
        </div>

        <!-- Pro Label Plan -->
        <div class="bg-gradient-to-br from-neutral-100 to-primary-50 rounded-xl flex flex-col h-full">
          <div class="glass-card p-8 flex flex-col h-full rounded-xl">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Pro Label
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-neutral-900">£14.99</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
              
            <ul class="space-y-3 mb-8 flex-grow relative z-10">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Everything in Pro Artist</strong></span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Unlimited</strong> artists</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Bulk operations & batch processing</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Portfolio analytics dashboard</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Advanced reporting & exports</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors mt-auto relative z-10"
            >
              Sign Up For Label
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 class="text-xl font-bold text-neutral-900 mb-2">
            💡 VIP Beta Program
          </h3>
          <p class="text-neutral-600 mb-4">
            Get 6 months of Pro features free in exchange for feedback sessions. 
            Help shape the future of metadata management.
          </p>
          <p class="text-sm text-neutral-500">
            Limited spots available • By invitation only
          </p>
        </div>
      </div>
    </div>
  </section>
</template>