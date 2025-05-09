import { MainSectionType } from "../_types/Statuses";

/**
 * Тип, описывающий вкладку для компонента переключателя между вкладками
 */
export type SectionType = {
    /**
     * Отображаемый заголовок вкладки
     */
    caption: string;
    
    /**
     * Уникальное значение выбранной вкладки
     */
    value: MainSectionType;
};
