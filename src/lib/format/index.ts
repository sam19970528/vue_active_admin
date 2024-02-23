import type { TextColor, TextColorObject } from "./types";
import { fromPairs, map, replace, toPairs } from "lodash";
import { StatusType, ActiveType, StatusColor } from "@/types/format";

export const transStatus = (status: string | number): TextColor => {
    const statusObject: TextColorObject = {
        0: {
            text: StatusType[0],
            color: StatusColor.gray,
        },
        1: {
            text: StatusType[1],
            color: StatusColor.green,
        },
        9: {
            text: StatusType[9],
            color: StatusColor.red,
        },
    };
    return statusObject[status];
};

export const transActiveBegin = (status: string | number): TextColor => {
    const activeObject: TextColorObject = {
        0: {
            text: ActiveType[0],
            color: "gray",
        },
        1: {
            text: ActiveType[1],
            color: "green",
        },
        9: {
            text: ActiveType[9],
            color: "red",
        },
    };
    return activeObject[status];
};

export const formatHttpsReplaceHttp = (url: string | null): string => {
    const env = import.meta.env.MODE;
    if (env !== "development") return url as string;
    else if (typeof url === "string") {
        return replace(url, "https", "http");
    } else {
        return "";
    }
};
export const formatConditions = (conditions: string) => {
    const parseConditions = JSON.parse(conditions as string);
    const conditionKeys = Object.keys(parseConditions);
    return conditionKeys;
};

// 轉換成[{"123":"456","789":"012"}]
export function formatConditionFromPairs(condition: [string, string][]) {
    return fromPairs(map(condition, innerArr => [innerArr[0], innerArr[1]]));
}
// 轉換成[["123","456"],["789","012"]]
export function formatConditionToPairs(condition: string) {
    const parseCondition = JSON.parse(condition);
    const obj = parseCondition[0];
    const twoDimensionalArray = toPairs(obj);
    return twoDimensionalArray as [string, string][];
}
