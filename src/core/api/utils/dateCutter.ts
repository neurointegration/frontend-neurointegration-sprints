const cutDate = (date: string): string => {
    try {
        const parts = date.split('-');
        return `${parts?.[2]}.${parts?.[1]}`;
    } catch {
        return date;
    }
};

export default cutDate;
