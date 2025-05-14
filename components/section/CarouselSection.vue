<template>
  <div
    v-if="props.items && props.items.length"
    class="carousel-container relative mx-auto mt-16"
    :class="containerWidthClass"
  >
    <div
      class="carousel-image-wrapper overflow-hidden rounded-lg"
      :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
      ref="imageWrapperRef"
      @mousedown.prevent="handleMouseDown"
      @touchstart.prevent="handleTouchStart"
    >
      <div
        class="carousel-track flex"
        ref="trackRef"
        :style="carouselTrackStyle"
      >
        <div
          v-for="(item, index) in visibleSlides"
          :key="`slide-${item.id || item.url}-${item.originalIndex}-${index}`"
          class="carousel-slide"
          :style="slideStyle"
        >
          <div
            class="slide-content-wrapper relative group bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col"
          >
            <img
              :src="item.url"
              :alt="item.alt || `Image ${index + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div
              v-if="item.legend"
              class="dark-overlay absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out"
              aria-hidden="true"
            ></div>
            <div
              v-if="item.legend"
              class="legend-text-container absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            >
              <span class="text-white text-center text-lg font-semibold">{{
                item.legend
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="canScroll"
      @click="() => slideTo('prev')"
      class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
      aria-label="Précédent"
    >
      &#10094;
    </button>
    <button
      v-if="canScroll"
      @click="() => slideTo('next')"
      class="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 md:translate-x-8 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
      aria-label="Suivant"
    >
      &#10095;
    </button>
  </div>
  <div v-else class="text-center p-4">
    <span v-if="props.items && props.items.length === 0"
      >Aucune image à afficher.</span
    >
    <span v-else>Chargement...</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

interface CarouselItemInternal extends CarouselItem {
  originalIndex: number;
  uniqueKey: string;
}

interface CarouselItem {
  id?: string | number;
  url: string;
  alt?: string;
  legend?: string;
}

const props = defineProps<{
  items: CarouselItem[];
  itemsToShowDefault?: number;
  gapSize?: string;
  containerWidthClass?: string;
  loop?: boolean;
}>();

const imageWrapperRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

const viewportWidthPx = ref(0);
const calculatedSlideWidthPx = ref(0);
const calculatedGapPx = ref(0);
const transitionDurationMs = 500;
const itemsToShow = ref(props.itemsToShowDefault || 1);

const visibleSlides = ref<CarouselItemInternal[]>([]);
const currentIndexInOriginals = ref(0);
const currentTrackTranslateX = ref(0);
const isSliding = ref(false);

const isDragging = ref(false);
const dragStartX = ref(0);
const dragCurrentX = ref(0);
const dragThreshold = 50;

const slideGap = computed(() => props.gapSize || '8px');
const containerWidthClass = computed(
  () => props.containerWidthClass || 'w-full'
);
const totalOriginalItems = computed(() => props.items.length);
const canScroll = computed(
  () => totalOriginalItems.value > itemsToShow.value || props.loop
);

const bufferSlidesCount = computed(() => {
  if (totalOriginalItems.value === 0) return 0;
  if (!props.loop && totalOriginalItems.value < itemsToShow.value + 4) {
    return totalOriginalItems.value;
  }
  return itemsToShow.value + 4;
});

const activeSlideBufferIndex = computed(() => 2);

function populateVisibleSlides() {
  if (totalOriginalItems.value === 0 || bufferSlidesCount.value === 0) {
    visibleSlides.value = [];
    return;
  }

  const newVisibleSlides: CarouselItemInternal[] = [];
  const activeIdx = activeSlideBufferIndex.value;

  for (let i = 0; i < bufferSlidesCount.value; i++) {
    let originalItemIndex =
      (currentIndexInOriginals.value +
        i -
        activeIdx +
        totalOriginalItems.value * 1000) %
      totalOriginalItems.value;

    newVisibleSlides.push({
      ...props.items[originalItemIndex],
      originalIndex: originalItemIndex,
      uniqueKey: `${
        props.items[originalItemIndex].id || props.items[originalItemIndex].url
      }-${originalItemIndex}-${Date.now()}-${i}`,
    });
  }
  visibleSlides.value = newVisibleSlides;

  currentTrackTranslateX.value =
    (calculatedSlideWidthPx.value + calculatedGapPx.value) * activeIdx;
}

watch(
  () => [props.items, currentIndexInOriginals.value, itemsToShow.value],
  populateVisibleSlides,
  { immediate: true, deep: true }
);

function parseUnitToPx(valueStr: string, rootFontSize = 16): number {
  if (!valueStr) return 0;
  if (valueStr.endsWith('px')) return parseFloat(valueStr);
  if (valueStr.endsWith('rem')) return parseFloat(valueStr) * rootFontSize;
  return 0;
}

const calculateDimensions = () => {
  if (imageWrapperRef.value) {
    viewportWidthPx.value = imageWrapperRef.value.clientWidth;
    calculatedGapPx.value = parseUnitToPx(slideGap.value);
    const N = itemsToShow.value;
    if (N > 0) {
      const totalGapSpaceInViewport = (N - 1) * calculatedGapPx.value;
      calculatedSlideWidthPx.value =
        (viewportWidthPx.value - totalGapSpaceInViewport) / N;
    } else {
      calculatedSlideWidthPx.value = 0;
    }
    populateVisibleSlides();
  }
};

const updateItemsToShowBasedOnScreen = () => {
  itemsToShow.value = props.itemsToShowDefault || 1;
  nextTick(calculateDimensions);
};

onMounted(() => {
  updateItemsToShowBasedOnScreen();
  window.addEventListener('resize', updateItemsToShowBasedOnScreen);
  if (trackRef.value) {
    trackRef.value.addEventListener('transitionend', onSlideTransitionEnd);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsToShowBasedOnScreen);
  if (trackRef.value) {
    trackRef.value.removeEventListener('transitionend', onSlideTransitionEnd);
  }
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
});

const carouselTrackStyle = computed(() => {
  let transformX = -currentTrackTranslateX.value;
  if (isDragging.value) {
    const baseTranslateForDrag =
      (calculatedSlideWidthPx.value + calculatedGapPx.value) *
      activeSlideBufferIndex.value;
    transformX = -(
      baseTranslateForDrag -
      (dragCurrentX.value - dragStartX.value)
    );
  }

  return {
    width: `${
      (calculatedSlideWidthPx.value + calculatedGapPx.value) *
        visibleSlides.value.length -
      calculatedGapPx.value
    }px`,
    transform: `translateX(${transformX}px)`,
    transition:
      isSliding.value && !isDragging.value
        ? `transform ${transitionDurationMs / 1000}s ease-in-out`
        : 'none',
    gap: `${calculatedGapPx.value}px`,
  };
});

const slideStyle = computed(() => ({
  width: `${calculatedSlideWidthPx.value}px`,
  flexShrink: 0,
}));

function slideTo(direction: 'next' | 'prev', fromDrag = false) {
  if (isSliding.value && !fromDrag && !isDragging.value) return;
  if (!props.loop && totalOriginalItems.value <= itemsToShow.value) return;

  isSliding.value = true;

  const slideAmount = calculatedSlideWidthPx.value + calculatedGapPx.value;

  if (direction === 'next') {
    currentTrackTranslateX.value =
      (activeSlideBufferIndex.value + 1) * slideAmount;
  } else {
    currentTrackTranslateX.value =
      (activeSlideBufferIndex.value - 1) * slideAmount;
  }
}

function onSlideTransitionEnd() {
  if (!isSliding.value || isDragging.value) return;

  const activeIdx = activeSlideBufferIndex.value;
  const slideAmount = calculatedSlideWidthPx.value + calculatedGapPx.value;
  const expectedTranslateForNext = (activeIdx + 1) * slideAmount;
  const expectedTranslateForPrev = (activeIdx - 1) * slideAmount;

  let directionDetermined: 'next' | 'prev' | null = null;

  if (Math.abs(currentTrackTranslateX.value - expectedTranslateForNext) < 1) {
    directionDetermined = 'next';
  } else if (
    Math.abs(currentTrackTranslateX.value - expectedTranslateForPrev) < 1
  ) {
    directionDetermined = 'prev';
  }

  if (directionDetermined === 'next') {
    currentIndexInOriginals.value =
      (currentIndexInOriginals.value + 1 + totalOriginalItems.value) %
      totalOriginalItems.value;
  } else if (directionDetermined === 'prev') {
    currentIndexInOriginals.value =
      (currentIndexInOriginals.value - 1 + totalOriginalItems.value) %
      totalOriginalItems.value;
  }

  populateVisibleSlides();
  isSliding.value = false;
}

function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) return;
  if (isSliding.value) {
    const currentTransform = window.getComputedStyle(trackRef.value!).transform;
    if (currentTransform && currentTransform !== 'none') {
      trackRef.value!.style.transform = currentTransform;
    }
    isSliding.value = false;
  }

  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragCurrentX.value = event.clientX;

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mouseleave', handleMouseUp);
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return;
  dragCurrentX.value = event.clientX;
}

function handleMouseUp() {
  if (!isDragging.value) return;

  const dragDistance = dragCurrentX.value - dragStartX.value;

  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('mouseleave', handleMouseUp);

  if (Math.abs(dragDistance) > dragThreshold) {
    isDragging.value = false;
    if (dragDistance < 0) {
      slideTo('next', true);
    } else {
      slideTo('prev', true);
    }
  } else {
    isDragging.value = false;
    currentTrackTranslateX.value =
      (calculatedSlideWidthPx.value + calculatedGapPx.value) *
      activeSlideBufferIndex.value;
    isSliding.value = true;
    setTimeout(() => {
      if (isSliding.value) {
        isSliding.value = false;
        populateVisibleSlides();
      }
    }, transitionDurationMs + 50);
  }
  dragStartX.value = 0;
  dragCurrentX.value = 0;
}

function handleTouchStart(event: TouchEvent) {
  if (isSliding.value) {
    const currentTransform = window.getComputedStyle(trackRef.value!).transform;
    if (currentTransform && currentTransform !== 'none') {
      trackRef.value!.style.transform = currentTransform;
    }
    isSliding.value = false;
  }
  isDragging.value = true;
  dragStartX.value = event.touches[0].clientX;
  dragCurrentX.value = event.touches[0].clientX;

  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('touchcancel', handleTouchEnd);
}

function handleTouchMove(event: TouchEvent) {
  if (!isDragging.value) return;
  dragCurrentX.value = event.touches[0].clientX;
}

function handleTouchEnd() {
  if (!isDragging.value) return;
  const dragDistance = dragCurrentX.value - dragStartX.value;

  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
  window.removeEventListener('touchcancel', handleTouchEnd);

  if (Math.abs(dragDistance) > dragThreshold) {
    isDragging.value = false;
    if (dragDistance < 0) {
      slideTo('next', true);
    } else {
      slideTo('prev', true);
    }
  } else {
    isDragging.value = false;
    currentTrackTranslateX.value =
      (calculatedSlideWidthPx.value + calculatedGapPx.value) *
      activeSlideBufferIndex.value;
    isSliding.value = true;
    setTimeout(() => {
      if (isSliding.value) {
        isSliding.value = false;
        populateVisibleSlides();
      }
    }, transitionDurationMs + 50);
  }
  dragStartX.value = 0;
  dragCurrentX.value = 0;
}
</script>
