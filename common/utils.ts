export const getMonthFromDateStr = (date: string): number | undefined => {
    if (date) {
        return +date.split('/')[1] - 1;
    }
    
    return undefined;
}