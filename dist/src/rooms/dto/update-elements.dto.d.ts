import { ElementType } from "@prisma/client";
declare class ElementDto {
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    tableCode?: string;
    seats?: number;
    isRound?: boolean;
    swingDirection?: string;
}
export declare class UpdateElementsDto {
    elements: ElementDto[];
}
export {};
