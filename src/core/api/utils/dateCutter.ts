export const cutDate = (date: string): string => {
    try {
        const parts = date.split('-');
        return `${parts?.[2]}.${parts?.[1]}`;
    } catch {
        return date;
    }
};

export const formatDate = (date: string): string => {
    try {
        const parts = date.split('-');
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    } catch {
        return date;
    }
};
