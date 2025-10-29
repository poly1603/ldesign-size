<script lang="ts">
/**
 * @ldesign/size-svelte - SizeSelector Component
 * 
 * Svelte 5 component for size selection
 */

import { createSizeStore, getGlobalSizeStore, type SizeStore } from '../stores'
import type { SizePreset } from '@ldesign/size-core'

interface Props {
  /**
   * Custom size store instance
   * If not provided, will use the global store
   */
  store?: SizeStore

  /**
   * Custom class name
   */
  class?: string

  /**
   * Custom style
   */
  style?: string

  /**
   * Render as dropdown (select) or buttons
   * @default 'select'
   */
  variant?: 'select' | 'buttons'

  /**
   * Size of the buttons (when variant is 'buttons')
   * @default 'medium'
   */
  buttonSize?: 'small' | 'medium' | 'large'

  /**
   * Callback when size changes
   */
  onChange?: (presetName: string) => void
}

let {
  store = getGlobalSizeStore(),
  class: className = '',
  style = '',
  variant = 'select',
  buttonSize = 'medium',
  onChange
}: Props = $props()

// Reactive values from store
let currentPreset = $derived(store.currentPreset)
let presets = $derived(store.presets)

function handleChange(presetName: string) {
  store.applyPreset(presetName)
  onChange?.(presetName)
}

// Button size classes
const buttonSizeStyles = {
  small: 'font-size: 0.875rem; padding: 0.375rem 0.75rem;',
  medium: 'font-size: 1rem; padding: 0.5rem 1rem;',
  large: 'font-size: 1.125rem; padding: 0.625rem 1.25rem;'
}
</script>

{#if variant === 'select'}
  <select
    class={className}
    {style}
    value={currentPreset}
    onchange={(e) => handleChange((e.target as HTMLSelectElement).value)}
  >
    {#each presets as preset (preset.name)}
      <option value={preset.name}>
        {preset.label}
      </option>
    {/each}
  </select>
{:else}
  <div
    class={className}
    style="display: flex; gap: 0.5rem; {style}"
  >
    {#each presets as preset (preset.name)}
      {@const isActive = preset.name === currentPreset}
      <button
        type="button"
        onclick={() => handleChange(preset.name)}
        style="
          {buttonSizeStyles[buttonSize]}
          border: 1px solid #ddd;
          border-radius: 4px;
          background: {isActive ? '#0066ff' : 'white'};
          color: {isActive ? 'white' : '#333'};
          cursor: pointer;
          font-weight: {isActive ? 600 : 400};
          transition: all 0.2s ease;
        "
      >
        {preset.label}
      </button>
    {/each}
  </div>
{/if}

<style>
  select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    color: #333;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  select:hover {
    border-color: #999;
  }

  select:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    transform: scale(0.98);
  }
</style>


