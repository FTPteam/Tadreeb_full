// Temporary single-browser application flow. Never store passwords or document bytes here.
const SELECTED = 'tadreeb-selected-opportunity-v1';
const FORM = 'tadreeb-application-form-v1';
export function selectOpportunity(id) { sessionStorage.setItem(SELECTED, String(id)); }
export function getSelectedOpportunity() { return sessionStorage.getItem(SELECTED); }
export function saveApplicationDraft(form) { sessionStorage.setItem(FORM, JSON.stringify(form)); }
export function getApplicationDraft() { try { return JSON.parse(sessionStorage.getItem(FORM) || 'null'); } catch { return null; } }
export function clearApplicationDraft() { sessionStorage.removeItem(FORM); }
