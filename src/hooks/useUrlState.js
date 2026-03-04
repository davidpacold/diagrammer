import { useEffect, useCallback, useState } from 'react';

/**
 * Encode current diagram state into URL hash.
 * Format: #preset=shared-saas&hidden=id1,id2&selected=id3
 */
export const encodeState = (preset, components, selectedNodeId) => {
  const params = new URLSearchParams();
  params.set('preset', preset);

  const hiddenIds = components.filter(c => !c.visible).map(c => c.id);
  if (hiddenIds.length > 0) {
    params.set('hidden', hiddenIds.join(','));
  }

  if (selectedNodeId) {
    params.set('selected', selectedNodeId);
  }

  return '#' + params.toString();
};

/**
 * Parse URL hash into state.
 * Returns null if no hash present.
 */
export const parseUrlState = () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const preset = params.get('preset');
  if (!preset) return null;

  return {
    preset,
    hidden: params.get('hidden')?.split(',').filter(Boolean) || [],
    selected: params.get('selected') || null,
  };
};

/**
 * Hook that syncs diagram state to URL hash.
 */
export const useUrlState = (preset, components, selectedNodeId) => {
  const [copied, setCopied] = useState(false);

  // Update URL hash when state changes (debounced to avoid thrashing during drag)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const hash = encodeState(preset, components, selectedNodeId);
      window.history.replaceState(null, '', hash);
    }, 300);
    return () => clearTimeout(timeout);
  }, [preset, components, selectedNodeId]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const url = window.location.href;
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return { copyLink, copied };
};
