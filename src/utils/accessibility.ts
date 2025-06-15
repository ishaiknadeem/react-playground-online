
export const ARIA_LABELS = {
  dashboard: {
    sidebar: 'Main navigation sidebar',
    toggleSidebar: 'Toggle navigation sidebar',
    userMenu: 'User account menu',
    notifications: 'Notifications panel',
    searchExams: 'Search through your exams',
    examCard: 'Exam details card',
    examActions: 'Exam actions menu'
  },
  exam: {
    timer: 'Exam timer',
    codeEditor: 'Code editor for writing solutions',
    testResults: 'Test results panel',
    submitExam: 'Submit exam for grading',
    nextQuestion: 'Navigate to next question',
    previousQuestion: 'Navigate to previous question'
  },
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    error: 'Field has validation error',
    success: 'Field is valid'
  }
} as const;

export const KEYBOARD_SHORTCUTS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
} as const;

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === KEYBOARD_SHORTCUTS.TAB) {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};
