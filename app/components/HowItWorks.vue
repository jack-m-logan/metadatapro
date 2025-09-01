<template>
  <section
    id="how-it-works"
    class="relative py-20 bg-neutral-100"
  >
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div class="absolute -top-32 -left-32 w-110 h-110 bg-primary-300 rounded-full mix-blend-multiply opacity-50 filter blur-1xl animate-blob-circle" />
      <div class="absolute -top-16 -right-16 w-60 h-60 bg-primary-100 rounded-full mix-blend-multiply filter blur-1xl animate-blob-circle animation-delay-2000" />
      <div class="absolute top-32 left-1/3 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply opacity-60 filter blur-1xl animate-blob-circle animation-delay-4000 -translate-x-1/2 -translate-y-1/2" />
      <div class="absolute -bottom-18 left-1/3 w-100 h-100 bg-primary-200 rounded-full mix-blend-multiply opacity-60 filter blur-1xl animate-blob-circle animation-delay-4000 -translate-x-1/2 -translate-y-1/2" />
      <div class="absolute -bottom-16 -right-16 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply opacity-50 filter blur-1xl animation-delay-4000 animate-blob-circle" />
      <div class="absolute -bottom-14 -left-20 w-40 h-40 bg-secondary-600 rounded-full mix-blend-multiply opacity-50 filter blur-1xl animation-delay-2000 animate-blob-circle" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 glass-card">
      <div class="text-center mb-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4 mt-8">
          How It Works
        </h2>
        <p class="text-xl text-neutral-600">
          Three simple steps to distribution-ready metadata
        </p>
      </div>

      <div class="absolute -top-12 -right-12 w-48 h-48 pattern-dots transform" />
      <div class="absolute -bottom-12 -left-12 w-48 h-48 pattern-dots transform" />

      <div class="relative max-w-5xl mx-auto p-8 mb-2 rounded-xl">
        <div class="relative grid md:grid-cols-3 gap-8">
          <div class="text-center animate-fade-in">
            <div class="w-16 h-16 bg-secondary-300 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-3">
              Upload Your Track
            </h3>
            <p class="text-neutral-600">
              Drag & drop your audio file. We extract and analyze all metadata automatically.
            </p>
          </div>

          <div class="text-center animate-fade-in">
            <div class="w-16 h-16 bg-secondary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-3">
              Get Validation Report
            </h3>
            <p class="text-neutral-600">
              Instant analysis of what's missing, wrong, or could be improved for maximum revenue and discoverability.
            </p>
          </div>

          <div class="text-center animate-fade-in">
            <div class="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-3">
              Fix & Download
            </h3>
            <p class="text-neutral-600">
              One-click fixes for common issues. Download your corrected, distribution-ready file.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>