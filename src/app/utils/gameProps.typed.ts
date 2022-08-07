export interface ISlimeProps { // 史莱姆的属性
    name?: string, // ? 表示可以没有这一项
    health: number, // 0-1
    pos: { x: number, y: number }, // 详细的像素坐标位置
    tags: {
        key: SLIME_TAG,
        value: number, // buff持续了几天
    }[], // 现有buff栏
}
export interface IBuildingProps { // 建筑的属性
    name?: string,
    pos: { x: number, y: number, } // 四个地图格子的左上格在网格上的坐标
    tags: BUILDING_TAG[], // 建筑现有的buff栏
    slots?: ISlimeProps | null[], // 现在提供的四个岗位的工作状态，0: 左上，1: 右上，2: 左下, 3:右下
}

type TileType = 0 // 普通的草地
    | 1 // 建筑
    | -1 // 障碍物
export interface IMapProps {
    shape: boolean[][], // 地图块的贴图信息 true / 有障碍物
    ways: boolean[][], // 地图块的通行信息，true = 无法通行
    buildings: (IBuildingProps | null)[][], // 现在地图的建筑信息（指针）
    infection: number[][], // 地图块的感染模式，0代表未被感染，数字代表当前区域还有几天自然解除感染的倒计时
}
export interface IEntityState {
    slimes: ISlimeProps[], // 地图上史莱姆的状态
    buildings: IBuildingProps[], // 地图上的所有建筑的状态
}
export interface IMapSaveData {
    map: TileType[][], // 现在地图的地图块
    infection: number[][], // 地图块的感染模式，0代表未被感染，数字代表当前区域还有几天自然解除感染的倒计时
    slimes: ISlimeProps[], // 地图上史莱姆的状态
    buildings: IBuildingProps[], // 地图上的所有建筑的状态
}

const slimeTags = [
    'infected',
    'sick',
    'disease',
    'in-slot',
    'antibody',
] as const;
export type SLIME_TAG = (typeof slimeTags)[number];

const buildingTags = [
    'closed',
    'infected',
    'inmmune',
    'disinfected',
] as const;
export type BUILDING_TAG = (typeof buildingTags)[number];