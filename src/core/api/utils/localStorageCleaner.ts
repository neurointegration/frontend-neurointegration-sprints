export function localStorageClean() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('reflectionDropdownSelected');
    localStorage.removeItem('standupDropdownSelected');
    localStorage.removeItem('historyDropdownSelected');
    localStorage.removeItem('clientStandupDropdownSelected');
    localStorage.removeItem('clientReflectionDropdownSelected');
}