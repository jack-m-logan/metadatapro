<template>
  <section
    id="how-it-works"
    class="relative z-10 py-24 flex items-center justify-center bg-neutral-100"
  >
    <div class="absolute inset-0 z-0 overflow-hidden">
      <CirclesBackground />
    </div>
    
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div class="absolute -top-12 -right-8 z--10 w-48 h-48 pattern-dots" />
      <div class="absolute -bottom-12 -left-8 z--10 w-48 h-48 pattern-dots" />

      <div class="glass-card p-8 sm:p-10">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p class="text-xl text-neutral-600">
            Three simple steps to distribution-ready metadata
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="text-center animate-fade-in">
            <div class="w-16 h-16 bg-secondary-300 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
              1
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-3">
              Upload Your Track
            </h3>
            <p class="text-neutral-600 leading-relaxed">
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
            <p class="text-neutral-600 leading-relaxed">
              Instant analysis of what's missing, wrong, or could be improved for maximum revenue and discoverability.
            </p>
          </div>

          <div class="text-center animate-fade-in">
            <div class="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
              3
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-3">
              Fix & Download
            </h3>
            <p class="text-neutral-600 leading-relaxed">
              One-click fixes for common issues. Download your corrected, distribution-ready file.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import CirclesBackground from '/components/CirclesBackground.vue'
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
}
</style>