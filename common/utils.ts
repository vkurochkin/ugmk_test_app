export const getMonthFromDateStr = (date: string): number => {
    return +date.split('/')[1] - 1;
}