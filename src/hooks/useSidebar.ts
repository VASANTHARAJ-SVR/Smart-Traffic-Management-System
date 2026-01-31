import { useState, useCallback } from 'react';

/**
 * Custom hook to manage sidebar visibility state and handlers
 * @returns Object containing sidebar visibility state and toggle functions
 */
export const useSidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const openSidebar = useCallback(() => {
    setSidebarVisible(true);
  }, []);
  
  const closeSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);
  
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);
  
  return {
    sidebarVisible,
    openSidebar,
    closeSidebar,
    toggleSidebar
  };
}; 