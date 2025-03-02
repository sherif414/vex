import { ref, Ref } from "vue";

export interface TypeAheadOptions {
  items: Ref<string[]>;
  selectedIndex: Ref<number>;
  timeout?: number;
}

export interface UseTypeAhead {
  handleCharacter: (char: string) => void;
  resetTypeAhead: () => void;
}

export function useTypeAhead({
  items,
  selectedIndex,
  timeout = 500,
}: TypeAheadOptions): UseTypeAhead {
  const typedChars = ref("");
  let resetTimer: NodeJS.Timeout | null = null;

  const resetTypeAhead = () => {
    typedChars.value = "";
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
  };

  const findMatchingIndex = (searchString: string): number => {
    const currentIndex = selectedIndex.value;
    const itemCount = items.value.length;

    // First, try to find matches after the current index
    for (let i = 0; i < itemCount; i++) {
      const index = (currentIndex + i) % itemCount;
      if (items.value[index].toLowerCase().startsWith(searchString.toLowerCase())) {
        return index;
      }
    }

    return currentIndex; // If no match found, keep current selection
  };

  const handleCharacter = (char: string) => {
    // Reset timer if exists
    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    // Add new character to typed string
    typedChars.value += char.toLowerCase();

    // Find and update matching index
    const newIndex = findMatchingIndex(typedChars.value);
    selectedIndex.value = newIndex;

    // Set timer to reset typed characters
    resetTimer = setTimeout(() => {
      resetTypeAhead();
    }, timeout);
  };

  return {
    handleCharacter,
    resetTypeAhead,
  };
}
